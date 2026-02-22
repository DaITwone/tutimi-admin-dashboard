export type News = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  type: string | null;
  is_active: boolean;
  hashtag: string | null;
  created_at: string;
};
