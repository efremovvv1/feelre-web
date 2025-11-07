// utils/goToChat.ts
export function goToChat(panel?: "about" | "faq") {
  // скажем чату, какую панель открыть
  if (panel) {
    window.dispatchEvent(
      new CustomEvent("feelre:open-panel", { detail: { panel } })
    );
  }

  // мягко прокрутим к якорю и поставим по центру экрана
  const el = document.getElementById("feelre-chat");
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}
