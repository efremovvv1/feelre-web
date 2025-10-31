'use client';
import { useT, type Vars } from './Provider';

export default function T({ path, vars }: { path: string; vars?: Vars }) {
  const { t } = useT();
  // строку можно возвращать прямо как ReactNode
  return <>{t(path, vars)}</>;
}