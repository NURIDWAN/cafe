import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orders, reservations } from "@/db/schema";
import { count, and, gte, lte, sql } from "drizzle-orm";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns";
import { id } from "date-fns/locale";
import { jsPDF } from "jspdf";

function getDateRanges() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = subDays(today, 1);

    const dailyStart = today;
    const dailyEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1);
    const prevDailyStart = yesterday;
    const prevDailyEnd = new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1);

    const weeklyStart = startOfWeek(today, { weekStartsOn: 1 });
    const weeklyEnd = endOfWeek(today, { weekStartsOn: 1 });
    const prevWeekStart = subWeeks(weeklyStart, 1);
    const prevWeekEnd = subWeeks(weeklyEnd, 1);

    const monthlyStart = startOfMonth(today);
    const monthlyEnd = endOfMonth(today);
    const prevMonthStart = startOfMonth(subMonths(today, 1));
    const prevMonthEnd = endOfMonth(subMonths(today, 1));

    return {
        daily: { start: dailyStart, end: dailyEnd, prevStart: prevDailyStart, prevEnd: prevDailyEnd },
        weekly: { start: weeklyStart, end: weeklyEnd, prevStart: prevWeekStart, prevEnd: prevWeekEnd },
        monthly: { start: monthlyStart, end: monthlyEnd, prevStart: prevMonthStart, prevEnd: prevMonthEnd },
    };
}

