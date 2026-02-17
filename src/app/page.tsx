'use client';

import StoriesRail from '@/components/feed/StoriesRail';
import ProductPost from '@/components/feed/ProductPost';
import SplashController from '@/components/layout/SplashController';
import { mockProducts } from '@/lib/mock-data';

export default function Home() {
  return (
    <SplashController>
      <div className="bg-slate-50 min-h-full">
        {/* Main Content */}
        {/* Stories Rail */}
        <StoriesRail />

        {/* Product Posts Feed */}
        <div className="space-y-0">
          {mockProducts.map((product) => (
            <ProductPost key={product.id} product={product} />
          ))}
        </div>
      </div>
    </SplashController>
  );
}
