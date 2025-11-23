import { TeamForm } from "@/components/admin/team-form";

export default function NewTeamMemberPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">New Team Member</h1>
                <p className="text-muted-foreground">
                    Add a new team member to showcase on your about page.
                </p>
            </div>

            <TeamForm />
        </div>
    );
}