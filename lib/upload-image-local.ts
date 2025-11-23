import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Simple unique ID generator without external dependencies
const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
};

export const uploadImageLocal = async (buffer: Buffer, originalName: string) => {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const fileExt = originalName.split(".").pop() || "jpg";
    const uniqueName = `${generateUniqueId()}.${fileExt}`;
    const filePath = join(uploadsDir, uniqueName);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${uniqueName}`;
    return publicUrl;
  } catch (error) {
    console.error("Local upload error:", error);
    throw new Error("Failed to save image locally");
  }
};

// Fallback to a placeholder if upload fails
export const getPlaceholderImage = (type: "product" | "gallery" | "user" = "product") => {
  const placeholders = {
    product: "/images/placeholder-product.svg",
    gallery: "/images/placeholder-gallery.svg",
    user: "/images/placeholder-user.svg"
  };
  return placeholders[type];
};