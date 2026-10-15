import type { LucideIcon } from "lucide-react";
import { Wrench } from "lucide-react";
import Image from "next/image";
import { getBrandSkillLogo } from "@/lib/skill-icons";

export default function SkillLogo({
  name,
  fallback: Fallback = Wrench,
  className,
}: {
  name: string;
  fallback?: LucideIcon;
  className: string;
}) {
  const brandLogo = getBrandSkillLogo(name);

  if (brandLogo) {
    return (
      <Image
        src={brandLogo.src}
        alt=""
        width={20}
        height={20}
        unoptimized
        className={`${className} ${brandLogo.className ?? ""}`}
        aria-hidden="true"
      />
    );
  }

  return <Fallback className={className} aria-hidden="true" />;
}
