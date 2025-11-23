import { NextRequest, NextResponse } from "next/server";
import { getCategoryById } from "@/app/actions/categories";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const categoryUpdateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
});

// GET /api/categories/[id] - Get a specific category
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const category = await getCategoryById(params.id);

        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error("GET category by id error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch category" },
            { status: 500 }
        );
    }
}

// PUT /api/categories/[id] - Update a specific category
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const validatedFields = categoryUpdateSchema.safeParse(body);

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

        // Check if category exists
        const existing = await db.query.categories.findFirst({
            where: (categories, { eq }) => eq(categories.id, params.id),
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        // Check if new slug already exists (excluding current category)
        if (slug) {
            const slugExists = await db.query.categories.findFirst({
                where: (categories, { eq, and }) => and(
                    eq(categories.slug, slug),
                    // We need to implement not equal, but Drizzle doesn't have neq in this context
                    // For simplicity, we'll check if it exists and is not the current one
                ),
            });

            if (slugExists && slugExists.id !== params.id) {
                return NextResponse.json(
                    { success: false, message: "A category with this slug already exists" },
                    { status: 409 }
                );
            }
        }

        const updateData: any = { updatedAt: new Date() };
        if (name) updateData.name = name;
        if (slug) updateData.slug = slug;

        const updatedCategory = await db
            .update(categories)
            .set(updateData)
            .where(eq(categories.id, params.id))
            .returning();

        return NextResponse.json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory[0],
        });
    } catch (error) {
        console.error("PUT category error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update category" },
            { status: 500 }
        );
    }
}

// DELETE /api/categories/[id] - Delete a specific category
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if category exists
        const existing = await db.query.categories.findFirst({
            where: (categories, { eq }) => eq(categories.id, params.id),
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        await db.delete(categories).where(eq(categories.id, params.id));

        return NextResponse.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("DELETE category error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete category" },
            { status: 500 }
        );
    }
}