export type Theme = {
  id: string;
  name: string;
  background_uri: string;
  is_active: boolean;
  created_at: string;
};

export type Branding = {
  id: string;
  name: string;
  background_uri: string | null;
  logo_uri: string | null;
  is_active: boolean;
  display_order: number | null;
};

export type Banner = {
  id: string;
  image: string;
  is_active: boolean;
  order: number | null;
  created_at: string;
  theme_key: string;
};

export type BannerSettings = {
  id: number;
  active_theme_key: string;
};
