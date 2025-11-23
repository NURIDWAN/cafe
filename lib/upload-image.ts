import { supabase } from "./supabase";
import { uploadImageLocal, getPlaceholderImage } from "./upload-image-local";

export const uploadImageAssets = async (buffer: Buffer, key: string) => {
  try {
    // Check if Supabase is configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const bucket = 'images'; // Ensure this bucket exists in Supabase

      // Upload to Supabase
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(key, buffer, {
          contentType: 'image/jpeg', // Or detect mime type
          upsert: true
        });

      if (error) {
        throw error;
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(key);

      return publicUrl;
    }
  } catch (error) {
    console.warn("Supabase upload failed, falling back to local storage:", error);
  }

  // Fallback to local storage
  try {
    return await uploadImageLocal(buffer, key);
  } catch (error) {
    console.error("Local upload also failed:", error);
    return getPlaceholderImage();
  }
};

// Helper function to get placeholder image
export { getPlaceholderImage };
