"use server";

import { db } from "@/db/drizzle";
import { reservations } from "@/db/schema";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reservationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    date: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Date must be in the future",
    }),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    pax: z.coerce.number().min(1, "Must be at least 1 person").max(20, "Max 20 people"),
    notes: z.string().optional(),
});

export async function submitReservation(prevState: any, formData: FormData) {
    const validatedFields = reservationSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        date: formData.get("date"),
        time: formData.get("time"),
        pax: formData.get("pax"),
        notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below.",
        };
    }

    const { name, email, date, time, pax, notes } = validatedFields.data;

    try {
        await db.insert(reservations).values({
            id: nanoid(),
            name,
            email,
            date,
            time,
            pax,
            notes: notes || null,
            status: "pending",
        });

        revalidatePath("/admin/reservations");
        return { message: "Reservation submitted successfully!", success: true };
    } catch (error) {
        console.error("Reservation error:", error);
        return { message: "Failed to submit reservation. Please try again." };
    }
}
