// src/components/products/ProductCard.tsx
"use client";

import Image from "next/image";

/** Тип данных карточки */
export type Product = {
  id: string;
  title: string;
  image: string;
  shop: string;
  delivery: string;

  /** Цена */
  price: string;          // текстовая, например "122.24 $"
  priceValue?: number;    // числовое значение (для форматтера)
  currency?: string;      // "USD" | "EUR" | "UAH" ... или просто "$"

  /** Соц.доказательства */
  rating?: number;        // 0..5 (можно дробные)
  reviewsCount?: number;  // 0..N

  /** Ссылки/действия */
  url?: string;

  /** (опц.) избранное — на будущее */
  wishlisted?: boolean;
};

/** Мягкое форматирование цены:
 *  - если есть priceValue и корректный код валюты (3 буквы) -> Intl.NumberFormat
 *  - иначе возвращаем исходную строку price
 */
/** Мягкое форматирование цены — детерминированно по указанной локали */
const PRICE_LOCALE =
  process.env.NEXT_PUBLIC_PRICE_LOCALE?.trim() || "en-US";

function formatPrice(
  price: string,
  priceValue?: number,
  currency = "$",
  locale = PRICE_LOCALE
) {
  if (typeof priceValue === "number" && /^[A-Za-z]{3}$/.test(currency)) {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency.toUpperCase(),
        currencyDisplay: "narrowSymbol", // "$" вместо "US$"
        maximumFractionDigits: 2
      }).format(priceValue);
    } catch {
      /* ignore and fallback below */
    }
  }
  return price;
}

/** Звёзды рейтинга c половинкой */
function Stars({ rating = 0 }: { rating?: number }) {
  const r = Math.max(0, Math.min(5, rating));
  const full = Math.floor(r);
  const hasHalf = r - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  const Star = ({ fill = "currentColor" }: { fill?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[14px] w-[14px] md:h-[16px] md:w-[16px]">
      <path
        fill={fill}
        d="M12 2.25l2.93 5.94 6.56.95-4.74 4.62 1.12 6.54L12 17.77l-5.87 3.09 1.12-6.54-4.74-4.62 6.56-.95L12 2.25z"
      />
    </svg>
  );

  return (
    <div className="inline-flex items-center gap-[2px] text-[#F7B500]">
      {Array.from({ length: full }).map((_, i) => <Star key={`f${i}`} />)}
      {hasHalf && (
        <div className="relative">
          <Star fill="#E5E7EB" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
            <Star />
          </div>
        </div>
      )}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} fill="#E5E7EB" />)}
    </div>
  );
}

export default function ProductCard({
  product,
  //onToggleWishlist,
}: {
  product: Product;
  /** опциональный колбэк: будет полезен, когда добавим «избранное» */
  onToggleWishlist?: (id: string) => void;
}) {
  const {
    //id,
    title,
    image,
    shop,
    delivery,
    price,
    priceValue,
    currency = "$",
    rating = 0,
    reviewsCount = 0,
    url,
    //wishlisted = false,
  } = product;

  const priceText = formatPrice(price, priceValue, currency);

  return (
    <div
      className="
        group h-full flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white
        shadow-[0_12px_28px_-12px_rgba(0,0,0,0.18)]
        transition-all duration-200
        hover:-translate-y-[3px] hover:shadow-[0_16px_36px_-14px_rgba(0,0,0,0.25)]
        font-[Montserrat]
      "
    >
      {/* Верхняя полоса: магазин + (на будущее) избранное */}
      <div className="flex items-center justify-between px-3 pt-2 md:px-4">
        {shop && (
          <span className="inline-flex rounded-full bg-black/5 px-2 py-[2px] text-[10px] md:text-[11px] text-neutral-700">
            {shop}
          </span>
        )}

        {/*<button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => onToggleWishlist?.(id)}
          className="
            inline-grid place-items-center h-8 w-8 rounded-full border border-black/10 bg-white
            hover:bg-neutral-50 transition
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={wishlisted ? 0 : 1.8}
            className={wishlisted ? "text-[#e25555]" : "text-neutral-600"}
            aria-hidden
          >
            <path d="M20.8 4.6a5.2 5.2 0 0 0-7.4 0l-.9 1-1-1a5.2 5.2 0 1 0-7.3 7.3l8.3 8.3 8.3-8.3a5.2 5.2 0 0 0 0-7.3z" />
          </svg>
        </button>*/}
      </div>

      {/* Изображение: делаем чуть ниже, чтобы карточка «дышала» */}
      <div className="relative aspect-[5/4] sm:aspect-[5/4] md:aspect-[4/3] w-full bg-white">
        <Image
          src={image}
          alt={title}
          fill
          unoptimized
          className="object-contain p-3 sm:p-4"
          sizes="(max-width: 768px) 45vw, 20vw"
        />
      </div>

      {/* Контент */}
      <div className="flex flex-1 flex-col gap-2 px-3 pt-2 pb-3 md:px-4">
        {/* Заголовок — две строки фиксированной высоты */}
        <div className="text-[12.5px] md:text-[13.5px] font-semibold leading-snug text-neutral-900 line-clamp-2 min-h-[2.8em]">
          {title}
        </div>

        {/* Рейтинг + отзывы */}
        <div className="mt-0.5 flex items-center gap-1.5">
          <Stars rating={rating} />
          <span className="text-[11px] md:text-[12px] text-neutral-500">
            {rating ? rating.toFixed(1) : "—"} · {reviewsCount ? reviewsCount.toLocaleString() : 0} reviews
          </span>
        </div>

        {/* Доставка */}
        <div className="mt-1 text-[11.5px] md:text-[12px] text-neutral-600 min-h-[1.25rem]">
          {delivery}
        </div>

        {/* Низ: цена + кнопка */}
        <div className="mt-auto flex flex-col gap-2 pt-1 md:flex-row md:items-center">
          <div
            className="
              inline-flex items-center justify-center rounded-xl
              bg-gradient-to-r from-[#F4F1FF] to-[#F8F6FF]
              px-3 py-2 text-[13.5px] md:text-[14px] font-extrabold
              text-[#5a55f6] ring-1 ring-[#5a55f6]/15
              shadow-[0_8px_20px_-10px_rgba(99,102,241,.45)]
            "
          >
            {priceText}
          </div>

          <a
            href={url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="
              md:ml-auto inline-flex w-full md:w-auto items-center justify-center rounded-[10px]
              bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6]
              px-4 py-2 text-center text-[12.5px] md:text-[13px] font-semibold text-white
              shadow-[0_8px_18px_-8px_rgba(107,102,246,.55)]
              hover:brightness-110 active:translate-y-[1px] transition
            "
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
}