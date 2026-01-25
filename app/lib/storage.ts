import { supabase } from './supabase';

/* ===================== GET PUBLIC URL ===================== */
export const getPublicImageUrl = (
  bucket: string,
  path: string | null
): string | null => {
  if (!path) return null;

  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

/* ===================== UPLOAD FILE ===================== */
export const uploadImage = async (
  bucket: string,
  file: File,
  fileName?: string
): Promise<string> => {
  const ext =
    fileName?.split('.').pop() ??
    file.name.split('.').pop() ??
    'png';

  const finalName =
    fileName ?? `${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(finalName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  return finalName;
};

/* ===================== UPLOAD FROM URL ===================== */
export const uploadImageFromUrl = async (
  bucket: string,
  imageUrl: string,
  fileName: string
): Promise<string> => {
  const res = await fetch(imageUrl);

  if (!res.ok) {
    throw new Error('Không tải được ảnh từ link');
  }

  const blob = await res.blob();

  const file = new File([blob], fileName, {
    type: blob.type || 'image/png',
  });

  return uploadImage(bucket, file, fileName);
};

/* ===================== UNIFIED HELPER (OPTIONAL) ===================== */
/**
 * source:
 * - File  -> upload trực tiếp
 * - string (URL) -> fetch → upload
 */
export const uploadImageUnified = async (
  bucket: string,
  source: File | string | null,
  fileName: string
): Promise<string | null> => {
  if (!source) return null;

  if (typeof source === 'string') {
    return uploadImageFromUrl(bucket, source, fileName);
  }

  return uploadImage(bucket, source, fileName);
};
