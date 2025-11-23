"use server";

import { db } from "@/db/drizzle";
import { contactMessages, content, gallery, products, reservations } from "@/db/schema";
import { uploadImageAssets } from "@/lib/upload-image";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.coerce.number().min(0),
    categoryId: z.string(),
    isAvailable: z.coerce.boolean(),
});

export async function createProduct(prevState: any, formData: FormData) {
    const validatedFields = productSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        categoryId: formData.get("categoryId"),
        isAvailable: formData.get("isAvailable") === "on",
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below.",
        };
    }

    const { name, description, price, categoryId, isAvailable } = validatedFields.data;
    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const key = `products/${nanoid()}-${imageFile.name}`;
            imageUrl = await uploadImageAssets(buffer, key);
        } catch (error) {
            console.error("Image upload failed:", error);
            return { success: false, message: "Failed to upload image." };
        }
    }

    try {
        await db.insert(products).values({
            id: nanoid(),
            name,
            description,
            price: Math.round(price * 100), // Store in cents
            imageUrl,
            categoryId,
            isAvailable,
        });

        revalidatePath("/admin/products");
        revalidatePath("/menu");
        return { success: true, message: "Product created successfully!" };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "Failed to create product." };
    }
}

export async function deleteProduct(id: string) {
    try {
        await db.delete(products).where(eq(products.id, id));
        revalidatePath("/admin/products");
        revalidatePath("/menu");
        return { success: true, message: "Product deleted successfully." };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, message: "Failed to delete product." };
    }
}

export async function updateReservationStatus(id: string, status: string) {
    try {
        await db
            .update(reservations)
            .set({ status })
            .where(eq(reservations.id, id));
        revalidatePath("/admin/reservations");
        return { success: true, message: `Reservation marked as ${status}.` };
    } catch (error) {
        console.error("Update status error:", error);
        return { success: false, message: "Failed to update reservation status." };
    }
}

// Content CRUD Actions
const contentSchema = z.object({
    key: z.string().min(1, "Key is required").regex(/^[a-z0-9-_]+$/, "Key must contain only lowercase letters, numbers, hyphens, and underscores"),
    data: z.string().min(1, "Data is required"),
});

export async function createContent(prevState: any, formData: FormData) {
    const validatedFields = contentSchema.safeParse({
        key: formData.get("key"),
        data: formData.get("data"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below.",
        };
    }

    const { key, data } = validatedFields.data;

    // Validate JSON
    let parsedData;
    try {
        parsedData = JSON.parse(data);
    } catch (error) {
        return {
            success: false,
            message: "Invalid JSON format. Please check your data.",
        };
    }

    // Check if key already exists
    const existing = await db.query.content.findFirst({
        where: (contents, { eq }) => eq(contents.key, key),
    });

    if (existing) {
        return {
            success: false,
            message: "A content with this key already exists.",
        };
    }

    try {
        await db.insert(content).values({
            id: nanoid(),
            key,
            data: parsedData,
        });

        revalidatePath("/admin/cms");
        revalidatePath("/");
        return { success: true, message: "Content created successfully!", redirect: "/admin/cms" };
    } catch (error) {
        console.error("Content creation error:", error);
        return { success: false, message: "Failed to create content." };
    }
}

export async function getAllContent() {
    try {
        const allContent = await db.select().from(content);
        return allContent;
    } catch (error) {
        console.error("Get content error:", error);
        return [];
    }
}

export async function getContentByKey(key: string) {
    try {
        const result = await db.query.content.findFirst({
            where: (contents, { eq }) => eq(contents.key, key),
        });
        return result;
    } catch (error) {
        console.error("Get content by key error:", error);
        return null;
    }
}

export async function updateContent(key: string, data: any) {
    try {
        await db
            .insert(content)
            .values({
                id: nanoid(),
                key,
                data,
            })
            .onConflictDoUpdate({
                target: content.key,
                set: { data, updatedAt: new Date() },
            });
        revalidatePath("/admin/cms");
        revalidatePath("/");
        revalidatePath("/about");
        return { success: true, message: "Content updated successfully!" };
    } catch (error) {
        console.error("Content update error:", error);
        return { success: false, message: "Failed to update content." };
    }
}

export async function updateContentById(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const dataString = formData.get("data") as string;

    if (!id || !dataString) {
        return { success: false, message: "ID and data are required." };
    }

    // Validate JSON
    let parsedData;
    try {
        parsedData = JSON.parse(dataString);
    } catch (error) {
        return {
            success: false,
            message: "Invalid JSON format. Please check your data.",
        };
    }

    try {
        await db
            .update(content)
            .set({ data: parsedData, updatedAt: new Date() })
            .where(eq(content.id, id));

        revalidatePath("/admin/cms");
        revalidatePath("/");
        revalidatePath("/about");
        return { success: true, message: "Content updated successfully!", redirect: "/admin/cms" };
    } catch (error) {
        console.error("Content update error:", error);
        return { success: false, message: "Failed to update content." };
    }
}

export async function deleteContent(id: string) {
    try {
        await db.delete(content).where(eq(content.id, id));
        revalidatePath("/admin/cms");
        revalidatePath("/");
        revalidatePath("/about");
        return { success: true, message: "Content deleted successfully." };
    } catch (error) {
        console.error("Delete content error:", error);
        return { success: false, message: "Failed to delete content." };
    }
}

// Gallery Actions
export async function createGalleryItem(prevState: any, formData: FormData) {
    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const key = `gallery/${nanoid()}-${imageFile.name}`;
            imageUrl = await uploadImageAssets(buffer, key);
        } catch (error) {
            console.error("Image upload failed:", error);
            return { success: false, message: "Failed to upload image." };
        }
    } else {
        return { success: false, message: "Please select an image." };
    }

    try {
        await db.insert(gallery).values({
            id: nanoid(),
            title: formData.get("title") as string,
            description: (formData.get("description") as string) || null,
            imageUrl,
            category: (formData.get("category") as string) || "all",
            order: parseInt((formData.get("order") as string) || "0"),
        });

        revalidatePath("/admin/gallery");
        revalidatePath("/gallery");
        return { success: true, message: "Gallery item created successfully!" };
    } catch (error) {
        console.error("Gallery creation error:", error);
        return { success: false, message: "Failed to create gallery item." };
    }
}

export async function deleteGalleryItem(id: string) {
    try {
        await db.delete(gallery).where(eq(gallery.id, id));
        revalidatePath("/admin/gallery");
        revalidatePath("/gallery");
        return { success: true, message: "Gallery item deleted successfully." };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, message: "Failed to delete gallery item." };
    }
}

// Contact Messages Actions
export async function updateMessageStatus(id: string, status: string) {
    try {
        await db
            .update(contactMessages)
            .set({ status })
            .where(eq(contactMessages.id, id));
        revalidatePath("/admin/messages");
        return { success: true, message: `Message marked as ${status}.` };
    } catch (error) {
        console.error("Update status error:", error);
        return { success: false, message: "Failed to update message status." };
    }
}
