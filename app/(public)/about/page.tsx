import { db } from "@/db/drizzle";
import { content } from "@/db/schema";
import { eq } from "drizzle-orm";
import TeamSection from "@/components/about/team-section";

export const metadata = {
    title: "About Us | Cafe Aesthetica",
    description: "Learn about our mission, vision, and the team behind Cafe Aesthetica.",
};

export default async function AboutPage() {
    const aboutContent = await db.query.content.findFirst({
        where: eq(content.key, "about"),
    });

    const data = (aboutContent?.data as any) || {
        heroTitle: "About Us",
        heroSubtitle: "Crafting moments, brewing excellence.",
        missionTitle: "Our Mission",
        missionText:
            "To create a space where exceptional coffee meets aesthetic design, fostering community and inspiring creativity in every cup.",
        visionTitle: "Our Vision",
        visionText:
            "To be the premier destination for coffee enthusiasts who appreciate both quality and ambiance, setting new standards in the cafe experience.",
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-primary py-20 text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                        {data.heroTitle}
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                        {data.heroSubtitle}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Mission */}
                    <div className="space-y-4">
                        <h2 className="font-serif text-3xl font-bold text-primary">
                            {data.missionTitle}
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {data.missionText}
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="space-y-4">
                        <h2 className="font-serif text-3xl font-bold text-primary">
                            {data.visionTitle}
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {data.visionText}
                        </p>
                    </div>

                    {/* Team Section */}
                    <TeamSection />
                </div>
            </div>
        </div>
    );
}
