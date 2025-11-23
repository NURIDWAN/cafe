"use client";

import { submitReservation } from "@/app/actions/reservation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { toast } from "sonner";
import { useEffect } from "react";

const initialState = {
    message: "",
    errors: {},
    success: false,
};

export function ReservationForm() {
    const [state, formAction, isPending] = useActionState(submitReservation, initialState);

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message);
                // Optional: Reset form here if needed, but native form reset is tricky with server actions without JS
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    return (
        <form action={formAction} className="space-y-6 bg-card p-8 rounded-xl shadow-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="John Doe" required />
                    {state.errors?.name && (
                        <p className="text-sm text-destructive">{state.errors.name[0]}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                    {state.errors?.email && (
                        <p className="text-sm text-destructive">{state.errors.email[0]}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required />
                    {state.errors?.date && (
                        <p className="text-sm text-destructive">{state.errors.date[0]}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" type="time" required />
                    {state.errors?.time && (
                        <p className="text-sm text-destructive">{state.errors.time[0]}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pax">Guests</Label>
                    <Input id="pax" name="pax" type="number" min="1" max="20" defaultValue="2" required />
                    {state.errors?.pax && (
                        <p className="text-sm text-destructive">{state.errors.pax[0]}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Special Requests (Optional)</Label>
                <Textarea id="notes" name="notes" placeholder="Allergies, special occasion, etc." />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Submitting..." : "Book Table"}
            </Button>
        </form>
    );
}
