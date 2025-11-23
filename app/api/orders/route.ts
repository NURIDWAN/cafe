import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, getOrderStats } from "@/app/actions/orders";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const orderSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    totalAmount: z.number().min(0, "Total amount must be at least 0"),
    paymentId: z.string().optional(),
    status: z.enum(["pending", "paid", "completed", "cancelled"]).optional().default("pending"),
});

// GET /api/orders - Get all orders (with optional query parameters)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const userId = searchParams.get("userId");
        const stats = searchParams.get("stats");

        if (stats === "true") {
            const orderStats = await getOrderStats();
            return NextResponse.json({ success: true, data: orderStats });
        }

        let query = db
            .select({
                id: orders.id,
                userId: orders.userId,
                status: orders.status,
                totalAmount: orders.totalAmount,
                paymentId: orders.paymentId,
                createdAt: orders.createdAt,
                updatedAt: orders.updatedAt,
            })
            .from(orders)
            .orderBy(desc(orders.createdAt));

        if (status) {
            // We would need to modify this to include proper filtering
            // For now, we'll return all and filter in the actions
        }

        if (userId) {
            // We would need to modify this to include proper filtering
            // For now, we'll return all and filter in the actions
        }

        const ordersList = await query;

        // Note: We would need to join with user table to get user information
        // This is a simplified version

        return NextResponse.json({ success: true, data: ordersList });
    } catch (error) {
        console.error("GET orders error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedFields = orderSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid data",
                    errors: validatedFields.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { userId, totalAmount, paymentId, status } = validatedFields.data;

        // Note: In a real application, you would verify that the user exists
        // and potentially validate the total amount based on cart items

        const newOrder = await db.insert(orders).values({
            id: crypto.randomUUID(),
            userId,
            status: status || "pending",
            totalAmount: Math.round(totalAmount * 100), // Store in cents
            paymentId: paymentId || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Order created successfully",
            data: newOrder[0],
        });
    } catch (error) {
        console.error("POST order error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create order" },
            { status: 500 }
        );
    }
}