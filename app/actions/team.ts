"use server";

import { db } from "@/db/drizzle";
import { team } from "@/db/schema";
import { uploadImageAssets } from "@/lib/upload-image";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const teamSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    bio: z.string().optional(),
    isActive: z.coerce.boolean(),
    order: z.coerce.number().min(0, "Order must be at least 0"),
});

export async function createTeamMember(prevState: any, formData: FormData) {
    const validatedFields = teamSchema.safeParse({
        name: formData.get("name"),
        role: formData.get("role"),
        bio: formData.get("bio"),
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

    const { name, role, bio, isActive, order } = validatedFields.data;
    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const key = `team/${nanoid()}-${imageFile.name}`;
            imageUrl = await uploadImageAssets(buffer, key);
        } catch (error) {
            console.error("Image upload failed:", error);
            return { success: false, message: "Failed to upload image." };
        }
    }

    try {
        await db.insert(team).values({
            id: nanoid(),
            name,
            role,
            bio,
            imageUrl,
            isActive,
            order,
        });

        revalidatePath("/admin/team");
        revalidatePath("/about");
        return { success: true, message: "Team member created successfully!" };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "Failed to create team member." };
    }
}

export async function updateTeamMember(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;

    if (!id) {
        return { success: false, message: "Team member ID is required." };
    }

    const validatedFields = teamSchema.safeParse({
        name: formData.get("name"),
        role: formData.get("role"),
        bio: formData.get("bio"),
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

    const { name, role, bio, isActive, order } = validatedFields.data;
    const imageFile = formData.get("image") as File;

    try {
        const updateData: any = {
            name,
            role,
            bio,
            isActive,
            order,
            updatedAt: new Date(),
        };

        // Only update image if a new one is provided
        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const key = `team/${nanoid()}-${imageFile.name}`;
            const imageUrl = await uploadImageAssets(buffer, key);
            updateData.imageUrl = imageUrl;
        }

        await db
            .update(team)
            .set(updateData)
            .where(eq(team.id, id));

        revalidatePath("/admin/team");
        revalidatePath("/about");
        return { success: true, message: "Team member updated successfully!" };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "Failed to update team member." };
    }
}

export async function deleteTeamMember(id: string) {
    try {
        await db.delete(team).where(eq(team.id, id));
        revalidatePath("/admin/team");
        revalidatePath("/about");
        return { success: true, message: "Team member deleted successfully." };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, message: "Failed to delete team member." };
    }
}

export async function getTeamMembers() {
    try {
        const allTeamMembers = await db
            .select()
            .from(team)
            .orderBy(desc(team.order), desc(team.createdAt));
        return allTeamMembers;
    } catch (error) {
        console.error("Get team members error:", error);
        return [];
    }
}

export async function getActiveTeamMembers() {
    try {
        const activeTeamMembers = await db
            .select()
            .from(team)
            .where(eq(team.isActive, true))
            .orderBy(team.order);
        return activeTeamMembers;
    } catch (error) {
        console.error("Get active team members error:", error);
        return [];
    }
}

export async function getTeamMemberById(id: string) {
    try {
        const result = await db.query.team.findFirst({
            where: (team, { eq }) => eq(team.id, id),
        });
        return result;
    } catch (error) {
        console.error("Get team member by ID error:", error);
        return null;
    }
}