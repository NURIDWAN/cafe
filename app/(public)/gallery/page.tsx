import { GalleryPageClient } from "@/components/gallery/gallery-client";
import { db } from "@/db/drizzle";
import { gallery } from "@/db/schema";
import { asc } from "drizzle-orm";

export const metadata = {
    title: "Gallery | Cafe Aesthetica",
    description: "Explore the moments, tastes, and spaces that define us.",
};

export default async function GalleryPage() {
    const galleryItems = await db
        .select()
        .from(gallery)
        .orderBy(asc(gallery.order), asc(gallery.createdAt));

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary py-16 text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                        A Glimpse Inside
                    </h1>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto">
                        Explore the moments, tastes, and spaces that define us.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <GalleryPageClient items={galleryItems} />
            </div>
        </div>
    );
}