async function getOrderStats(startDate: Date, endDate: Date) {
    const result = await db
        .select({
            count: count(),
            total: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)`,
        })
        .from(orders)
        .where(
            and(
                gte(orders.createdAt, startDate),
                lte(orders.createdAt, endDate)
            )
        );
    return result[0] || { count: 0, total: 0 };
}

async function getReservationStats(startDate: Date, endDate: Date) {
    const result = await db
        .select({ count: count() })
        .from(reservations)
        .where(
            and(
                gte(reservations.createdAt, startDate),
                lte(reservations.createdAt, endDate)
            )
        );
    return result[0]?.count || 0;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

function calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}

// Simple table drawing function
function drawTable(doc: jsPDF, startY: number, headers: string[], rows: string[][], colWidths: number[]) {
    const startX = 14;
    const cellPadding = 3;
    const rowHeight = 8;
    const fontSize = 9;

    doc.setFontSize(fontSize);

    // Draw header
    doc.setFillColor(139, 90, 43);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");

    let x = startX;
    let y = startY;

    // Header background
    const totalWidth = colWidths.reduce((a, b) => a + b, 0);
    doc.rect(startX, y, totalWidth, rowHeight, 'F');

    // Header text
    headers.forEach((header, i) => {
        doc.text(header, x + cellPadding, y + rowHeight - 2);
        x += colWidths[i];
    });

    y += rowHeight;

    // Draw rows
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    rows.forEach((row, rowIndex) => {
        x = startX;

        // Alternate row background
        if (rowIndex % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(startX, y, totalWidth, rowHeight, 'F');
        }

        row.forEach((cell, i) => {
            const cellText = cell.length > 20 ? cell.substring(0, 17) + '...' : cell;
            doc.text(cellText, x + cellPadding, y + rowHeight - 2);
            x += colWidths[i];
        });

        y += rowHeight;
    });

    // Draw borders
    doc.setDrawColor(200, 200, 200);
    doc.rect(startX, startY, totalWidth, (rows.length + 1) * rowHeight);

    return y + 5;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const periodParam = searchParams.get("period");
    const period = (periodParam === "weekly" || periodParam === "monthly") ? periodParam : "daily";

    try {
        const dateRanges = getDateRanges();
        const range = dateRanges[period];

        // Get stats
        const [currentOrders, prevOrders, currentReservations, prevReservations] = await Promise.all([
            getOrderStats(range.start, range.end),
            getOrderStats(range.prevStart, range.prevEnd),
            getReservationStats(range.start, range.end),
            getReservationStats(range.prevStart, range.prevEnd),
        ]);

        // Calculate growth
        const orderGrowth = calculateGrowth(currentOrders.count, prevOrders.count);
        const revenueGrowth = calculateGrowth(Number(currentOrders.total), Number(prevOrders.total));
        const reservationGrowth = calculateGrowth(currentReservations, prevReservations);

        // Period labels
        const periodLabels: Record<string, string> = {
            daily: "Harian",
            weekly: "Mingguan",
            monthly: "Bulanan",
        };

        // Create PDF
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(139, 90, 43);
        doc.text("Modern Aesthetic Cafe", pageWidth / 2, 25, { align: "center" });

        doc.setFontSize(16);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "normal");
        doc.text(`Laporan ${periodLabels[period]}`, pageWidth / 2, 35, { align: "center" });

        // Date range
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        const dateRangeText = period === "daily"
            ? format(range.start, "dd MMMM yyyy", { locale: id })
            : `${format(range.start, "dd MMMM yyyy", { locale: id })} - ${format(range.end, "dd MMMM yyyy", { locale: id })}`;
        doc.text(dateRangeText, pageWidth / 2, 43, { align: "center" });

        doc.setFontSize(9);
        doc.text(`Dibuat: ${format(new Date(), "dd MMMM yyyy, HH:mm", { locale: id })}`, pageWidth / 2, 50, { align: "center" });

        // Divider line
        doc.setDrawColor(139, 90, 43);
        doc.setLineWidth(0.5);
        doc.line(14, 55, pageWidth - 14, 55);

        // Summary Section Title
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text("Ringkasan Statistik", 14, 68);

        // Summary Table
        const summaryHeaders = ["Metrik", "Periode Ini", "Periode Lalu", "Perubahan"];
        const summaryRows = [
            [
                "Total Pesanan",
                currentOrders.count.toString(),
                prevOrders.count.toString(),
                `${orderGrowth >= 0 ? "+" : ""}${orderGrowth}%`
            ],
            [
                "Pendapatan",
                formatCurrency(Number(currentOrders.total)),
                formatCurrency(Number(prevOrders.total)),
                `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth}%`
            ],
            [
                "Reservasi",
                currentReservations.toString(),
                prevReservations.toString(),
                `${reservationGrowth >= 0 ? "+" : ""}${reservationGrowth}%`
            ],
            [
                "Rata-rata/Pesanan",
                currentOrders.count > 0 ? formatCurrency(Number(currentOrders.total) / currentOrders.count) : "Rp 0",
                prevOrders.count > 0 ? formatCurrency(Number(prevOrders.total) / prevOrders.count) : "Rp 0",
                "-"
            ],
        ];

        let currentY = drawTable(doc, 73, summaryHeaders, summaryRows, [50, 45, 45, 35]);

        // Performance Summary Section
        currentY += 10;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text("Analisis Performa", 14, currentY);

        currentY += 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);

        // Performance insights
        const insights = [];

        if (orderGrowth > 0) {
            insights.push(`• Pesanan meningkat ${orderGrowth}% dibanding periode sebelumnya`);
        } else if (orderGrowth < 0) {
            insights.push(`• Pesanan menurun ${Math.abs(orderGrowth)}% dibanding periode sebelumnya`);
        } else {
            insights.push(`• Jumlah pesanan sama dengan periode sebelumnya`);
        }

        if (revenueGrowth > 0) {
            insights.push(`• Pendapatan meningkat ${revenueGrowth}% dibanding periode sebelumnya`);
        } else if (revenueGrowth < 0) {
            insights.push(`• Pendapatan menurun ${Math.abs(revenueGrowth)}% dibanding periode sebelumnya`);
        } else {
            insights.push(`• Pendapatan sama dengan periode sebelumnya`);
        }

        if (reservationGrowth > 0) {
            insights.push(`• Reservasi meningkat ${reservationGrowth}% dibanding periode sebelumnya`);
        } else if (reservationGrowth < 0) {
            insights.push(`• Reservasi menurun ${Math.abs(reservationGrowth)}% dibanding periode sebelumnya`);
        } else {
            insights.push(`• Jumlah reservasi sama dengan periode sebelumnya`);
        }

        insights.forEach((insight) => {
            doc.text(insight, 14, currentY);
            currentY += 7;
        });

        // Summary boxes
        currentY += 15;

        // Box 1: Total Pesanan
        doc.setFillColor(254, 243, 199);
        doc.roundedRect(14, currentY, 85, 35, 3, 3, 'F');
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(133, 77, 14);
        doc.text("Total Pesanan Periode Ini", 18, currentY + 10);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(currentOrders.count.toString(), 18, currentY + 25);

        // Box 2: Total Pendapatan
        doc.setFillColor(209, 250, 229);
        doc.roundedRect(105, currentY, 85, 35, 3, 3, 'F');
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(6, 95, 70);
        doc.text("Pendapatan Periode Ini", 109, currentY + 10);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(formatCurrency(Number(currentOrders.total)), 109, currentY + 25);

        // Footer
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            "Modern Aesthetic Cafe - Laporan dihasilkan secara otomatis",
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
        );

        // Generate PDF buffer
        const pdfBuffer = doc.output("arraybuffer");

        // Return PDF as response
        const filename = `laporan-${period}-${format(new Date(), "yyyy-MM-dd")}.pdf`;

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("Error generating PDF:", error);
        return NextResponse.json({
            error: "Failed to generate PDF",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
