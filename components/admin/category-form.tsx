"use client";

import { createCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { toast } from "sonner";
import { useEffect } from "react";

const initialState = {
    message: "",
    errors: {} as Record<string, string[]>,
    success: false,
};

interface CategoryFormProps {
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    isEditing?: boolean;
}

export function CategoryForm({ category, isEditing = false }: CategoryFormProps) {
    const [state, formAction, isPending] = useActionState(
        isEditing ? (formData: FormData) => {
            // For editing, we'll need to implement updateCategory action
            // For now, using createCategory
            return createCategory(formData);
        } : createCategory,
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

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const slugInput = document.getElementById("slug") as HTMLInputElement;
        if (slugInput && !slugInput.value) {
            slugInput.value = generateSlug(e.target.value);
        }
    };

    return (
        <form action={formAction} className="space-y-8 bg-card p-8 rounded-xl border">
            {isEditing && category && (
                <input type="hidden" name="id" value={category.id} />
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Coffee"
                    defaultValue={category?.name || ""}
                    onChange={handleNameChange}
                    required
                />
                {state.errors?.name && (
                    <p className="text-sm text-destructive">{state.errors.name[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                    id="slug"
                    name="slug"
                    placeholder="e.g. coffee"
                    defaultValue={category?.slug || ""}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    URL-friendly version of the name. Only lowercase letters, numbers, and hyphens allowed.
                </p>
                {state.errors?.slug && (
                    <p className="text-sm text-destructive">{state.errors.slug[0]}</p>
                )}
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Category" : "Create Category")}
                </Button>
            </div>
        </form>
    );
}