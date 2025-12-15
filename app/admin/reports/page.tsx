import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/db/drizzle";
import { orders, products, reservations } from "@/db/schema";
import { count, sum, gte, lte, and, sql } from "drizzle-orm";
import {
    CalendarDays,
    TrendingUp,
    DollarSign,
    ShoppingBag,
    Users,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Download
} from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns";
import { id } from "date-fns/locale";
import { DownloadPDFButton } from "@/components/admin/download-pdf-button";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Helper function to get date ranges
function getDateRanges() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = subDays(today, 1);

    // Daily
    const dailyStart = today;
    const dailyEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1);
    const prevDailyStart = yesterday;
    const prevDailyEnd = new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1);

    // Weekly
    const weeklyStart = startOfWeek(today, { weekStartsOn: 1 });
    const weeklyEnd = endOfWeek(today, { weekStartsOn: 1 });
    const prevWeekStart = subWeeks(weeklyStart, 1);
    const prevWeekEnd = subWeeks(weeklyEnd, 1);

    // Monthly
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

function calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    trend?: number;
    trendLabel?: string;
}

function StatCard({ title, value, description, icon: Icon, trend, trendLabel }: StatCardProps) {
    const isPositive = trend !== undefined && trend >= 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {trend !== undefined && (
                        <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? (
                                <ArrowUpRight className="h-3 w-3" />
                            ) : (
                                <ArrowDownRight className="h-3 w-3" />
                            )}
                            {Math.abs(trend)}%
                        </span>
                    )}
                    <span>{trendLabel || description}</span>
                </div>
            </CardContent>
        </Card>
    );
}

interface ReportTabContentProps {
    period: 'daily' | 'weekly' | 'monthly';
    orderStats: { count: number; total: number };
    prevOrderStats: { count: number; total: number };
    reservationCount: number;
    prevReservationCount: number;
    dateRange: { start: Date; end: Date };
}

