import { NextRequest, NextResponse } from "next/server";
import { getAllCategories, createCategory } from "@/app/actions/categories";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

// GET /api/categories - Get all categories
export async function GET() {
    try {
        const categories = await getAllCategories();
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        console.error("GET categories error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedFields = categorySchema.safeParse(body);

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

        const { name, slug } = validatedFields.data;

        // Check if slug already exists
        const existing = await db.query.categories.findFirst({
            where: (categories, { eq }) => eq(categories.slug, slug),
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: "A category with this slug already exists" },
                { status: 409 }
            );
        }

        const newCategory = await db.insert(categories).values({
            id: crypto.randomUUID(),
            name,
            slug,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Category created successfully",
            data: newCategory[0],
        });
    } catch (error) {
        console.error("POST category error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create category" },
            { status: 500 }
        );
    }
}