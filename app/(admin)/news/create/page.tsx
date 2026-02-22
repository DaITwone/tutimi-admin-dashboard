'use client';

import NewsPreview from '@/app/components/NewPreview';
import CreateNewsForm from './CreateNewsForm';
import { useCreateNews } from './useCreateNews';

export default function CreateNewsPage() {
  const {
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
    setNewImage,
    imageLink,
    setImageLink,
    previewImage,
    saving,
    previewOpen,
    setPreviewOpen,
    handleSubmit,
    handleCancel,
  } = useCreateNews();

  const createdAt = new Date().toLocaleDateString('vi-VN');

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
        <CreateNewsForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          content={content}
          setContent={setContent}
          hashtag={hashtag}
          setHashtag={setHashtag}
          type={type}
          setType={setType}
          isActive={isActive}
          setIsActive={setIsActive}
          imageType={imageType}
          setImageType={setImageType}
          setNewImage={setNewImage}
          imageLink={imageLink}
          setImageLink={setImageLink}
          previewImage={previewImage}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onOpenPreview={() => setPreviewOpen(true)}
        />

        <div className="hidden lg:block">
          <NewsPreview
            title={title}
            description={description}
            content={content}
            hashtag={hashtag}
            type={type}
            image={previewImage}
            createdAt={createdAt}
          />
        </div>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPreviewOpen(false)}
          />

          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-[#F7F8FB] p-4 shadow-2xl">
            <div className="flex justify-center">
              <div className="h-1.5 w-10 rounded-full bg-gray-200" />
            </div>

            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-[#1b4f94]">
                Tin tức - Ưu đãi
              </div>

              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
              >
                X
              </button>
            </div>

            <NewsPreview
              title={title}
              description={description}
              content={content}
              hashtag={hashtag}
              type={type}
              image={previewImage}
              createdAt={createdAt}
            />
          </div>
        </div>
      )}
    </div>
  );
}
