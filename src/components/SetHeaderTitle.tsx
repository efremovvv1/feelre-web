// src/components/SetHeaderTitle.tsx
"use client";

import { useEffect } from "react";

export default function SetHeaderTitle({ title }: { title: string }) {
  useEffect(() => {
    // ставим заголовок при монтировании
    window.dispatchEvent(new CustomEvent("feelre:set-header-title", { detail: { title } }));
    // возвращаем дефолт при уходе со страницы
    return () => {
      window.dispatchEvent(new CustomEvent("feelre:set-header-title", { detail: { title: null } }));
    };
  }, [title]);

  return null;
}
