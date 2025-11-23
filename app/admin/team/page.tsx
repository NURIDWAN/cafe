import { deleteTeamMember, getTeamMembers } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AdminTeamPage() {
    const teamMembers = await getTeamMembers();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Team Members</h1>
                    <p className="text-muted-foreground">
                        Manage your team members and staff profiles.
                    </p>
                </div>
                <Link href="/admin/team/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Team Member
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Team Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Bio Preview</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {member.imageUrl ? (
                                            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-secondary/20">
                                                <Image
                                                    src={member.imageUrl}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                                                <span className="text-sm font-medium">
                                                    {member.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="font-medium">{member.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell>
                                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                                        {member.bio || "-"}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={member.isActive ? "default" : "secondary"}>
                                        {member.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{member.order}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/team/${member.id}/edit`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <form
                                            action={async () => {
                                                "use server";
                                                await deleteTeamMember(member.id);
                                            }}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive/90"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {teamMembers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            No team members yet. Add your first team member!
                        </p>
                        <Link href="/admin/team/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Team Member
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}