function ReportTabContent({
    period,
    orderStats,
    prevOrderStats,
    reservationCount,
    prevReservationCount,
    dateRange
}: ReportTabContentProps) {
    const orderGrowth = calculateGrowth(orderStats.count, prevOrderStats.count);
    const revenueGrowth = calculateGrowth(orderStats.total, prevOrderStats.total);
    const reservationGrowth = calculateGrowth(reservationCount, prevReservationCount);

    const periodLabels = {
        daily: 'dari kemarin',
        weekly: 'dari minggu lalu',
        monthly: 'dari bulan lalu',
    };

    const periodTitles = {
        daily: 'Hari Ini',
        weekly: 'Minggu Ini',
        monthly: 'Bulan Ini',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Laporan {periodTitles[period]}</h3>
                    <p className="text-sm text-muted-foreground">
                        {format(dateRange.start, 'dd MMMM yyyy', { locale: id })}
                        {period !== 'daily' && ` - ${format(dateRange.end, 'dd MMMM yyyy', { locale: id })}`}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <DownloadPDFButton period={period} label="Download PDF" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="hidden sm:inline">Terakhir diperbarui:</span> {format(new Date(), 'HH:mm', { locale: id })}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Pesanan"
                    value={orderStats.count}
                    description="pesanan masuk"
                    icon={ShoppingBag}
                    trend={orderGrowth}
                    trendLabel={periodLabels[period]}
                />
                <StatCard
                    title="Pendapatan"
                    value={formatCurrency(orderStats.total)}
                    description="total pendapatan"
                    icon={DollarSign}
                    trend={revenueGrowth}
                    trendLabel={periodLabels[period]}
                />
                <StatCard
                    title="Reservasi"
                    value={reservationCount}
                    description="reservasi baru"
                    icon={Calendar}
                    trend={reservationGrowth}
                    trendLabel={periodLabels[period]}
                />
                <StatCard
                    title="Rata-rata Pesanan"
                    value={orderStats.count > 0 ? formatCurrency(orderStats.total / orderStats.count) : formatCurrency(0)}
                    description="per transaksi"
                    icon={TrendingUp}
                />
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
                        <CardDescription>Performa pesanan {periodTitles[period].toLowerCase()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Periode Sebelumnya</span>
                                <span className="font-medium">{prevOrderStats.count} pesanan</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Periode Ini</span>
                                <span className="font-medium">{orderStats.count} pesanan</span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-4">
                                <span className="text-sm font-medium">Perubahan</span>
                                <span className={`font-bold ${orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {orderGrowth >= 0 ? '+' : ''}{orderGrowth}%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Ringkasan Pendapatan</CardTitle>
                        <CardDescription>Performa pendapatan {periodTitles[period].toLowerCase()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Periode Sebelumnya</span>
                                <span className="font-medium">{formatCurrency(prevOrderStats.total)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Periode Ini</span>
                                <span className="font-medium">{formatCurrency(orderStats.total)}</span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-4">
                                <span className="text-sm font-medium">Perubahan</span>
                                <span className={`font-bold ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default async function ReportsPage() {
    const dateRanges = getDateRanges();

    // Fetch stats for all periods
    const [
        dailyOrders,
        prevDailyOrders,
        weeklyOrders,
        prevWeeklyOrders,
        monthlyOrders,
        prevMonthlyOrders,
        dailyReservations,
        prevDailyReservations,
        weeklyReservations,
        prevWeeklyReservations,
        monthlyReservations,
        prevMonthlyReservations,
    ] = await Promise.all([
        getOrderStats(dateRanges.daily.start, dateRanges.daily.end),
        getOrderStats(dateRanges.daily.prevStart, dateRanges.daily.prevEnd),
        getOrderStats(dateRanges.weekly.start, dateRanges.weekly.end),
        getOrderStats(dateRanges.weekly.prevStart, dateRanges.weekly.prevEnd),
        getOrderStats(dateRanges.monthly.start, dateRanges.monthly.end),
        getOrderStats(dateRanges.monthly.prevStart, dateRanges.monthly.prevEnd),
        getReservationStats(dateRanges.daily.start, dateRanges.daily.end),
        getReservationStats(dateRanges.daily.prevStart, dateRanges.daily.prevEnd),
        getReservationStats(dateRanges.weekly.start, dateRanges.weekly.end),
        getReservationStats(dateRanges.weekly.prevStart, dateRanges.weekly.prevEnd),
        getReservationStats(dateRanges.monthly.start, dateRanges.monthly.end),
        getReservationStats(dateRanges.monthly.prevStart, dateRanges.monthly.prevEnd),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Laporan</h1>
                <p className="text-muted-foreground">
                    Lihat laporan penjualan dan reservasi harian, mingguan, dan bulanan.
                </p>
            </div>

            <Tabs defaultValue="daily" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="daily" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Harian
                    </TabsTrigger>
                    <TabsTrigger value="weekly" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Mingguan
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Bulanan
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="daily">
                    <ReportTabContent
                        period="daily"
                        orderStats={dailyOrders}
                        prevOrderStats={prevDailyOrders}
                        reservationCount={dailyReservations}
                        prevReservationCount={prevDailyReservations}
                        dateRange={{ start: dateRanges.daily.start, end: dateRanges.daily.end }}
                    />
                </TabsContent>

                <TabsContent value="weekly">
                    <ReportTabContent
                        period="weekly"
                        orderStats={weeklyOrders}
                        prevOrderStats={prevWeeklyOrders}
                        reservationCount={weeklyReservations}
                        prevReservationCount={prevWeeklyReservations}
                        dateRange={{ start: dateRanges.weekly.start, end: dateRanges.weekly.end }}
                    />
                </TabsContent>

                <TabsContent value="monthly">
                    <ReportTabContent
                        period="monthly"
                        orderStats={monthlyOrders}
                        prevOrderStats={prevMonthlyOrders}
                        reservationCount={monthlyReservations}
                        prevReservationCount={prevMonthlyReservations}
                        dateRange={{ start: dateRanges.monthly.start, end: dateRanges.monthly.end }}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
