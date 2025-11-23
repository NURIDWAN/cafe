import { getContentByKey } from "@/app/actions/admin";
import { EditContentForm } from "@/components/admin/edit-content-form";
import { notFound } from "next/navigation";

interface EditContentPageProps {
    params: Promise<{
        key: string;
    }>;
}

export default async function EditContentPage({ params }: EditContentPageProps) {
    const { key } = await params;
    const contentData = await getContentByKey(key);

    if (!contentData) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Edit Content</h1>
                <p className="text-muted-foreground">
                    Update the JSON data for <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded">{key}</code>
                </p>
            </div>

            <EditContentForm contentData={contentData} />
        </div>
    );
}
