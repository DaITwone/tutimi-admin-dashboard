'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImageUnified } from '@/app/lib/storage';
import { createProductApi, updateProductImageApi } from './createProduct.api';
import type { ImageType } from './createProduct.types';

export function useCreateProduct() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | null>(null);
  const [stats, setStats] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);

  const [imageType, setImageType] = useState<ImageType>('upload');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageLink, setImageLink] = useState('');

  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const uploadPreviewUrl = useMemo(() => {
    if (!newImage) return '';
    return URL.createObjectURL(newImage);
  }, [newImage]);

  useEffect(() => {
    return () => {
      if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
    };
  }, [uploadPreviewUrl]);

  const previewImage = imageType === 'upload' ? uploadPreviewUrl : imageLink;

  const validate = () => {
    if (!name.trim()) {
      alert('Vui long nhap ten san pham');
      return false;
    }

    if (price === '' || price < 0) {
      alert('Gia goc khong hop le');
      return false;
    }

    if (salePrice !== null && salePrice < 0) {
      alert('Gia khuyen mai khong hop le');
      return false;
    }

    if (imageType === 'upload' && !newImage) {
      alert('Vui long chon anh');
      return false;
    }

    if (imageType === 'link' && !imageLink.trim()) {
      alert('Vui long nhap link anh');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    try {
      const { data: product, error } = await createProductApi({
        name: name.trim(),
        price: Number(price),
        salePrice,
        stats,
        isBestSeller,
      });

      if (error || !product) {
        alert('Tao san pham that bai');
        return;
      }

      const fileName = `product-${product.id}.png`;
      const imagePath = await uploadImageUnified(
        'products',
        imageType === 'upload' ? newImage : imageLink,
        fileName,
      );

      if (imagePath) {
        await updateProductImageApi(product.id, imagePath);
      }

      router.push('/products');
    } catch (err) {
      console.error(err);
      alert('Tao san pham that bai');
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
    price,
    setPrice,
    salePrice,
    setSalePrice,
    stats,
    setStats,
    isBestSeller,
    setIsBestSeller,
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
