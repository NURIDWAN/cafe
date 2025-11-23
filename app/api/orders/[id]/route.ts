import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/app/actions/orders";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const orderUpdateSchema = z.object({
    status: z.enum(["pending", "paid", "completed", "cancelled"]).optional(),
    paymentId: z.string().optional(),
});

// GET /api/orders/[id] - Get a specific order
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const order = await getOrderById(params.id);

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        console.error("GET order by id error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch order" },
            { status: 500 }
        );
    }
}

// PUT /api/orders/[id] - Update a specific order
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const validatedFields = orderUpdateSchema.safeParse(body);

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

        const { status, paymentId } = validatedFields.data;

        // Check if order exists
        const existing = await db.query.orders.findFirst({
            where: (orders, { eq }) => eq(orders.id, params.id),
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        const updateData: any = { updatedAt: new Date() };
        if (status) updateData.status = status;
        if (paymentId !== undefined) updateData.paymentId = paymentId;

        const updatedOrder = await db
            .update(orders)
            .set(updateData)
            .where(eq(orders.id, params.id))
            .returning();

        return NextResponse.json({
            success: true,
            message: "Order updated successfully",
            data: updatedOrder[0],
        });
    } catch (error) {
        console.error("PUT order error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update order" },
            { status: 500 }
        );
    }
}

// DELETE /api/orders/[id] - Delete a specific order
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if order exists
        const existing = await db.query.orders.findFirst({
            where: (orders, { eq }) => eq(orders.id, params.id),
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        await db.delete(orders).where(eq(orders.id, params.id));

        return NextResponse.json({
            success: true,
            message: "Order deleted successfully",
        });
    } catch (error) {
        console.error("DELETE order error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete order" },
            { status: 500 }
        );
    }
}