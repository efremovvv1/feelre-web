// ProductGrid.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard, { Product } from "@/components/products/ProductCard";
import { goToChat } from "@/utils/goToChat";
import { useT } from "@/i18n/Provider";

type Props = {
  products: Product[];
  onReturnToChat?: () => void;
  onGenerateMore?: () => void;
  showGenerateAlways?: boolean;
};

export default function ProductGrid({
  products,
  onReturnToChat,
  onGenerateMore,
  showGenerateAlways = !!onGenerateMore,
}: Props) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const chunk = isMobile ? 4 : 8;
  const ctx = useT();
  const t = ctx.t;
  const [visible, setVisible] = useState(chunk);
  useEffect(() => setVisible(isMobile ? 4 : 8), [isMobile]);

  const shown = useMemo(() => products.slice(0, visible), [products, visible]);

  const hasHiddenLocal = visible < products.length;
  const canShowGenerate = showGenerateAlways || hasHiddenLocal;

  const handleMore = () => {
    if (hasHiddenLocal) setVisible((v) => Math.min(v + chunk, products.length));
    onGenerateMore?.();
  };

  return (
    <section className="w-full flex flex-col items-center">
      <div
        className="
          w-full max-w-[1200px]
          rounded-[16px] border border-[#2d69ff]/30
          shadow-[0_18px_50px_-20px_rgba(30,58,138,.35)]
          bg-gradient-to-b from-white/92 to-[#f7f1fb]/85
          p-4 sm:p-5 md:p-6
        "
      >
        <div
          className="
            grid gap-4 sm:gap-5 md:gap-6
            grid-cols-2 md:grid-cols-4
            [grid-auto-rows:1fr]
          "
        >
          {shown.map((p) => (
            <div key={p.id} className="h-full">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* кнопки */}
        <div className="mt-6 flex justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onReturnToChat || (() => goToChat())}
            className="
              rounded-[12px] border border-black/10
              bg-white/80 backdrop-blur px-4 py-2
              text-[14px] shadow-sm hover:bg-white active:translate-y-[1px]
            "
          >
            {t("products.returnToChat")}
          </button>

          {canShowGenerate && (
            <button
              onClick={handleMore}
              className="
                rounded-[12px] border border-black/10
                bg-white/80 backdrop-blur px-4 py-2
                text-[14px] shadow-sm hover:bg-white active:translate-y-[1px]
              "
            >
              {t("products.generateMore")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}