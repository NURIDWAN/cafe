"use server";

import { db } from "@/db/drizzle";
import { testimonials } from "@/db/schema";
import { uploadImageAssets } from "@/lib/upload-image";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const testimonialSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.string().optional(),
    company: z.string().optional(),
    content: z.string().min(10, "Content must be at least 10 characters"),
    rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    isActive: z.coerce.boolean(),
    order: z.coerce.number().min(0, "Order must be at least 0"),
});

export async function createTestimonial(prevState: any, formData: FormData) {
    const validatedFields = testimonialSchema.safeParse({
        name: formData.get("name"),
        role: formData.get("role"),
        company: formData.get("company"),
        content: formData.get("content"),
        rating: formData.get("rating"),
        isActive: formData.get("isActive") === "on",
        order: formData.get("order"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below.",
        };
    }

    const { name, role, company, content, rating, isActive, order } = validatedFields.data;
    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const key = `testimonials/${nanoid()}-${imageFile.name}`;
            imageUrl = await uploadImageAssets(buffer, key);
        } catch (error) {
            console.error("Image upload failed:", error);
            return { success: false, message: "Failed to upload image." };
        }
    }

    try {
        await db.insert(testimonials).values({
            id: nanoid(),
            name,
            role,
            company,
            content,
            rating,
            imageUrl,
            isActive,
            order,
        });

        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true, message: "Testimonial created successfully!" };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "Failed to create testimonial." };
    }
}

export async function updateTestimonial(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;

    if (!id) {
        return { success: false, message: "Testimonial ID is required." };
    }

    const validatedFields = testimonialSchema.safeParse({
        name: formData.get("name"),
        role: formData.get("role"),
        company: formData.get("company"),
        content: formData.get("content"),
        rating: formData.get("rating"),
        isActive: formData.get("isActive") === "on",
        order: formData.get("order"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below.",
        };
    }

    const { name, role, company, content, rating, isActive, order } = validatedFields.data;
    const imageFile = formData.get("image") as File;

    try {
        const updateData: any = {
            name,
            role,
            company,
            content,
            rating,
            isActive,
            order,
            updatedAt: new Date(),
        };

        // Only update image if a new one is provided
        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const key = `testimonials/${nanoid()}-${imageFile.name}`;
            const imageUrl = await uploadImageAssets(buffer, key);
            updateData.imageUrl = imageUrl;
        }

        await db
            .update(testimonials)
            .set(updateData)
            .where(eq(testimonials.id, id));

        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true, message: "Testimonial updated successfully!" };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "Failed to update testimonial." };
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await db.delete(testimonials).where(eq(testimonials.id, id));
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true, message: "Testimonial deleted successfully." };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, message: "Failed to delete testimonial." };
    }
}

export async function getTestimonials() {
    try {
        const allTestimonials = await db
            .select()
            .from(testimonials)
            .orderBy(desc(testimonials.order), desc(testimonials.createdAt));
        return allTestimonials;
    } catch (error) {
        console.error("Get testimonials error:", error);
        return [];
    }
}

export async function getActiveTestimonials() {
    try {
        const activeTestimonials = await db
            .select()
            .from(testimonials)
            .where(eq(testimonials.isActive, true))
            .orderBy(testimonials.order);
        return activeTestimonials;
    } catch (error) {
        console.error("Get active testimonials error:", error);
        return [];
    }
}

export async function getTestimonialById(id: string) {
    try {
        const result = await db.query.testimonials.findFirst({
            where: (testimonials, { eq }) => eq(testimonials.id, id),
        });
        return result;
    } catch (error) {
        console.error("Get testimonial by ID error:", error);
        return null;
    }
}