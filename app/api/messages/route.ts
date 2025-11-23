import { NextRequest, NextResponse } from "next/server";
import { getAllContactMessages, getUnreadMessageCount } from "@/app/actions/contact";
import { db } from "@/db/drizzle";
import { contactMessages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const messageSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    status: z.enum(["unread", "read", "replied"]).optional().default("unread"),
});

// GET /api/messages - Get all messages (with optional filtering)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const unread = searchParams.get("unread");
        const limit = searchParams.get("limit");

        if (unread === "true") {
            const count = await getUnreadMessageCount();
            return NextResponse.json({ success: true, data: { count } });
        }

        let query = db
            .select({
                id: contactMessages.id,
                name: contactMessages.name,
                email: contactMessages.email,
                message: contactMessages.message,
                status: contactMessages.status,
                createdAt: contactMessages.createdAt,
            })
            .from(contactMessages)
            .orderBy(desc(contactMessages.createdAt));

        if (status) {
            query = query.where(eq(contactMessages.status, status));
        }

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const messages = await query;

        return NextResponse.json({ success: true, data: messages });
    } catch (error) {
        console.error("GET messages error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}

// POST /api/messages - Create a new message (contact form submission)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedFields = messageSchema.safeParse(body);

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

        const { name, email, message, status } = validatedFields.data;

        const newMessage = await db.insert(contactMessages).values({
            id: crypto.randomUUID(),
            name,
            email,
            message,
            status: status || "unread",
            createdAt: new Date(),
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Message submitted successfully",
            data: newMessage[0],
        });
    } catch (error) {
        console.error("POST message error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to submit message" },
            { status: 500 }
        );
    }
}