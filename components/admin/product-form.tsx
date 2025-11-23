"use client";

import { createProduct } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useActionState } from "react";
import { toast } from "sonner";
import { useEffect } from "react";

interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    categories: Category[];
}

const initialState = {
    message: "",
    errors: {} as Record<string, string[]>,
    success: false,
};

export function ProductForm({ categories }: ProductFormProps) {
    const [state, formAction, isPending] = useActionState(createProduct, initialState);

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
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" placeholder="e.g. Latte" required />
                {state.errors?.name && (
                    <p className="text-sm text-destructive">{state.errors.name[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the product..."
                />
                {state.errors?.description && (
                    <p className="text-sm text-destructive">
                        {state.errors.description[0]}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required
                    />
                    {state.errors?.price && (
                        <p className="text-sm text-destructive">{state.errors.price[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <Select name="categoryId" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {state.errors?.categoryId && (
                        <p className="text-sm text-destructive">
                            {state.errors.categoryId[0]}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" />
                <p className="text-xs text-muted-foreground">
                    Upload an image from your local system.
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox id="isAvailable" name="isAvailable" defaultChecked />
                <Label htmlFor="isAvailable">Available for order</Label>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create Product"}
                </Button>
            </div>
        </form>
    );
}
