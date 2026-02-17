'use client';

import { useState, useEffect } from 'react';
import { preloadSystemImages } from '@/components/ui/SystemImage';
import { criticalAssetPaths } from '@/lib/firebase-storage';

interface SplashControllerProps {
  children: React.ReactNode;
}

export default function SplashController({ children }: SplashControllerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Preload critical assets
        await preloadSystemImages(criticalAssetPaths);
        
        // Artificial delay for branding (minimum 2 seconds)
        const minSplashTime = 2000;
        const startTime = Date.now();
        
        // Wait for both asset loading and minimum time
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minSplashTime - elapsedTime);
        
        setTimeout(() => {
          setIsLoading(false);
          // Small delay before showing content for smooth transition
          setTimeout(() => setShowContent(true), 100);
        }, remainingTime);
        
      } catch (error) {
        console.warn('Failed to preload critical assets:', error);
        // Still show splash for branding even if assets fail
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => setShowContent(true), 100);
        }, 2000);
      }
    };

    initializeApp();
  }, []);

  // Splash Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#880E4F] to-pink-600">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Logo */}
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#880E4F] mb-1">DM</div>
                <div className="text-xs font-medium text-gray-600">Diva Market</div>
              </div>
            </div>
            
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-3xl border-4 border-white opacity-30 animate-ping"></div>
          </div>
          
          {/* Tagline */}
          <div className="text-white text-center animate-fade-in">
            <h1 className="text-2xl font-bold mb-1">Diva Market</h1>
            <p className="text-sm opacity-90">Seu estilo, sua essência</p>
          </div>
          
          {/* Loading dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Main Content with fade-in animation
  return (
    <div className={`transition-opacity duration-700 ${
      showContent ? 'opacity-100' : 'opacity-0'
    }`}>
      {children}
    </div>
  );
}
