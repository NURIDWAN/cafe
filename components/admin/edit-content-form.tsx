"use client";

import { updateContentById } from "@/app/actions/admin";
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

interface EditContentFormProps {
    contentData: {
        id: string;
        key: string;
        data: any;
    };
}

export function EditContentForm({ contentData }: EditContentFormProps) {
    const [state, formAction, isPending] = useActionState(updateContentById, initialState);
    const [jsonData, setJsonData] = useState(JSON.stringify(contentData.data, null, 2));
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
        <form action={formAction} className="space-y-6 bg-card p-6 rounded-xl border">
            <input type="hidden" name="id" value={contentData.id} />

            <div className="space-y-2">
                <Label htmlFor="key">Content Key</Label>
                <Input
                    id="key"
                    name="key"
                    value={contentData.key}
                    disabled
                    className="font-mono bg-secondary/50"
                />
                <p className="text-xs text-muted-foreground">
                    Content key cannot be changed. Delete and recreate if needed.
                </p>
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
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
