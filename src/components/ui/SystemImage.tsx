'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
// import { getDownloadURL, ref } from 'firebase/storage'; // REMOVED
// import { storage } from '@/lib/firebase'; // REMOVED

interface SystemImageProps {
  storagePath: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  skeletonClassName?: string;
  imageClassName?: string;
  unoptimized?: boolean;
}

// In-memory cache for storage URLs
const storageCache = new Map<string, string>();
const loadingPromises = new Map<string, Promise<string>>();

export default function SystemImage({
  storagePath,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fallbackSrc,
  skeletonClassName = 'bg-gray-200 animate-pulse rounded',
  imageClassName = '',
  unoptimized = false,
}: SystemImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fallback placeholder using Unsplash for development
  const getFallbackUrl = useCallback(() => {
    if (fallbackSrc) return fallbackSrc;

    // Generate fallback based on storage path
    const pathParts = storagePath.split('/');
    const category = pathParts[0] || 'placeholder';

    // Map categories to Unsplash images
    const fallbackMap: Record<string, string> = {
      logos: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=200&fit=crop&crop=center',
      icons: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=50&h=50&fit=crop',
      banners: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
      placeholders: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      avatars: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=100&h=100&fit=crop&crop=face',
      products: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop',
      shops: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&h=150&fit=crop',
    };

    return fallbackMap[category] || fallbackMap.placeholders;
  }, [fallbackSrc, storagePath]);

  // Fetch image URL from Storage (MOCKED FOR MIGRATION)
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        // MOCK: Directly use fallback for now during migration
        // In the future, use Supabase Storage getPublicUrl here
        const url = getFallbackUrl();
        setImageUrl(url);
        setIsLoading(false);
      } catch (error) {
        console.warn(`Failed to load image from storage: ${storagePath}`, error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    if (storagePath) {
      fetchImageUrl();
    }
  }, [storagePath, getFallbackUrl]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className={`${skeletonClassName} ${className}`}
        style={{ width, height }}
      />
    );
  }

  // Error state with fallback
  if (hasError || !imageUrl) {
    const fallbackUrl = getFallbackUrl();
    return (
      <Image
        src={fallbackUrl}
        alt={alt}
        width={width || 200}
        height={height || 200}
        className={`${imageClassName} ${className}`}
        priority={priority}
        unoptimized={unoptimized}
      />
    );
  }

  // Success state
  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width || 200}
      height={height || 200}
      className={`${imageClassName} ${className}`}
      priority={priority}
      unoptimized={unoptimized}
      onError={() => {
        setHasError(true);
      }}
    />
  );
}

// Utility function to preload system images (MOCKED)
export const preloadSystemImages = async (paths: string[]): Promise<void> => {
  // No-op for now
  return Promise.resolve();
};

// Utility to clear cache
export const clearSystemImageCache = (): void => {
  storageCache.clear();
  loadingPromises.clear();
};
