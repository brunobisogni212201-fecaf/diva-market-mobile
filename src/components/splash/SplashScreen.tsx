'use client';

import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start animation after a brief delay
    const animationTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 100);

    // Start fade out after 2.5 seconds
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Complete splash screen after 3 seconds
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#880E4F] to-pink-600 transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div className={`transform transition-all duration-1000 ease-out ${
        isAnimating ? 'scale-100 opacity-100 rotate-0' : 'scale-75 opacity-0 rotate-12'
      }`}>
        {/* Logo Container */}
        <div className="flex flex-col items-center space-y-6">
          {/* Main Logo */}
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#880E4F] mb-1">DM</div>
                <div className="text-xs font-medium text-gray-600">Diva Market</div>
              </div>
            </div>
            
            {/* Animated ring */}
            <div className={`absolute inset-0 rounded-3xl border-4 border-white transition-all duration-1000 ${
              isAnimating ? 'opacity-30 scale-110' : 'opacity-0 scale-100'
            } animate-ping`}></div>
          </div>
          
          {/* Tagline */}
          <div className={`text-white text-center transition-all duration-1000 delay-300 ${
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className="text-2xl font-bold mb-1">Diva Market</h1>
            <p className="text-sm opacity-90">Seu estilo, sua essência</p>
          </div>
          
          {/* Loading dots */}
          <div className={`flex space-x-2 transition-all duration-1000 delay-500 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
