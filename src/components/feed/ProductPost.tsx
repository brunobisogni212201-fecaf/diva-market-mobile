'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, MessageSquare } from 'lucide-react';
import { Product } from '@/lib/mock-data';

interface ProductPostProps {
  product: Product;
}

export default function ProductPost({ product }: ProductPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleComprar = () => {
    // In a real app, this would open WhatsApp or a chat interface
    window.open(`https://wa.me/5511999999999?text=Olá! Tenho interesse no produto: ${product.name}`, '_blank');
  };

  const truncatedDescription = product.description.length > 100 
    ? product.description.substring(0, 100) + '...' 
    : product.description;

  return (
    <div className="bg-white border-b border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#880E4F] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{product.shop.avatar}</span>
          </div>
          <div>
            <p className="font-semibold text-sm">{product.shop.name}</p>
            <p className="text-xs text-gray-500">{product.shop.location}</p>
          </div>
        </div>
        <MoreHorizontal size={20} className="text-gray-600" />
      </div>

      {/* Product Image */}
      <div className="relative w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={500}
          height={625}
          className="w-full object-cover"
          style={{ aspectRatio: '4/5' }}
        />
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-[#880E4F] text-white text-xs font-bold px-2 py-1 rounded-full">
            NOVO
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLike}
            className="transition-colors duration-200"
          >
            <Heart 
              size={24} 
              className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}
            />
          </button>
          <button className="transition-colors duration-200">
            <MessageCircle size={24} className="text-gray-700" />
          </button>
          <button className="transition-colors duration-200">
            <Share2 size={24} className="text-gray-700" />
          </button>
        </div>
        
        <button 
          onClick={handleComprar}
          className="flex items-center space-x-2 bg-[#880E4F] text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-[#6b0c3f] transition-colors duration-200"
        >
          <MessageSquare size={16} />
          <span>Comprar</span>
        </button>
      </div>

      {/* Caption Area */}
      <div className="px-3 pb-3">
        <p className="text-sm font-semibold mb-1">
          Curtido por <span className="text-[#880E4F]">Maria</span> e outras {product.likes} pessoas
        </p>
        
        <div className="text-sm">
          <span className="font-semibold">{product.shop.name}</span>
          <span className="ml-2 text-gray-700">
            {showFullDescription ? product.description : truncatedDescription}
          </span>
          {product.description.length > 100 && (
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-gray-500 ml-1 font-medium"
            >
              {showFullDescription ? 'menos' : 'ver mais'}
            </button>
          )}
        </div>
        
        <div className="mt-2">
          <span className="text-yellow-500 font-bold text-lg">R$ {product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm ml-2">
              R$ {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
