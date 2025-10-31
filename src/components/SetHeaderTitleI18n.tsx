// src/components/SetHeaderTitleI18n.tsx
'use client';

import SetHeaderTitle from '@/components/SetHeaderTitle';
import { useT } from '@/i18n/Provider';

export default function SetHeaderTitleI18n({
  path,
  hideMenu,
}: {
  path: string;
  hideMenu?: boolean;
}) {
  const { t } = useT();
  return <SetHeaderTitle title={t(path)} hideMenu={hideMenu} />;
}