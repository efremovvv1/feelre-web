"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AboutCard from "./AboutCard";
import FaqCard from "./FaqCard";

type BubbleProps = {
  children: React.ReactNode;
  align?: "left" | "right";
  tone?: "default" | "info";
};

function Bubble({ children, align = "left", tone = "default" }: BubbleProps) {
  return (
    <div
      className={[
        "max-w-[760px] rounded-[14px] px-5 py-4 text-[15px] leading-[1.4]",
        align === "right" ? "ml-auto" : "",
        tone === "info"
          ? "bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,.18)] border border-black/10"
          : "bg-white/85 backdrop-blur border border-black/5 shadow-sm",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

type Panel = "about" | "faq" | "none";

export default function ChatShell() {
  const [messages, setMessages] = useState<React.ReactNode[]>([]);
  const [panel, setPanel] = useState<Panel>("about");
  const [input, setInput] = useState("");

  // ссылка на корень чата, чтобы скроллить в центр
  const rootRef = useRef<HTMLElement>(null);

  // Слушатель для футера/хедера/и т.д.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ panel: Panel }>).detail;
      if (detail?.panel) {
        setPanel(detail.panel);
        // плавно скроллим и пытаемся центрировать блок
        rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    window.addEventListener("feelre:open-panel", handler as EventListener);
    return () =>
      window.removeEventListener("feelre:open-panel", handler as EventListener);
  }, []);

  const send = () => {
    if (!input.trim()) return;
    if (panel !== "none") setPanel("none");
    setMessages((prev) => [
      ...prev,
      <Bubble key={`me-${prev.length}`} align="right">
        {input}
      </Bubble>,
    ]);
    setInput("");
  };

  return (
    <section id="chat-box" ref={rootRef} className="w-full flex flex-col items-center">
      {/* коробка чата 1200×615 */}
      <div
        className="
          relative w-full max-w-[1200px] h-[615px]
          rounded-[16px] border border-[#2d69ff]/30
          shadow-[0_18px_50px_-20px_rgba(30,58,138,.35)]
          overflow-hidden
          bg-gradient-to-b from-white/92 to-[#f7f1fb]/85
        "
      >
        {/* скроллируемая зона */}
        <div className="absolute inset-0 overflow-y-auto p-6 pb-28">
          <div className="mx-auto max-w-[980px] space-y-10">
            {/* ABOUT */}
            {panel === "about" && (
              <div className="transition-all duration-300 opacity-100 translate-y-0">
                <AboutCard onGoFaq={() => setPanel("faq")} onClose={() => setPanel("none")} />
              </div>
            )}

            {/* FAQ */}
            {panel === "faq" && (
              <div className="transition-all duration-300 opacity-100 translate-y-0">
                <FaqCard onBack={() => setPanel("about")} />
              </div>
            )}

            {/* Сообщения */}
            {messages.map((m, i) => (
              <div key={i}>{m}</div>
            ))}
          </div>
        </div>

        {/* input */}
        <div className="absolute left-4 right-4 bottom-4">
          <div className="mx-auto max-w-[980px]">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your message…"
                className="
                  w-full h-[44px] pl-12 pr-12
                  rounded-[12px] border border-black/10
                  bg-white/90 backdrop-blur
                  text-[14px] placeholder:text-[#9aa0aa]
                  shadow-[0_8px_26px_-10px_rgba(0,0,0,.2)]
                  outline-none focus:ring-2 focus:ring-[#6a83ff]/50
                "
              />
              <button
                onClick={send}
                className="
                  absolute right-2 top-1/2 -translate-y-1/2
                  grid place-items-center h-8 w-8 rounded-full
                  bg-[#eff1ff] hover:bg-[#e6e8ff] active:scale-[.98]
                  shadow-[inset_0_-1px_0_rgba(0,0,0,.07)]
                "
                aria-label="Send"
              >
                <Image src="/icons/up-arrow.png" alt="" width={30} height={30} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
