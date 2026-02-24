'use client';

import { CreateThemeView, useCreateTheme } from '@/app/(admin)/themes/create';

export default function CreateThemePage() {
  const createTheme = useCreateTheme();

  return <CreateThemeView {...createTheme} />;
}

