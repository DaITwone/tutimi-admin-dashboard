'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { uploadImageUnified } from '@/app/lib/storage';
import type { ImageInputType, NewsType } from './types';

export function useCreateNews() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [type, setType] = useState<NewsType>('Tin Tức');
  const [isActive, setIsActive] = useState(true);

  const [imageType, setImageType] = useState<ImageInputType>('upload');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageLink, setImageLink] = useState('');

  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const uploadPreviewUrl = useMemo(() => {
    if (!newImage) {
      return '';
    }

    return URL.createObjectURL(newImage);
  }, [newImage]);

  useEffect(() => {
    return () => {
      if (uploadPreviewUrl) {
        URL.revokeObjectURL(uploadPreviewUrl);
      }
    };
  }, [uploadPreviewUrl]);

  const previewImage =
    imageType === 'upload'
      ? uploadPreviewUrl || null
      : imageLink || null;

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSaving(true);

    const { data: news, error: insertError } = await supabase
      .from('news')
      .insert({
        title,
        description,
        content,
        hashtag: hashtag || null,
        is_active: isActive,
        image: null,
        type,
      })
      .select()
      .single();

    if (insertError || !news) {
      alert('Tạo tin tức thất bại');
      setSaving(false);
      return;
    }

    const fileName = `news-${news.id}.png`;
    const imagePath = await uploadImageUnified(
      'products',
      imageType === 'upload' ? newImage : imageLink,
      fileName
    );

    if (imagePath) {
      await supabase
        .from('news')
        .update({ image: imagePath })
        .eq('id', news.id);
    }

    setSaving(false);
    router.push('/news');
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    content,
    setContent,
    hashtag,
    setHashtag,
    type,
    setType,
    isActive,
    setIsActive,
    imageType,
    setImageType,
    newImage,
    setNewImage,
    imageLink,
    setImageLink,
    previewImage,
    saving,
    previewOpen,
    setPreviewOpen,
    handleSubmit,
    handleCancel,
  };
}
