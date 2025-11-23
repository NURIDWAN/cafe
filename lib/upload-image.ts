import { supabase } from "./supabase";

export const uploadImageAssets = async (buffer: Buffer, key: string) => {
  try {
    // Check if Supabase is configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const bucket = 'cafe-website'; // Ensure this bucket exists in Supabase

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
    console.warn("Supabase upload failed:", error);
  }

  // Return placeholder if upload fails
  return getPlaceholderImage();
};

// Helper function to get placeholder image
export const getPlaceholderImage = (type: "product" | "gallery" | "user" = "product") => {
  const placeholders = {
    product: "/images/placeholder-product.svg",
    gallery: "/images/placeholder-gallery.svg",
    user: "/images/placeholder-user.svg"
  };
  return placeholders[type];
};
