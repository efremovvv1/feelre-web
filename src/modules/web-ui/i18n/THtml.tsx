// src/i18n/THtml.tsx
"use client";

import { useT } from "@/modules/web-ui/i18n/Provider";
import type { ElementType, ComponentPropsWithoutRef } from "react";

type Props<T extends ElementType> = {
  path: string;
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "children" | "dangerouslySetInnerHTML">;

export default function THtml<T extends ElementType = "span">(
  { path, as, className, ...rest }: Props<T>
) {
  const { t } = useT();
  const Comp = (as ?? "span") as ElementType;

  return (
    <Comp
      className={className}
      {...rest}
      // строки из словаря могут содержать <strong> и т.п.
      dangerouslySetInnerHTML={{ __html: t(path) }}
    />
  );
}
