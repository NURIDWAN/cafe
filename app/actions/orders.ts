"use server";

import { db } from "@/db/drizzle";
import { orders, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const orderSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    totalAmount: z.coerce.number().min(0, "Total amount must be at least 0"),
    paymentId: z.string().optional(),
});

const orderStatusSchema = z.object({
    status: z.enum(["pending", "paid", "completed", "cancelled"], {
        errorMap: () => ({ message: "Invalid order status" }),
    }),
});

export async function createOrder(prevState: any, formData: FormData) {
    const validatedFields = orderSchema.safeParse({
        userId: formData.get("userId"),
        totalAmount: formData.get("totalAmount"),
        paymentId: formData.get("paymentId"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below.",
        };
    }

    const { userId, totalAmount, paymentId } = validatedFields.data;

    try {
        await db.insert(orders).values({
            id: nanoid(),
            userId,
            status: "pending",
            totalAmount: Math.round(totalAmount * 100), // Store in cents
            paymentId: paymentId || null,
        });

        revalidatePath("/admin/orders");
        revalidatePath("/orders");
        return { success: true, message: "Order created successfully!" };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "Failed to create order." };
    }
}

export async function getAllOrders() {
    try {
        const allOrders = await db.query.orders.findMany({
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
        });
        return allOrders;
    } catch (error) {
        console.error("Get orders error:", error);
        return [];
    }
}

export async function getOrderById(id: string) {
    try {
        const result = await db.query.orders.findFirst({
            where: (orders, { eq }) => eq(orders.id, id),
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return result;
    } catch (error) {
        console.error("Get order by id error:", error);
        return null;
    }
}

export async function getOrdersByUserId(userId: string) {
    try {
        const result = await db.query.orders.findMany({
            where: (orders, { eq }) => eq(orders.userId, userId),
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
        });
        return result;
    } catch (error) {
        console.error("Get orders by user id error:", error);
        return [];
    }
}

export async function updateOrderStatus(id: string, status: string) {
    const validatedFields = orderStatusSchema.safeParse({ status });

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid order status.",
        };
    }

    const { status: validatedStatus } = validatedFields.data;

    try {
        await db
            .update(orders)
            .set({ status: validatedStatus, updatedAt: new Date() })
            .where(eq(orders.id, id));

        revalidatePath("/admin/orders");
        revalidatePath("/orders");
        return { success: true, message: `Order marked as ${validatedStatus}.` };
    } catch (error) {
        console.error("Update status error:", error);
        return { success: false, message: "Failed to update order status." };
    }
}

export async function updateOrder(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    const paymentId = formData.get("paymentId") as string;

    const validatedFields = orderStatusSchema.safeParse({ status });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below.",
        };
    }

    const { status: validatedStatus } = validatedFields.data;

    try {
        await db
            .update(orders)
            .set({
                status: validatedStatus,
                paymentId: paymentId || null,
                updatedAt: new Date()
            })
            .where(eq(orders.id, id));

        revalidatePath("/admin/orders");
        revalidatePath("/orders");
        return { success: true, message: "Order updated successfully!" };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "Failed to update order." };
    }
}

export async function deleteOrder(id: string) {
    try {
        await db.delete(orders).where(eq(orders.id, id));
        revalidatePath("/admin/orders");
        revalidatePath("/orders");
        return { success: true, message: "Order deleted successfully." };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, message: "Failed to delete order." };
    }
}

export async function getOrdersByStatus(status: string) {
    try {
        const result = await db.query.orders.findMany({
            where: (orders, { eq }) => eq(orders.status, status),
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
        });
        return result;
    } catch (error) {
        console.error("Get orders by status error:", error);
        return [];
    }
}

export async function getOrderStats() {
    try {
        const totalOrders = await db.query.orders.findMany();
        const pendingOrders = await db.query.orders.findMany({
            where: (orders, { eq }) => eq(orders.status, 'pending'),
        });
        const completedOrders = await db.query.orders.findMany({
            where: (orders, { eq }) => eq(orders.status, 'completed'),
        });
        const cancelledOrders = await db.query.orders.findMany({
            where: (orders, { eq }) => eq(orders.status, 'cancelled'),
        });

        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        return {
            total: totalOrders.length,
            pending: pendingOrders.length,
            completed: completedOrders.length,
            cancelled: cancelledOrders.length,
            totalRevenue: totalRevenue / 100, // Convert back from cents
        };
    } catch (error) {
        console.error("Get order stats error:", error);
        return {
            total: 0,
            pending: 0,
            completed: 0,
            cancelled: 0,
            totalRevenue: 0,
        };
    }
}