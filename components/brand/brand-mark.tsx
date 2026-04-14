import Image from "next/image";

export function BrandMark({ dark: _dark = false, className = "h-8 w-8" }: { dark?: boolean; className?: string }) {
  const src = _dark ? "/brand/mark-dark.png" : "/brand/mark-light.png";
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      <Image
        src={src}
        alt="Norevi mark"
        fill
        className="object-contain"
        sizes="64px"
        priority
      />
    </span>
  );
}
