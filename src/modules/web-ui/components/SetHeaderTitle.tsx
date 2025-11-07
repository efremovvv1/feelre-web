// src/components/SetHeaderTitle.tsx
"use client";

import { useEffect } from "react";

export default function SetHeaderTitle({
  title,
  hideMenu = false,
}: { title?: string; hideMenu?: boolean }) {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("feelre:set-header-title", { detail: { title, hideMenu } })
    );
    return () => {
      // при размонтировании вернём дефолт
      window.dispatchEvent(
        new CustomEvent("feelre:set-header-title", {
          detail: { title: undefined, hideMenu: false },
        })
      );
    };
  }, [title, hideMenu]);

  return null;
}
