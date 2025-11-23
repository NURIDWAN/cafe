import { GalleryForm } from "@/components/admin/gallery-form";

export default function NewGalleryItemPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Add Gallery Image</h1>
                <p className="text-muted-foreground">
                    Upload a new image to your gallery.
                </p>
            </div>

            <GalleryForm />
        </div>
    );
}
