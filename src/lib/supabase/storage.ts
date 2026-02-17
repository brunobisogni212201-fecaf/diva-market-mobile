import { createClient } from './client';

export interface UploadResult {
    path: string;
    url: string;
}

/**
 * Uploads a file to Supabase Storage.
 * @param file The file object to upload.
 * @param bucket The storage bucket name (e.g., 'documents', 'avatars').
 * @param pathPrefix The folder path prefix (e.g., 'user_123/documents').
 */
export async function uploadMedia(
    file: File,
    bucket: string,
    pathPrefix: string
): Promise<UploadResult> {
    const supabase = createClient();

    // Sanitize filename: remove special chars, spaces, and append timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${pathPrefix}/${fileName}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return {
        path: data.path,
        url: publicUrl,
    };
}
