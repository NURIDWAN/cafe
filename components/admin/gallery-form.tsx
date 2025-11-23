"use client";

import { createGalleryItem } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialState = {
    message: "",
    success: false,
};

export function GalleryForm() {
    const [state, formAction, isPending] = useActionState(
        createGalleryItem,
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
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="e.g. Cozy Corner" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Optional description..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="the-space">The Space</SelectItem>
                            <SelectItem value="our-coffee">Our Coffee</SelectItem>
                            <SelectItem value="pastries">Pastries</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="order">Order (Display Priority)</Label>
                    <Input
                        id="order"
                        name="order"
                        type="number"
                        min="0"
                        defaultValue="0"
                        placeholder="0"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" required />
                <p className="text-xs text-muted-foreground">
                    Upload an image from your local system.
                </p>
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
                    {isPending ? "Uploading..." : "Add to Gallery"}
                </Button>
            </div>
        </form>
    );
}
