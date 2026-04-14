import Image from "next/image";

export function BrandLogo({ dark = false, className = "h-8 w-auto" }: { dark?: boolean; className?: string }) {
  const src = dark ? "/brand/logo-dark.png" : "/brand/logo-light.png";
  return (
    <Image
      src={src}
      alt="Norevi"
      width={120}
      height={36}
      className={className}
      style={{ width: "auto", height: "auto" }}
      priority
    />
  );
}
