import { supabase } from "@/integrations/supabase/client";

export const uploadImage = async (file: File, folder: string = "blog"): Promise<string> => {
  try {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('website_images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('website_images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/'); // Get last two parts (folder/filename)

    const { error } = await supabase.storage
      .from('website_images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const listImages = async (folder?: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from('website_images')
      .list(folder || '', {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('List error:', error);
      throw new Error(`List failed: ${error.message}`);
    }

    // Convert to public URLs
    const urls = data.map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from('website_images')
        .getPublicUrl(folder ? `${folder}/${file.name}` : file.name);
      return publicUrl;
    });

    return urls;
  } catch (error) {
    console.error('Error listing images:', error);
    throw error;
  }
};

export interface MigrationResult {
  success: number;
  failed: number;
  urls: Record<string, string>; // mapping of old URL to new URL
}

export const migrateExistingImages = async (
  imageUrls: string[], 
  folder?: string, 
  onProgress?: (progress: number) => void
): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: 0,
    failed: 0,
    urls: {}
  };
  
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const oldUrl = imageUrls[i];
      
      // Fetch the image
      const response = await fetch(oldUrl);
      if (!response.ok) {
        result.failed++;
        continue;
      }
      
      const blob = await response.blob();
      const fileName = oldUrl.split('/').pop() || `image-${i}`;
      const file = new File([blob], fileName, { type: blob.type });
      
      // Upload to storage
      const newUrl = await uploadImage(file, folder);
      result.urls[oldUrl] = newUrl;
      result.success++;
      
      // Update progress
      if (onProgress) {
        onProgress(Math.round(((i + 1) / imageUrls.length) * 100));
      }
    } catch (error) {
      console.error(`Failed to migrate image ${imageUrls[i]}:`, error);
      result.failed++;
    }
  }
  
  return result;
};