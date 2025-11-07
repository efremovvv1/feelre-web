"use client";

import { useEffect, useState } from "react";
import ChatShell from "@/components/chat/ChatShell";
import KeywordDock from "@/components/chat/KeywordDock";
import ProductGrid from "@/components/products/ProductGrid";
import type { Product as UiProduct } from "@/components/products/ProductCard";
// import { mockProducts } from "@/data/mockProducts"; // опционально для старта

export default function Home() {
  const [products, setProducts] = useState<UiProduct[]>([]); // были mockProducts
  const [gridHeader, setGridHeader] = useState<string>("");

  const scrollToChatCenter = () => {
    const el = document.getElementById("chat-box");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    // получаем продукты от ChatShell
    const onProducts = (e: Event) => {
      const detail = (e as CustomEvent<{ products: UiProduct[]; header: string }>).detail;
      if (!detail) return;
      setProducts(detail.products);
      setGridHeader(detail.header || "");
    };
    window.addEventListener("feelre:products", onProducts as EventListener);

    // автоскролл к гриду — только когда пришли рекомендации
    const onScroll = () => {
      document.getElementById("products-grid")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("feelre:scroll-products", onScroll as EventListener);

    return () => {
      window.removeEventListener("feelre:products", onProducts as EventListener);
      window.removeEventListener("feelre:scroll-products", onScroll as EventListener);
    };
  }, []);

  return (
    <main className="content mx-auto max-w-[1400px] px-4 py-6">
      <ChatShell />
      <KeywordDock />

      <div id="products-grid" className="mt-6">
        {/* Если хочешь выводить заголовок из агента */}
        {gridHeader && (
          <div className="mb-3 text-sm font-medium text-neutral-700">{gridHeader}</div>
        )}

        <ProductGrid
          products={products}
          onReturnToChat={scrollToChatCenter}
          onGenerateMore={() => {}}
          // showGenerateAlways  ← убери, чтобы ничего не триггерилось раньше времени
        />
      </div>
    </main>
  );
}