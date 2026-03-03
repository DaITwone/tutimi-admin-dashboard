'use client';

type NewsPreviewProps = {
  title: string;
  description: string;
  content: string;
  image: File | string | null;
  hashtag: string;
  type: string;
  createdAt?: string;
};

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

export default function NewsPreview({
  title,
  description,
  content,
  image,
  hashtag,
  type,
  createdAt = '',
}: NewsPreviewProps) {
  const imageUrl =
    image instanceof File ? URL.createObjectURL(image) : typeof image === 'string' ? image : null;

  return (
    <div className="lg:sticky lg:top-7">
      <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between bg-brand-1 px-4 py-2 text-xs text-white">
          <span>18:28</span>
          <span>📶 🔋</span>
        </div>

        <div className="flex items-center gap-3 bg-brand-1 px-4 py-3 text-white">
          <span className="text-lg">←</span>

          <h3 className="flex-1 text-center text-sm font-medium">
            {title ? title : <Skeleton className="mx-auto h-4 w-32" />}
          </h3>
        </div>

        <div className="relative bg-muted/30">
          {imageUrl ? <img src={imageUrl} className="h-full w-full object-contain" /> : <Skeleton className="h-full w-full" />}
        </div>

        <div className="space-y-4 px-4 py-5">
          <span
            className={`inline-block rounded-md px-3 py-1 text-xs font-semibold text-white ${
              type === 'Khuyến Mãi' ? 'bg-yellow-400' : 'bg-blue-500'
            }`}
          >
            {type}
          </span>

          <h2 className="text-xl font-bold text-brand-1 dark:text-brand-2">
            {title ? title : <Skeleton className="h-6 w-2/3" />}
          </h2>

          {createdAt ? <p className="text-xs text-muted-foreground">{createdAt}</p> : <Skeleton className="h-3 w-24" />}

          <div className="space-y-2">
            {description ? (
              <h3 className="font-semibold uppercase text-foreground/80">{description}</h3>
            ) : (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </>
            )}
          </div>

          <div className="space-y-3">
            {content ? (
              content
                .split('\n')
                .filter(Boolean)
                .map((line, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/80">
                    {line}
                  </p>
                ))
            ) : (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </>
            )}
          </div>

          {hashtag ? (
            <p className="pt-3 text-sm font-medium text-blue-600 dark:text-blue-300">#{hashtag}</p>
          ) : (
            <Skeleton className="h-4 w-32" />
          )}
        </div>

        <div className="flex justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>Trang chủ</span>
          <span>Menu</span>
          <span className="font-medium text-brand-2">Tin tức</span>
          <span>Tài khoản</span>
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-muted-foreground">Preview giao diện app</div>
    </div>
  );
}
