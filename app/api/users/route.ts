import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, getUserStats, getUserByEmail } from "@/app/actions/users";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

const userUpdateSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    username: z.string().min(1, "Username is required").optional(),
    emailVerified: z.boolean().optional(),
    role: z.enum(["user", "admin"]).optional(),
});

// GET /api/users - Get all users (with optional filtering)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const email = searchParams.get("email");
        const stats = searchParams.get("stats");

        if (stats === "true") {
            const userStats = await getUserStats();
            return NextResponse.json({ success: true, data: userStats });
        }

        if (email) {
            const user = await getUserByEmail(email);
            if (!user) {
                return NextResponse.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: user });
        }

        let query = db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                emailVerified: user.emailVerified,
                image: user.image,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            })
            .from(user)
            .orderBy(desc(user.createdAt));

        if (search) {
            query = query.where(
                or(
                    ilike(user.name, `%${search}%`),
                    ilike(user.email, `%${search}%`),
                    ilike(user.username, `%${search}%`)
                )
            );
        }

        const users = await query;

        // Add role information (simulated)
        const usersWithRole = users.map(u => ({
            ...u,
            role: u.email === 'admin@example.com' ? 'admin' : 'user',
        }));

        return NextResponse.json({ success: true, data: usersWithRole });
    } catch (error) {
        console.error("GET users error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

// POST /api/users - Create a new user (for admin use)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedFields = z.object({
            name: z.string().min(1, "Name is required"),
            email: z.string().email("Invalid email address"),
            username: z.string().min(1, "Username is required"),
        }).safeParse(body);

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

        const { name, email, username } = validatedFields.data;

        // Check if email or username already exists
        const existingUser = await db.query.user.findFirst({
            where: (users, { or, eq }) =>
                or(eq(users.email, email), eq(users.username, username)),
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email or username already exists" },
                { status: 409 }
            );
        }

        const newUser = await db.insert(user).values({
            id: crypto.randomUUID(),
            name,
            email,
            username,
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        // Note: In a real application with Better Auth, password handling would be separate

        return NextResponse.json({
            success: true,
            message: "User created successfully",
            data: {
                ...newUser[0],
                role: "user", // Default role
            },
        });
    } catch (error) {
        console.error("POST user error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create user" },
            { status: 500 }
        );
    }
}