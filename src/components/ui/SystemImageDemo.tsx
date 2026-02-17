'use client';

import SystemImage from './SystemImage';

export default function SystemImageDemo() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">SystemImage Component Demo</h2>
      
      {/* Logo Examples */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Logos</h3>
        <div className="flex space-x-4">
          <div className="text-center">
            <SystemImage
              storagePath="assets/logos/diva-market.png"
              alt="Diva Market Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Main Logo</p>
          </div>
          
          <div className="text-center">
            <SystemImage
              storagePath="assets/logos/diva-market-small.png"
              alt="Diva Market Small"
              width={40}
              height={40}
              className="rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Small Logo</p>
          </div>
        </div>
      </div>

      {/* Icon Examples */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Icons</h3>
        <div className="flex space-x-4">
          <div className="text-center">
            <SystemImage
              storagePath="assets/icons/notification.png"
              alt="Notification"
              width={24}
              height={24}
            />
            <p className="text-xs text-gray-500 mt-1">Notification</p>
          </div>
          
          <div className="text-center">
            <SystemImage
              storagePath="assets/icons/settings.png"
              alt="Settings"
              width={24}
              height={24}
            />
            <p className="text-xs text-gray-500 mt-1">Settings</p>
          </div>
          
          <div className="text-center">
            <SystemImage
              storagePath="assets/icons/cart.png"
              alt="Cart"
              width={24}
              height={24}
            />
            <p className="text-xs text-gray-500 mt-1">Cart</p>
          </div>
        </div>
      </div>

      {/* Placeholder Examples */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Placeholders</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <SystemImage
              storagePath="assets/placeholders/product.png"
              alt="Product Placeholder"
              width={120}
              height={150}
              className="rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Product</p>
          </div>
          
          <div className="text-center">
            <SystemImage
              storagePath="assets/placeholders/avatar.png"
              alt="Avatar Placeholder"
              width={80}
              height={80}
              className="rounded-full"
            />
            <p className="text-xs text-gray-500 mt-1">Avatar</p>
          </div>
          
          <div className="text-center">
            <SystemImage
              storagePath="assets/placeholders/shop.png"
              alt="Shop Placeholder"
              width={80}
              height={80}
              className="rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Shop</p>
          </div>
        </div>
      </div>

      {/* Banner Examples */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Banners</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Home Banner</p>
            <SystemImage
              storagePath="assets/banners/home.jpg"
              alt="Home Banner"
              width={400}
              height={200}
              className="w-full rounded-lg"
              priority={true}
            />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Profile Banner</p>
            <SystemImage
              storagePath="assets/banners/profile.jpg"
              alt="Profile Banner"
              width={400}
              height={200}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Error Handling Example */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Error Handling</h3>
        <div className="flex space-x-4">
          <div className="text-center">
            <SystemImage
              storagePath="assets/non-existent/image.jpg"
              alt="Non-existent Image"
              width={100}
              height={100}
              className="rounded-lg"
              fallbackSrc="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop"
            />
            <p className="text-xs text-gray-500 mt-1">With Fallback</p>
          </div>
          
          <div className="text-center">
            <SystemImage
              storagePath="assets/non-existent/image2.jpg"
              alt="Non-existent Image 2"
              width={100}
              height={100}
              className="rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Auto Fallback</p>
          </div>
        </div>
      </div>

      {/* Firebase Integration Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">🔥 Firebase Storage Integration</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• All images stored in Firebase Storage</li>
          <li>• Automatic fallback to Unsplash if image not found</li>
          <li>• In-memory caching for performance</li>
          <li>• Loading states with skeleton animations</li>
          <li>• Error handling with graceful degradation</li>
        </ul>
      </div>
    </div>
  );
}
