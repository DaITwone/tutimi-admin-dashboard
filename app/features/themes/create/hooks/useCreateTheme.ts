'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { uploadImageUnified } from '@/app/lib/storage';

export type ThemeImageType = 'upload' | 'link';

export function useCreateTheme() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [imageType, setImageType] = useState<ThemeImageType>('upload');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageLink, setImageLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên theme');
      return false;
    }

    if (imageType === 'upload' && !newImage) {
      alert('Vui lòng chọn ảnh nền');
      return false;
    }

    if (imageType === 'link' && !imageLink.trim()) {
      alert('Vui lòng dán link ảnh nền');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const tempFileName = `theme-${Date.now()}.png`;

      const imagePath = await uploadImageUnified(
        'products',
        imageType === 'upload' ? newImage : imageLink,
        tempFileName
      );

      if (!imagePath) {
        alert('Upload ảnh thất bại');
        return;
      }

      const { data: theme, error } = await supabase
        .from('app_themes')
        .insert({
          name: name.trim(),
          is_active: false,
          background_uri: imagePath,
        })
        .select()
        .single();

      if (error || !theme) {
        console.error('Insert theme error:', error);
        alert('Tạo theme thất bại');
        return;
      }

      if (isActive) {
        await supabase.from('app_themes').update({ is_active: false }).neq('id', '');
        await supabase.from('app_themes').update({ is_active: true }).eq('id', theme.id);
      }

      router.push('/themes');
    } catch (error) {
      console.error(error);
      alert('Tạo theme thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    name,
    setName,
    isActive,
    setIsActive,
    imageType,
    setImageType,
    newImage,
    setNewImage,
    imageLink,
    setImageLink,
    saving,
    previewOpen,
    setPreviewOpen,
    handleSubmit,
    handleCancel,
  };
}


