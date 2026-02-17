export interface Shop {
  id: string;
  name: string;
  avatar: string;
  location: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  shop: Shop;
  likes: number;
  isNew: boolean;
  category: string;
}

const shops: Shop[] = [
  { id: '1', name: 'Moda Praia', avatar: 'MP', location: 'Rio de Janeiro, RJ' },
  { id: '2', name: 'Make da Ju', avatar: 'MJ', location: 'São Paulo, SP' },
  { id: '3', name: 'Diva Shoes', avatar: 'DS', location: 'Belo Horizonte, MG' },
  { id: '4', name: 'Bolsas Chic', avatar: 'BC', location: 'Curitiba, PR' },
  { id: '5', name: 'Joias Real', avatar: 'JR', location: 'Brasília, DF' },
  { id: '6', name: 'Vestidos Lux', avatar: 'VL', location: 'Salvador, BA' },
];

const products: Product[] = [
  {
    id: '1',
    name: 'Vestido Floral Verão',
    description: 'Vestido leve e fluído perfeito para o verão. Estampa floral delicada com acabamento premium. Ideal para passeios e encontros casuais.',
    price: '129,90',
    originalPrice: '199,90',
    imageUrl: 'https://images.unsplash.com/photo-1572804013427-37d598f4e2c3?w=500&h=625&fit=crop',
    shop: shops[0],
    likes: 234,
    isNew: true,
    category: 'vestidos'
  },
  {
    id: '2',
    name: 'Bolsa Tote Elegante',
    description: 'Bolsa espaçosa e elegante com detalhes em couro sintético. Compartimento interno organizado e alça confortável. Perfeita para o dia a dia.',
    price: '189,90',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=625&fit=crop',
    shop: shops[3],
    likes: 156,
    isNew: false,
    category: 'bolsas'
  },
  {
    id: '3',
    name: 'Sandália Anabela Dourada',
    description: 'Sandália rasteira com salto anabela dourado. Confortável e estilosa, perfeita para eventos e festas. Material de alta qualidade.',
    price: '149,90',
    originalPrice: '229,90',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-3bf49e3819b1?w=500&h=625&fit=crop',
    shop: shops[2],
    likes: 89,
    isNew: true,
    category: 'calcados'
  },
  {
    id: '4',
    name: 'Conjunto de Joias',
    description: 'Conjunto completo com colar, brincos e pulseira em banho de ouro 18k. Pedras zircônia de alta qualidade. Acompanha caixa de presente.',
    price: '299,90',
    imageUrl: 'https://images.unsplash.com/photo-1596944924617-7a0c0a5d29b5?w=500&h=625&fit=crop',
    shop: shops[4],
    likes: 412,
    isNew: false,
    category: 'joias'
  },
  {
    id: '5',
    name: 'Kit de Maquiagem Profissional',
    description: 'Kit completo com 12 sombras, 4 batons, blush e iluminador. Pigmentação intensa e longa duração. Ideal para maquiadores e amantes.',
    price: '159,90',
    originalPrice: '239,90',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27d2319e3d5e?w=500&h=625&fit=crop',
    shop: shops[1],
    likes: 567,
    isNew: true,
    category: 'maquiagem'
  },
  {
    id: '6',
    name: 'Blusa de Seda Estampada',
    description: 'Blusa premium em seda natural com estampa exclusiva. Modelo fluido e elegante. Perfeita para ocasiões especiais e trabalho.',
    price: '179,90',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=625&fit=crop',
    shop: shops[5],
    likes: 198,
    isNew: false,
    category: 'blusas'
  }
];

export const mockProducts = products;
export const mockShops = shops;
