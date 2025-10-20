"use client";

import { useState } from "react";

const initialChips = ["32 years", "mother", "cooking", "swimming", "birthday", "100 $"];

export default function KeywordDock() {
  const [chips, setChips] = useState(initialChips);

  const remove = (idx: number) => {
    setChips((arr) => arr.filter((_, i) => i !== idx));
  };

  if (!chips.length) return null;

  return (
    <div className="w-full py-3">
      <div className="mx-auto max-w-[1200px] px-4">
        <div
          className="
            flex flex-wrap justify-center gap-3
            rounded-[14px] border border-black/5 bg-white/70
            backdrop-blur shadow-[0_10px_30px_-14px_rgba(0,0,0,.18)]
            px-3 py-2
          "
        >
          {chips.map((c, i) => (
            <span
              key={c + i}
              className="
                inline-flex items-center gap-2 rounded-full
                bg-white border border-black/10
                px-3 py-1.5 text-[13px] leading-none
                shadow-[0_6px_16px_-10px_rgba(0,0,0,.25)]
              "
            >
              {c}
              <button
                aria-label="remove keyword"
                onClick={() => remove(i)}
                className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-[#f2f3f7] hover:bg-[#e8e9f1] text-[#9094a2]"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
