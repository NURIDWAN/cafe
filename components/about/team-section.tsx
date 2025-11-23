import { getActiveTeamMembers } from "@/app/actions/team";
import Image from "next/image";

export default async function TeamSection() {
    const teamMembers = await getActiveTeamMembers();

    if (teamMembers.length === 0) {
        return null; // Don't show team section if no team members exist
    }

    return (
        <div className="space-y-8">
            <h2 className="font-serif text-3xl font-bold text-primary text-center">
                Meet Our Team
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                    <div
                        key={member.id}
                        className="text-center space-y-4"
                    >
                        <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden bg-secondary/20 border-4 border-secondary">
                            {member.imageUrl ? (
                                <Image
                                    src={member.imageUrl}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-3xl font-bold text-primary/50">
                                        {member.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-serif text-xl font-bold text-primary">
                                {member.name}
                            </h3>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                {member.role}
                            </p>
                            {member.bio && (
                                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                                    {member.bio}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}