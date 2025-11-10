"use client";

import { useEffect, useRef, useState } from "react";
import ChatShell from "@/modules/web-ui/components/chat/ChatShell";
import KeywordDock from "@/modules/web-ui/components/chat/KeywordDock";
import ProductGrid from "@/modules/web-ui/components/products/ProductGrid";
import type { Product as UiProduct } from "@/modules/web-ui/components/products/ProductCard";

export default function Home() {
  const [products, setProducts] = useState<UiProduct[]>([]);
  const productsRef = useRef<UiProduct[]>([]);
  productsRef.current = products;

  // Отключаем восстановление скролла браузером
  useEffect(() => {
    const prev = history.scrollRestoration;
   
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    return () => {
      
      if ("scrollRestoration" in history) history.scrollRestoration = prev || "auto";
    };
  }, []);

  // Получаем товары от чата
  useEffect(() => {
    const onProducts = (e: Event) => {
      const detail = (e as CustomEvent<{ products: UiProduct[]; header?: string }>).detail;
      if (!detail) return;
      setProducts(detail.products);
    };
    window.addEventListener("feelre:products", onProducts as EventListener);
    return () => window.removeEventListener("feelre:products", onProducts as EventListener);
  }, []);

  // Скролл — только если товары реально есть
  useEffect(() => {
    const onScrollReq = () => {
      if (productsRef.current.length === 0) return;
      document.getElementById("products-grid")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("feelre:scroll-products", onScrollReq as EventListener);
    return () => window.removeEventListener("feelre:scroll-products", onScrollReq as EventListener);
  }, []);

  const scrollToChatCenter = () => {
    document.getElementById("chat-box")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main className="content mx-auto max-w-[1400px] px-4 py-6">
      <ChatShell />
      <KeywordDock />

      {/* Секция с товарами появляется только когда они есть */}
      {products.length > 0 && (
        <section id="products-grid" className="mt-6">
          <ProductGrid
            products={products}
            onReturnToChat={scrollToChatCenter}
            onGenerateMore={undefined}
            showGenerateAlways={false}
          />
        </section>
      )}
    </main>
  );
}