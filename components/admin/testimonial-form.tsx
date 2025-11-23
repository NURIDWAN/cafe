"use client";

import { createTestimonial, updateTestimonial } from "@/app/actions/testimonials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { Testimonial } from "@/db/schema";

const initialState = {
    message: "",
    success: false,
    errors: {},
};

interface TestimonialFormProps {
    testimonial?: Testimonial | null;
}

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
    const [state, formAction, isPending] = useActionState(
        testimonial ? updateTestimonial : createTestimonial,
        initialState
    );

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message);
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    return (
        <form action={formAction} className="space-y-8 bg-card p-8 rounded-xl border">
            {testimonial && (
                <input type="hidden" name="id" value={testimonial.id} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Customer Name *</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="e.g. John Smith"
                        defaultValue={testimonial?.name || ""}
                        required
                    />
                    {state.errors?.name && (
                        <p className="text-sm text-destructive">{state.errors.name[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5) *</Label>
                    <Input
                        id="rating"
                        name="rating"
                        type="number"
                        min="1"
                        max="5"
                        placeholder="5"
                        defaultValue={testimonial?.rating || 5}
                        required
                    />
                    {state.errors?.rating && (
                        <p className="text-sm text-destructive">{state.errors.rating[0]}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="role">Role/Title</Label>
                    <Input
                        id="role"
                        name="role"
                        placeholder="e.g. Food Blogger, Customer"
                        defaultValue={testimonial?.role || ""}
                    />
                    {state.errors?.role && (
                        <p className="text-sm text-destructive">{state.errors.role[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                        id="company"
                        name="company"
                        placeholder="e.g. Food Magazine"
                        defaultValue={testimonial?.company || ""}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                    id="content"
                    name="content"
                    placeholder="The customer's testimonial message..."
                    rows={4}
                    defaultValue={testimonial?.content || ""}
                    required
                />
                {state.errors?.content && (
                    <p className="text-sm text-destructive">{state.errors.content[0]}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="image">Customer Photo</Label>
                    <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                    />
                    <p className="text-xs text-muted-foreground">
                        Upload a customer photo (optional).
                    </p>
                    {testimonial?.imageUrl && (
                        <p className="text-xs text-muted-foreground">
                            Current image uploaded. Leave empty to keep existing image.
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                        id="order"
                        name="order"
                        type="number"
                        min="0"
                        defaultValue={testimonial?.order || 0}
                        placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                        Lower numbers appear first.
                    </p>
                    {state.errors?.order && (
                        <p className="text-sm text-destructive">{state.errors.order[0]}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="isActive"
                    name="isActive"
                    defaultChecked={testimonial?.isActive ?? true}
                />
                <Label htmlFor="isActive">Active (show on website)</Label>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending
                        ? "Saving..."
                        : testimonial
                        ? "Update Testimonial"
                        : "Create Testimonial"
                    }
                </Button>
            </div>
        </form>
    );
}