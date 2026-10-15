"use client";

import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import Image from "next/image";
import { getBrandSkillLogo, getSkillFallbackIcon } from "@/lib/skill-icons";

export default function SkillLogo({
  name,
  fallback,
  className,
}: {
  name: string;
  fallback?: "code";
  className: string;
}) {
  const [settledName, setSettledName] = useState(name);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const immediateLogo = getBrandSkillLogo(name);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSettledName(name);
      setFailedSource(null);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [name]);

  const brandLogo =
    immediateLogo && !immediateLogo.remote
      ? immediateLogo
      : settledName === name
        ? getBrandSkillLogo(settledName)
        : undefined;
  const Fallback = fallback === "code" ? Code2 : getSkillFallbackIcon(name);

  if (brandLogo && failedSource !== brandLogo.src) {
    if (brandLogo.remote) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brandLogo.src}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          decoding="async"
          className={`${className} ${brandLogo.className ?? ""}`}
          aria-hidden="true"
          onError={() => setFailedSource(brandLogo.src)}
        />
      );
    }

    return (
      <Image
        src={brandLogo.src}
        alt=""
        width={20}
        height={20}
        unoptimized
        className={`${className} ${brandLogo.className ?? ""}`}
        aria-hidden="true"
        onError={() => setFailedSource(brandLogo.src)}
      />
    );
  }

  return <Fallback className={className} aria-hidden="true" />;
}
