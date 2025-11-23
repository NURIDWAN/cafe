"use client";

import { createContent } from "@/app/actions/admin";
import { JsonEditor } from "@/components/admin/json-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { toast } from "sonner";

const initialState = {
    success: false,
    message: "",
    errors: {},
};

export default function NewContentPage() {
    const [state, formAction, isPending] = useActionState(createContent, initialState);
    const [jsonData, setJsonData] = useState("{\n  \n}");
    const router = useRouter();

    // Handle successful submission
    if (state.success && state.redirect) {
        toast.success(state.message);
        router.push(state.redirect);
    }

    // Handle error message
    if (state.message && !state.success) {
        toast.error(state.message);
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Create New Content</h1>
                <p className="text-muted-foreground">
                    Add a new content entry with a unique key and JSON data.
                </p>
            </div>

            <form action={formAction} className="space-y-6 bg-card p-6 rounded-xl border">
                <div className="space-y-2">
                    <Label htmlFor="key">
                        Content Key <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="key"
                        name="key"
                        placeholder="e.g., homepage, about, contact-info"
                        required
                        disabled={isPending}
                        className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                        Use lowercase letters, numbers, hyphens, and underscores only.
                    </p>
                    {state.errors?.key && (
                        <p className="text-sm text-destructive">{state.errors.key[0]}</p>
                    )}
                </div>

                <input type="hidden" name="data" value={jsonData} />

                <JsonEditor
                    value={jsonData}
                    onChange={setJsonData}
                    error={state.errors?.data?.[0]}
                    rows={15}
                />

                <div className="flex items-center justify-end gap-3">
                    <Link href="/admin/cms">
                        <Button type="button" variant="outline" disabled={isPending}>
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Content"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
