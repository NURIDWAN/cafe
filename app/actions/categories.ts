"use server";

import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

export async function createCategory(prevState: any, formData: FormData) {
    const validatedFields = categorySchema.safeParse({
        name: formData.get("name"),
        slug: formData.get("slug"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below.",
        };
    }

    const { name, slug } = validatedFields.data;

    // Check if slug already exists
    const existing = await db.query.categories.findFirst({
        where: (categories, { eq }) => eq(categories.slug, slug),
    });

    if (existing) {
        return {
            success: false,
            message: "A category with this slug already exists.",
        };
    }

    try {
        await db.insert(categories).values({
            id: nanoid(),
            name,
            slug,
        });

        revalidatePath("/admin/products");
        revalidatePath("/menu");
        return { success: true, message: "Category created successfully!" };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "Failed to create category." };
    }
}

export async function getAllCategories() {
    try {
        const allCategories = await db.select().from(categories).orderBy(categories.name);
        return allCategories;
    } catch (error) {
        console.error("Get categories error:", error);
        return [];
    }
}

export async function getCategoryById(id: string) {
    try {
        const result = await db.query.categories.findFirst({
            where: (categories, { eq }) => eq(categories.id, id),
        });
        return result;
    } catch (error) {
        console.error("Get category by id error:", error);
        return null;
    }
}

export async function getCategoryBySlug(slug: string) {
    try {
        const result = await db.query.categories.findFirst({
            where: (categories, { eq }) => eq(categories.slug, slug),
        });
        return result;
    } catch (error) {
        console.error("Get category by slug error:", error);
        return null;
    }
}

export async function updateCategory(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const validatedFields = categorySchema.safeParse({
        name: formData.get("name"),
        slug: formData.get("slug"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below.",
        };
    }

    const { name, slug } = validatedFields.data;

    // Check if slug already exists (excluding current category)
    const existing = await db.query.categories.findFirst({
        where: (categories, { eq, and }) => and(
            eq(categories.slug, slug),
            // Not equal to current id
            // We need to use neq in drizzle
        ),
    });

    if (existing && existing.id !== id) {
        return {
            success: false,
            message: "A category with this slug already exists.",
        };
    }

    try {
        await db
            .update(categories)
            .set({ name, slug, updatedAt: new Date() })
            .where(eq(categories.id, id));

        revalidatePath("/admin/products");
        revalidatePath("/menu");
        return { success: true, message: "Category updated successfully!" };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "Failed to update category." };
    }
}

export async function deleteCategory(id: string) {
    try {
        await db.delete(categories).where(eq(categories.id, id));
        revalidatePath("/admin/products");
        revalidatePath("/menu");
        return { success: true, message: "Category deleted successfully." };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, message: "Failed to delete category." };
    }
}

export async function getCategoriesWithProductCount() {
    try {
        const result = await db.query.categories.findMany({
            with: {
                products: true,
            },
        });

        return result.map(category => ({
            ...category,
            productCount: category.products?.length || 0,
        }));
    } catch (error) {
        console.error("Get categories with product count error:", error);
        return [];
    }
}