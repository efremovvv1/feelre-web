"use client";

import ChatShell from "@/components/chat/ChatShell";
import KeywordDock from "@/components/chat/KeywordDock";
import ProductGrid from "@/components/products/ProductGrid";
import { mockProducts } from "@/data/mockProducts"; // если используешь мок

export default function Home() {
  const scrollToChatCenter = () => {
    const el = document.getElementById("chat-box");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <main className="content mx-auto max-w-[1400px] px-4 py-6">
      <ChatShell />
      <KeywordDock />

      <div className="mt-6">
        <ProductGrid
          products={mockProducts} // или твой demo массив
          onReturnToChat={scrollToChatCenter} // скроллим в центр чата
          onGenerateMore={() => {
            // сюда подключишь агента; сейчас кнопка будет видна всегда
          }}
          showGenerateAlways // явно показываем кнопку всегда
        />
      </div>
    </main>
  );
}
