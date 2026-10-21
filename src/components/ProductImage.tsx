import { useEffect, useState } from 'react';
import { FALLBACK_IMAGE } from '../data/products';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

/** <img> with lazy loading and an automatic fallback when a file is missing. */
export default function ProductImage({ src, alt, className = '' }: Props) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <img
      src={failed ? FALLBACK_IMAGE : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
