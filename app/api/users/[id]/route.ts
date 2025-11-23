import { NextRequest, NextResponse } from "next/server";
import { getUserById, verifyUserEmail, unverifyUserEmail } from "@/app/actions/users";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const userUpdateSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    username: z.string().min(1, "Username is required").optional(),
    emailVerified: z.boolean().optional(),
    role: z.enum(["user", "admin"]).optional(),
});

// GET /api/users/[id] - Get a specific user
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userData = await getUserById(params.id);

        if (!userData) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: userData });
    } catch (error) {
        console.error("GET user by id error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch user" },
            { status: 500 }
        );
    }
}

// PUT /api/users/[id] - Update a specific user
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const validatedFields = userUpdateSchema.safeParse(body);

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

        const { name, email, username, emailVerified } = validatedFields.data;

        // Check if user exists
        const existing = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, params.id),
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Check for duplicate email or username (excluding current user)
        if (email || username) {
            let duplicateQuery = db.query.user.findFirst({
                where: (user, { and, or, eq, ne }) => {
                    const conditions = [ne(user.id, params.id)];

                    if (email) conditions.push(eq(user.email, email));
                    if (username) conditions.push(eq(user.username, username));

                    return or(...conditions);
                },
            });

            const duplicate = await duplicateQuery;

            if (duplicate) {
                if (duplicate.email === email) {
                    return NextResponse.json(
                        { success: false, message: "Email already exists" },
                        { status: 409 }
                    );
                }
                if (duplicate.username === username) {
                    return NextResponse.json(
                        { success: false, message: "Username already exists" },
                        { status: 409 }
                    );
                }
            }
        }

        const updateData: any = { updatedAt: new Date() };
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (username) updateData.username = username;
        if (emailVerified !== undefined) updateData.emailVerified = emailVerified;

        const updatedUser = await db
            .update(user)
            .set(updateData)
            .where(eq(user.id, params.id))
            .returning();

        // Add role information
        const responseUser = {
            ...updatedUser[0],
            role: updatedUser[0].email === 'admin@example.com' ? 'admin' : 'user',
        };

        return NextResponse.json({
            success: true,
            message: "User updated successfully",
            data: responseUser,
        });
    } catch (error) {
        console.error("PUT user error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update user" },
            { status: 500 }
        );
    }
}

// DELETE /api/users/[id] - Delete a specific user
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if user exists
        const existing = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, params.id),
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        await db.delete(user).where(eq(user.id, params.id));

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("DELETE user error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete user" },
            { status: 500 }
        );
    }
}

// PATCH /api/users/[id]/verify-email - Verify/Unverify user email
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { verify } = body;

        if (typeof verify !== "boolean") {
            return NextResponse.json(
                { success: false, message: "verify field must be boolean" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existing = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, params.id),
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const result = verify ?
            await verifyUserEmail(params.id) :
            await unverifyUserEmail(params.id);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message,
            });
        } else {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("PATCH user email verification error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update email verification" },
            { status: 500 }
        );
    }
}