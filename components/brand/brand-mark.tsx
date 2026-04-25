import Image from "next/image";
import { BRAND } from "@/lib/config/brand";

export function BrandMark({ dark: _dark = false, className = "h-8 w-8" }: { dark?: boolean; className?: string }) {
  const src = _dark ? "/brand/mark-dark.png" : "/brand/mark-light.png";
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={`${BRAND.fullName} mark`}
        fill
        className="object-contain"
        sizes="64px"
        priority
      />
    </span>
  );
}
