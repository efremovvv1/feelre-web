"use client";

import Image from "next/image";

export type Product = {
  id: string;
  title: string;
  image: string;
  shop: string;
  delivery: string;
  price: string;
  url?: string;
};

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  return (
    <div
      className="
        flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white
        shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)]
        transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_32px_-10px_rgba(0,0,0,0.25)]
        font-[Montserrat]
      "
    >
      {/* изображение — теперь более компактное */}
      <div className="relative aspect-[3/4] w-full bg-white">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-3 sm:p-4"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      {/* контент */}
      <div className="flex flex-col flex-1 px-3 pb-3">
        <div className="text-[13px] font-semibold leading-snug text-neutral-800 line-clamp-3">
          {product.title}
        </div>

        <div className="mt-1.5 space-y-1 text-[11.5px] text-neutral-600">
          <div>
            <span className="text-neutral-500">Shop:</span> {product.shop}
          </div>
          <div>{product.delivery}</div>
          <div>
            <span className="text-neutral-500">Price:</span> {product.price}
          </div>
        </div>
      </div>

      {/* кнопка */}
      <div className="px-3 pb-3">
        <a
          href={product.url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="
            block w-full rounded-[10px] py-2 text-[13px] text-white text-center
            bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6]
            shadow-[0_6px_16px_-6px_rgba(108,89,255,.6)]
            hover:brightness-110 active:translate-y-[1px] transition
          "
        >
          Buy Now
        </a>
      </div>
    </div>
  );
}
