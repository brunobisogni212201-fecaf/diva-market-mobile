'use client';

interface Shop {
  id: string;
  name: string;
  avatar: string;
  hasNewStory: boolean;
}

const mockShops: Shop[] = [
  { id: '1', name: 'Moda Praia', avatar: 'MP', hasNewStory: true },
  { id: '2', name: 'Make da Ju', avatar: 'MJ', hasNewStory: true },
  { id: '3', name: 'Diva Shoes', avatar: 'DS', hasNewStory: true },
  { id: '4', name: 'Bolsas Chic', avatar: 'BC', hasNewStory: false },
  { id: '5', name: 'Joias Real', avatar: 'JR', hasNewStory: true },
  { id: '6', name: 'Vestidos Lux', avatar: 'VL', hasNewStory: false },
  { id: '7', name: 'Acessórios', avatar: 'AC', hasNewStory: true },
  { id: '8', name: 'Perfumes', avatar: 'PF', hasNewStory: false },
];

export default function StoriesRail() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="flex gap-4 px-4 py-4 overflow-x-auto scrollbar-hide">
        {mockShops.map((shop) => (
          <div key={shop.id} className="flex flex-col items-center space-y-2 flex-shrink-0">
            <div className="relative">
              {shop.hasNewStory && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#880E4F] to-pink-500 p-0.5">
                  <div className="bg-white rounded-full p-0.5">
                    <div className="w-16 h-16 bg-[#880E4F] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{shop.avatar}</span>
                    </div>
                  </div>
                </div>
              )}
              {!shop.hasNewStory && (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">{shop.avatar}</span>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-700 font-medium max-w-[60px] truncate">
              {shop.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
