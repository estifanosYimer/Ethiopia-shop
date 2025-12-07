import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackTerm?: string; // Search term for the fallback image (e.g. "ethiopian coffee")
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  fallbackTerm,
  className,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);

  // If the src prop changes, reset the state to try loading the new src
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback logic:
      // 1. If we have a fallback term, use a generator service
      if (fallbackTerm) {
        // Using loremflickr for reliable keyword-based placeholders
        const keywords = fallbackTerm.split(' ').join(',');
        setImgSrc(`https://loremflickr.com/640/800/${keywords}?random=${Math.random()}`);
      } else {
        // 2. Final fallback to a generic placeholder
        setImgSrc('https://placehold.co/600x800/f5f5f0/4a3728?text=Image+Coming+Soon');
      }
    }
  };

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={`${className} ${hasError ? 'grayscale-[20%]' : ''}`}
      onError={handleError}
    />
  );
};

export default ImageWithFallback;