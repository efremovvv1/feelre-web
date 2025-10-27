"use client";

import Image from "next/image";

/** <-- оставляем экспорт, т.к. ProductGrid и mockProducts его используют */
export type Product = {
  id: string;
  title: string;
  image: string;
  shop: string;
  delivery: string;
  price: string;
  url?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div
      className="
        flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white
        shadow-[0_8px_20px_-8px_rgba(0,0,0,0.12)]
        transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.22)]
        font-[Montserrat]
      "
    >
      {/* Image — компактнее */}
      <div className="relative aspect-[3/3] w-full bg-white">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-2 sm:p-3"
          sizes="(max-width: 768px) 45vw, 20vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-3 pt-2 pb-2">
        <div className="text-[12px] md:text-[13px] font-semibold leading-snug text-neutral-800 line-clamp-2">
          {product.title}
        </div>

        <div className="mt-1 space-y-0.5 text-[11px] md:text-[11.5px] text-neutral-600">
          <div>
            <span className="text-neutral-500">Shop:</span> {product.shop}
          </div>
          <div>{product.delivery}</div>
          <div>
            <span className="text-neutral-500">Price:</span> {product.price}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="px-3 pb-3">
        <a
          href={product.url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="
            block w-full rounded-[10px] py-1.5 text-[12px] md:text-[13px] text-white text-center
            bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6]
            shadow-[0_6px_14px_-6px_rgba(108,89,255,.6)]
            hover:brightness-110 active:translate-y-[1px] transition
          "
        >
          Buy Now
        </a>
      </div>
    </div>
  );
}
