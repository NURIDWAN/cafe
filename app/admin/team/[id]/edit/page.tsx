import { TeamForm } from "@/components/admin/team-form";
import { getTeamMemberById } from "@/app/actions/team";
import { notFound } from "next/navigation";

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
    const teamMember = await getTeamMemberById(params.id);

    if (!teamMember) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Edit Team Member</h1>
                <p className="text-muted-foreground">
                    Update team member details for {teamMember.name}.
                </p>
            </div>

            <TeamForm teamMember={teamMember} />
        </div>
    );
}