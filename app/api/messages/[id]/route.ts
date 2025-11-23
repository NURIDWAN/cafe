import { NextRequest, NextResponse } from "next/server";
import { getContactMessageById, updateMessageStatus, deleteMessage } from "@/app/actions/contact";
import { db } from "@/db/drizzle";
import { contactMessages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const messageUpdateSchema = z.object({
    status: z.enum(["unread", "read", "replied"]).optional(),
});

// GET /api/messages/[id] - Get a specific message
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const message = await getContactMessageById(params.id);

        if (!message) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: message });
    } catch (error) {
        console.error("GET message by id error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch message" },
            { status: 500 }
        );
    }
}

// PUT /api/messages/[id] - Update a specific message (typically status)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const validatedFields = messageUpdateSchema.safeParse(body);

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

        const { status } = validatedFields.data;

        // Check if message exists
        const existing = await db.query.contactMessages.findFirst({
            where: (contactMessages, { eq }) => eq(contactMessages.id, params.id),
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        const updateData: any = {};
        if (status) updateData.status = status;

        const updatedMessage = await db
            .update(contactMessages)
            .set(updateData)
            .where(eq(contactMessages.id, params.id))
            .returning();

        return NextResponse.json({
            success: true,
            message: "Message updated successfully",
            data: updatedMessage[0],
        });
    } catch (error) {
        console.error("PUT message error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update message" },
            { status: 500 }
        );
    }
}

// DELETE /api/messages/[id] - Delete a specific message
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if message exists
        const existing = await db.query.contactMessages.findFirst({
            where: (contactMessages, { eq }) => eq(contactMessages.id, params.id),
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        await db.delete(contactMessages).where(eq(contactMessages.id, params.id));

        return NextResponse.json({
            success: true,
            message: "Message deleted successfully",
        });
    } catch (error) {
        console.error("DELETE message error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete message" },
            { status: 500 }
        );
    }
}