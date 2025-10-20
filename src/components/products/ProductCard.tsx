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

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <div
      className="
        rounded-[16px] border border-black/10 bg-white
        shadow-[0_18px_50px_-20px_rgba(0,0,0,.25)]
        overflow-hidden flex flex-col
        transition-all hover:-translate-y-[2px] hover:shadow-[0_20px_50px_-18px_rgba(0,0,0,.3)]
      "
    >
      {/* картинка */}
      <div className="relative h-[220px] bg-white">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>

      {/* тонкая разделительная полоска */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#e5e6ec] to-transparent" />

      {/* описание */}
      <div className="flex flex-col gap-2 p-4">
  <div className="text-[13px] font-bold text-[#656879]">
    {product.title}
  </div>

    <div className="mt-1 space-y-1 text-[12px] font-normal text-[#6d7280]">
      <div>
        <span className="text-[#8b8daa]">Shop:</span> {product.shop}
      </div>
      <div>{product.delivery}</div>
      <div>
        <span className="text-[#8b8daa]">Price:</span> {product.price}
      </div>
    </div>
  </div>

      {/* кнопка */}
      <div className="p-4 pt-0 mt-auto">
        <a
          href={product.url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="
            block text-center  w-full rounded-[10px]
            bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6]
            text-white text-[14px] py-2.5
            shadow-[0_8px_20px_-8px_rgba(108,89,255,.6)]
            hover:brightness-110 active:translate-y-[1px] transition
          "
        >
          Buy Now
        </a>
      </div>
    </div>
  );
}
