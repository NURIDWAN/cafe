"use server";
import { uploadImageAssets } from "@/lib/upload-image";

export async function uploadLocalImage(prevState: any, formData: FormData) {
    const imageFile = formData.get("image") as File;
    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: "Please select an image to upload." };
    }
    try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const key = `uploads/${Date.now()}-${imageFile.name}`;
        const publicUrl = await uploadImageAssets(buffer, key);
        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Upload failed:", error);
        return { success: false, message: "Upload failed." };
    }
}
