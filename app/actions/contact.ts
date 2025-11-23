"use server";

import { db } from "@/db/drizzle";
import { contactMessages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContactMessage(prevState: any, formData: FormData) {
    const validatedFields = contactSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below.",
        };
    }

    const { name, email, message } = validatedFields.data;

    try {
        await db.insert(contactMessages).values({
            id: nanoid(),
            name,
            email,
            message,
            status: "unread",
        });

        revalidatePath("/admin/messages");
        return {
            success: true,
            message: "Thank you for your message! We'll get back to you soon.",
        };
    } catch (error) {
        console.error("Contact form error:", error);
        return {
            success: false,
            message: "Failed to send message. Please try again.",
        };
    }
}

// Additional CRUD operations for contact messages

const messageStatusSchema = z.object({
    status: z.enum(["unread", "read", "replied"], {
        errorMap: () => ({ message: "Invalid message status" }),
    }),
});

export async function getAllContactMessages() {
    try {
        const allMessages = await db.query.contactMessages.findMany({
            orderBy: (contactMessages, { desc }) => [desc(contactMessages.createdAt)],
        });
        return allMessages;
    } catch (error) {
        console.error("Get contact messages error:", error);
        return [];
    }
}

export async function getContactMessageById(id: string) {
    try {
        const result = await db.query.contactMessages.findFirst({
            where: (contactMessages, { eq }) => eq(contactMessages.id, id),
        });
        return result;
    } catch (error) {
        console.error("Get contact message by id error:", error);
        return null;
    }
}

export async function getMessagesByStatus(status: string) {
    try {
        const result = await db.query.contactMessages.findMany({
            where: (contactMessages, { eq }) => eq(contactMessages.status, status),
            orderBy: (contactMessages, { desc }) => [desc(contactMessages.createdAt)],
        });
        return result;
    } catch (error) {
        console.error("Get messages by status error:", error);
        return [];
    }
}

export async function updateMessageStatus(id: string, status: string) {
    const validatedFields = messageStatusSchema.safeParse({ status });

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid message status.",
        };
    }

    const { status: validatedStatus } = validatedFields.data;

    try {
        await db
            .update(contactMessages)
            .set({ status: validatedStatus })
            .where(eq(contactMessages.id, id));

        revalidatePath("/admin/messages");
        return { success: true, message: `Message marked as ${validatedStatus}.` };
    } catch (error) {
        console.error("Update status error:", error);
        return { success: false, message: "Failed to update message status." };
    }
}

export async function deleteMessage(id: string) {
    try {
        await db.delete(contactMessages).where(eq(contactMessages.id, id));
        revalidatePath("/admin/messages");
        return { success: true, message: "Message deleted successfully." };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, message: "Failed to delete message." };
    }
}

export async function getUnreadMessageCount() {
    try {
        const unreadMessages = await db.query.contactMessages.findMany({
            where: (contactMessages, { eq }) => eq(contactMessages.status, 'unread'),
        });
        return unreadMessages.length;
    } catch (error) {
        console.error("Get unread message count error:", error);
        return 0;
    }
}

export async function markAllAsRead() {
    try {
        await db
            .update(contactMessages)
            .set({ status: 'read' })
            .where(eq(contactMessages.status, 'unread'));

        revalidatePath("/admin/messages");
        return { success: true, message: "All messages marked as read." };
    } catch (error) {
        console.error("Mark all as read error:", error);
        return { success: false, message: "Failed to mark messages as read." };
    }
}
