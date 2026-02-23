'use client';

import { CreateThemeView, useCreateTheme } from '@/app/features/themes/create';

export default function CreateThemePage() {
  const createTheme = useCreateTheme();

  return <CreateThemeView {...createTheme} />;
}

