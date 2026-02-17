// Firebase Storage Asset Management
// This service provides centralized access to cloud-native assets

export interface AssetUrls {
  logos: {
    divaMarket: string;
    divaMarketSmall: string;
  };
  icons: {
    notification: string;
    settings: string;
    cart: string;
  };
  banners: {
    home: string;
    profile: string;
  };
  placeholders: {
    product: string;
    avatar: string;
    shop: string;
  };
}

// Firebase Storage Paths - Use these with SystemImage component
export const firebaseAssetPaths: AssetUrls = {
  logos: {
    divaMarket: 'assets/logos/diva-market-logo.png',
    divaMarketSmall: 'assets/logos/diva-market-small.png',
  },
  icons: {
    notification: 'assets/icons/notification.svg',
    settings: 'assets/icons/settings.svg',
    cart: 'assets/icons/cart.svg',
  },
  banners: {
    home: 'assets/banners/home-banner.jpg',
    profile: 'assets/banners/profile-banner.jpg',
  },
  placeholders: {
    product: 'assets/placeholders/product-placeholder.jpg',
    avatar: 'assets/placeholders/avatar-placeholder.jpg',
    shop: 'assets/placeholders/shop-placeholder.jpg',
  },
};

// Asset helper functions
export const getAssetPath = (category: keyof AssetUrls, name: keyof AssetUrls[keyof AssetUrls]): string => {
  return firebaseAssetPaths[category][name];
};

// Critical assets to preload during app initialization
export const criticalAssetPaths = [
  'assets/logos/diva-market-logo.png',
  'assets/placeholders/product-placeholder.jpg',
];

// Development mode detection
const isDevelopment = process.env.NODE_ENV === 'development';

// Get asset path with environment awareness
export const getCloudAssetPath = (category: keyof AssetUrls, name: keyof AssetUrls[keyof AssetUrls]): string => {
  return firebaseAssetPaths[category][name];
};

// Fallback URLs for development (using Unsplash as placeholders)
export const fallbackAssetUrls: AssetUrls = {
  logos: {
    divaMarket: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=200&fit=crop&crop=center',
    divaMarketSmall: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=50&h=50&fit=crop&crop=center',
  },
  icons: {
    notification: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=24&h=24&fit=crop',
    settings: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=24&h=24&fit=crop',
    cart: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=24&h=24&fit=crop',
  },
  banners: {
    home: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    profile: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=800&h=400&fit=crop',
  },
  placeholders: {
    product: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=100&h=100&fit=crop&crop=face',
    shop: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&h=150&fit=crop',
  },
};

// Get asset URL with fallback for development
export const getCloudAsset = (category: keyof AssetUrls, name: string): string => {
  const assetCategory = firebaseAssetPaths[category];
  const fallbackCategory = fallbackAssetUrls[category];
  
  if (isDevelopment) {
    return fallbackCategory[name as keyof typeof fallbackCategory];
  }
  return assetCategory[name as keyof typeof assetCategory];
};

// Preload critical assets
export const preloadCriticalAssets = (): void => {
  const criticalAssets: string[] = [
    getCloudAsset('logos', 'divaMarket'),
    getCloudAsset('placeholders', 'product'),
  ];

  criticalAssets.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};
