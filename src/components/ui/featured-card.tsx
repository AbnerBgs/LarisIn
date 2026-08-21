import type { ElementType } from "react";
import Link from "next/link";

export interface FeatureCardProps {
  /** Kode item tampil di pojok gambar, mis. "ITEM 01" */
  code: string;
  /** Ikon Remixicon, mis. RiStore2Line */
  icon: ElementType;
  title: string;
  description: string;
  /** Path gambar di /public, mis. "/img/landing/explore.png" */
  image: string;
  /** Opsional: bungkus kartu jadi link */
  href?: string;
  className?: string;
}

export function FeatureCard({
  code,
  icon: Icon,
  title,
  description,
  image,
  href,
  className = "",
}: FeatureCardProps) {
  const content = (
    <div
      className={`group border-1 rounded-2xl overflow-hidden bg-white hard-shadow h-full ${className}`}
    >
      <div
        className="relative h-36 bg-cover bg-top"
        style={{ backgroundImage: `url('${image}')` }}
      >
        <span className="absolute top-3 left-3 font-mono text-[10px] tracking-widest bg-white border px-2 py-0.5 rounded">
          {code}
        </span>
      </div>
      <div className="p-5 space-y-2 border-t-1">
        <Icon className="h-5 w-5 text-indigo-500" />
        <h3 className="font-display font-bold text-base">{title}</h3>
        <p className="text-sm text-black leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}