"use client";

import Image from "next/image";
import { useState } from "react";

interface CharacterImageProps {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function CharacterImage({
  src,
  fallback,
  alt,
  className = "object-cover",
  sizes,
  fill,
  width,
  height,
}: CharacterImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  const imageProps = fill
    ? { fill: true as const, sizes: sizes ?? "64px" }
    : { width: width ?? 64, height: height ?? 64 };

  return (
    <Image
      {...imageProps}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallback) setCurrentSrc(fallback);
      }}
    />
  );
}
