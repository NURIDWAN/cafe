"use client";

import { createTeamMember, updateTeamMember } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { Team } from "@/db/schema";

const initialState = {
    message: "",
    success: false,
    errors: {},
};

interface TeamFormProps {
    teamMember?: Team | null;
}

export function TeamForm({ teamMember }: TeamFormProps) {
    const [state, formAction, isPending] = useActionState(
        teamMember ? updateTeamMember : createTeamMember,
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
            {teamMember && (
                <input type="hidden" name="id" value={teamMember.id} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Sarah Johnson"
                        defaultValue={teamMember?.name || ""}
                        required
                    />
                    {state.errors?.name && (
                        <p className="text-sm text-destructive">{state.errors.name[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Input
                        id="role"
                        name="role"
                        placeholder="e.g. Head Chef, Manager"
                        defaultValue={teamMember?.role || ""}
                        required
                    />
                    {state.errors?.role && (
                        <p className="text-sm text-destructive">{state.errors.role[0]}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                    id="bio"
                    name="bio"
                    placeholder="A short bio about this team member..."
                    rows={4}
                    defaultValue={teamMember?.bio || ""}
                />
                <p className="text-xs text-muted-foreground">
                    Brief description of the team member's background and expertise.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="image">Team Member Photo</Label>
                    <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                    />
                    <p className="text-xs text-muted-foreground">
                        Upload a professional headshot.
                    </p>
                    {teamMember?.imageUrl && (
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
                        defaultValue={teamMember?.order || 0}
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
                    defaultChecked={teamMember?.isActive ?? true}
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
                        : teamMember
                        ? "Update Team Member"
                        : "Add Team Member"
                    }
                </Button>
            </div>
        </form>
    );
}