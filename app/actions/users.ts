"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import * as bcrypt from "bcryptjs";
import { z } from "zod";

export async function createUser(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) || "user";

    if (!name || !email || !username || !password) {
        return {
            success: false,
            message: "All fields are required",
        };
    }

    try {
        // Check if email or username already exists
        const existingUser = await db.query.user.findFirst({
            where: (users, { or, eq }) =>
                or(eq(users.email, email), eq(users.username, username)),
        });

        if (existingUser) {
            return {
                success: false,
                message: "Email or username already exists",
            };
        }

        // Create user (without password since Better Auth handles it)
        await db.insert(user).values({
            id: nanoid(),
            name,
            email,
            username,
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        revalidatePath("/admin/users");
        return {
            success: true,
            message: "User created successfully!",
        };
    } catch (error) {
        console.error("Create user error:", error);
        return {
            success: false,
            message: "Failed to create user",
        };
    }
}

export async function updateUser(userId: string, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;

    try {
        await db
            .update(user)
            .set({
                name,
                email,
                username,
                updatedAt: new Date(),
            })
            .where(eq(user.id, userId));

        revalidatePath("/admin/users");
        return { success: true, message: "User updated successfully!" };
    } catch (error) {
        console.error("Update user error:", error);
        return { success: false, message: "Failed to update user" };
    }
}

export async function deleteUser(userId: string) {
    try {
        await db.delete(user).where(eq(user.id, userId));
        revalidatePath("/admin/users");
        return { success: true, message: "User deleted successfully" };
    } catch (error) {
        console.error("Delete user error:", error);
        return { success: false, message: "Failed to delete user" };
    }
}

// Additional CRUD operations

export async function getAllUsers(search?: string) {
    try {
        let users;

        if (search) {
            users = await db.query.user.findMany({
                where: (user, { or }) =>
                    or(
                        ilike(user.name, `%${search}%`),
                        ilike(user.email, `%${search}%`),
                        ilike(user.username, `%${search}%`)
                    ),
                orderBy: (user, { desc }) => [desc(user.createdAt)],
            });
        } else {
            users = await db.query.user.findMany({
                orderBy: (user, { desc }) => [desc(user.createdAt)],
            });
        }

        return users.map(u => ({
            ...u,
            role: 'user', // Default role since we don't have a role field
        }));
    } catch (error) {
        console.error("Get users error:", error);
        return [];
    }
}

export async function getUserById(id: string) {
    try {
        const result = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, id),
        });

        if (result) {
            return {
                ...result,
                role: 'user', // Default role
            };
        }

        return null;
    } catch (error) {
        console.error("Get user by id error:", error);
        return null;
    }
}

export async function getUserByEmail(email: string) {
    try {
        const result = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.email, email),
        });

        if (result) {
            return {
                ...result,
                role: 'user', // Default role
            };
        }

        return null;
    } catch (error) {
        console.error("Get user by email error:", error);
        return null;
    }
}

export async function verifyUserEmail(id: string) {
    try {
        await db
            .update(user)
            .set({ emailVerified: true, updatedAt: new Date() })
            .where(eq(user.id, id));

        revalidatePath("/admin/users");
        return { success: true, message: "User email verified successfully." };
    } catch (error) {
        console.error("Verify email error:", error);
        return { success: false, message: "Failed to verify user email." };
    }
}

export async function unverifyUserEmail(id: string) {
    try {
        await db
            .update(user)
            .set({ emailVerified: false, updatedAt: new Date() })
            .where(eq(user.id, id));

        revalidatePath("/admin/users");
        return { success: true, message: "User email verification revoked." };
    } catch (error) {
        console.error("Unverify email error:", error);
        return { success: false, message: "Failed to revoke user email verification." };
    }
}

export async function getUserStats() {
    try {
        const totalUsers = await db.query.user.findMany();
        const verifiedUsers = await db.query.user.findMany({
            where: (user, { eq }) => eq(user.emailVerified, true),
        });
        const unverifiedUsers = await db.query.user.findMany({
            where: (user, { eq }) => eq(user.emailVerified, false),
        });

        return {
            total: totalUsers.length,
            verified: verifiedUsers.length,
            unverified: unverifiedUsers.length,
        };
    } catch (error) {
        console.error("Get user stats error:", error);
        return {
            total: 0,
            verified: 0,
            unverified: 0,
        };
    }
}

export async function getRecentUsers(limit: number = 5) {
    try {
        const users = await db.query.user.findMany({
            orderBy: (user, { desc }) => [desc(user.createdAt)],
            limit,
        });

        return users.map(user => ({
            ...user,
            role: 'user', // Default role
        }));
    } catch (error) {
        console.error("Get recent users error:", error);
        return [];
    }
}
