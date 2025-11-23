"use client";

import { uploadLocalImage } from "@/app/actions/upload-image";
import { useState } from "react";

export default function UploadImagePage() {
    const [result, setResult] = useState<{ url?: string; error?: string } | null>(
        null
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await uploadLocalImage(null, formData);
        if (response.success) {
            setResult({ url: response.url });
        } else {
            setResult({ error: response.message });
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Upload Image (Local)</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                <div className="flex flex-col gap-2">
                    <label htmlFor="folder" className="text-sm font-medium">Folder</label>
                    <select name="folder" className="border p-2 rounded bg-background">
                        <option value="uploads">Default (uploads)</option>
                        <option value="team">Team</option>
                        <option value="products">Products</option>
                        <option value="gallery">Gallery</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="image" className="text-sm font-medium">Select Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        required
                        className="border p-2 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                    Upload
                </button>
            </form>
            {result?.url && (
                <div className="mt-6 p-4 border rounded bg-muted/50">
                    <p className="font-medium mb-2">Uploaded Successfully!</p>
                    <p className="text-sm text-muted-foreground mb-2">URL:</p>
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all block mb-4">
                        {result.url}
                    </a>
                    <div className="border rounded overflow-hidden bg-background inline-block">
                        <img src={result.url} alt="uploaded" className="max-w-xs h-auto block" />
                    </div>
                </div>
            )}
            {result?.error && <p className="mt-4 text-destructive font-medium">{result.error}</p>}
        </div>
    );
}
