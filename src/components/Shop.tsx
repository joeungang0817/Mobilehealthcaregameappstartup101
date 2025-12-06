import { useState } from 'react';
import { Character } from './Character';
import { CharacterCustomization } from '../App';
import { ShoppingBag, Palette, Shirt, Sparkle, Coins, Heart, Star, Filter, Search, ExternalLink, Store, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ShopProps = {
  points: number;
  currentCustomization: CharacterCustomization;
  onPurchase: (item: Partial<CharacterCustomization>, cost: number) => void;
};

type ShopItem = {
  id: string;
  name: string;
  category: 'skin' | 'outfit' | 'accessory';
  value: string;
  cost: number;
  description: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  tags: string[];
  inStock: boolean;
};

export function Shop({ points, currentCustomization, onPurchase }: ShopProps) {
  const [mainTab, setMainTab] = useState<'customize' | 'store'>('customize');
  const [activeCategory, setActiveCategory] = useState<'skin' | 'outfit' | 'accessory'>('skin');
  const [previewCustomization, setPreviewCustomization] = useState(currentCustomization);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const shopItems: ShopItem[] = [
    // Hair Colors
    { id: 'hair-black', name: '검은색 머리', category: 'skin', value: '#2C1810', cost: 0, description: '기본 헤어 컬러' },
    { id: 'hair-brown', name: '갈색 머리', category: 'skin', value: '#4A3428', cost: 80, description: '자연스러운 브라운' },
    { id: 'hair-blonde', name: '금발', category: 'skin', value: '#F4D799', cost: 120, description: '화사한 금발' },
    { id: 'hair-red', name: '빨간 머리', category: 'skin', value: '#B85450', cost: 150, description: '개성있는 레드' },
    { id: 'hair-pink', name: '핑크 머리', category: 'skin', value: '#FFB3D9', cost: 200, description: '귀여운 핑크' },
    { id: 'hair-blue', name: '파란 머리', category: 'skin', value: '#89CFF0', cost: 200, description: '시원한 블루' },
    
    // Outfits
    { id: 'outfit-casual', name: '캐주얼룩', category: 'outfit', value: 'casual', cost: 0, description: '편안한 티셔츠' },
    { id: 'outfit-sporty', name: '스포츠웨어', category: 'outfit', value: 'sporty', cost: 200, description: '활동적인 운동복' },
    { id: 'outfit-elegant', name: '드레스', category: 'outfit', value: 'elegant', cost: 250, description: '우아한 원피스' },
    
    // Accessories
    { id: 'acc-none', name: '악세사리 없음', category: 'accessory', value: 'none', cost: 0, description: '깔끔한 기본' },
    { id: 'acc-glasses', name: '안경', category: 'accessory', value: 'glasses', cost: 120, description: '지적인 안경' },
    { id: 'acc-hat', name: '모자', category: 'accessory', value: 'hat', cost: 150, description: '스타일리시 모자' },
    { id: 'acc-headband', name: '헤어밴드', category: 'accessory', value: 'headband', cost: 100, description: '운동용 헤어밴드' },
    { id: 'acc-earrings', name: '귀걸이', category: 'accessory', value: 'earrings', cost: 180, description: '반짝이는 귀걸이' },
    { id: 'acc-bow', name: '리본', category: 'accessory', value: 'bow', cost: 130, description: '귀여운 리본' },
    { id: 'acc-crown', name: '왕관', category: 'accessory', value: 'crown', cost: 300, description: '고급스러운 왕관' },
  ];

  const categories = [
    { id: 'skin' as const, name: '헤어 컬러', icon: '💇' },
    { id: 'outfit' as const, name: '의상', icon: '👕' },
    { id: 'accessory' as const, name: '악세사리', icon: '👑' },
  ];

  const productCategories = ['전체', '운동', '영양', '수면', '웰니스', '악세서리'];

  const products: Product[] = [
    {
      id: '1',
      name: '프리미엄 요가 매트',
      category: '운동',
      price: '₩45,000',
      originalPrice: '₩60,000',
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
      description: '미끄럼 방지 기능이 있는 친환경 요가 매트',
      tags: ['요가', '스트레칭', '친환경'],
      inStock: true
    },
    {
      id: '2',
      name: '스마트 워터 보틀',
      category: '웰니스',
      price: '₩32,000',
      rating: 4.6,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      description: 'LED 알림으로 물 섭취량 추적',
      tags: ['수분', '스마트', 'LED'],
      inStock: true
    },
    {
      id: '3',
      name: '프로틴 쉐이크',
      category: '영양',
      price: '₩28,000',
      originalPrice: '₩35,000',
      rating: 4.9,
      reviews: 512,
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
      description: '운동 후 회복을 돕는 단백질 보충제',
      tags: ['단백질', '운동', '근육'],
      inStock: true
    },
    {
      id: '4',
      name: '아로마 슬립 마스크',
      category: '수면',
      price: '₩15,000',
      rating: 4.5,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400',
      description: '라벤더 향 숙면 안대',
      tags: ['수면', '아로마', '라벤더'],
      inStock: true
    },
    {
      id: '5',
      name: '저항 밴드 세트',
      category: '운동',
      price: '₩12,000',
      rating: 4.7,
      reviews: 301,
      image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400',
      description: '5가지 강도의 저항 밴드',
      tags: ['홈트', '근력', '휴대용'],
      inStock: true
    },
    {
      id: '6',
      name: '피트니스 트래커',
      category: '악세서리',
      price: '₩89,000',
      originalPrice: '₩120,000',
      rating: 4.8,
      reviews: 678,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
      description: '심박수, 수면, 활동량 추적',
      tags: ['스마트', '추적', '방수'],
      inStock: true
    },
    {
      id: '7',
      name: '폼 롤러',
      category: '운동',
      price: '₩24,000',
      rating: 4.6,
      reviews: 145,
      image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400',
      description: '근육 이완을 위한 폼 롤러',
      tags: ['회복', '마사지', '근육'],
      inStock: true
    },
    {
      id: '8',
      name: '비타민D 영양제',
      category: '영양',
      price: '₩18,000',
      rating: 4.7,
      reviews: 289,
      image: 'https://images.unsplash.com/photo-1550572017-4332d4ea8aff?w=400',
      description: '면역력 증진 비타민D',
      tags: ['영양', '면역', '건강'],
      inStock: true
    }
  ];

  // Convert price to gold coins (remove ₩ and ,000 and convert to reasonable gold amount)
  const priceToGold = (price: string) => {
    const numPrice = parseInt(price.replace(/[₩,]/g, ''));
    return Math.round(numPrice / 100); // e.g., ₩45,000 = 450 gold
  };

  const handlePreview = (item: ShopItem) => {
    if (item.category === 'skin') {
      // Hair color
      setPreviewCustomization({
        ...previewCustomization,
        hairColor: item.value
      });
    } else {
      setPreviewCustomization({
        ...previewCustomization,
        [item.category]: item.value
      });
    }
  };

  const handlePurchase = (item: ShopItem) => {
    if (points >= item.cost) {
      if (item.category === 'skin') {
        // Hair color
        onPurchase({ hairColor: item.value }, item.cost);
        setPreviewCustomization({
          ...previewCustomization,
          hairColor: item.value
        });
      } else {
        onPurchase({ [item.category]: item.value }, item.cost);
        setPreviewCustomization({
          ...previewCustomization,
          [item.category]: item.value
        });
      }
    }
  };

  const isOwned = (item: ShopItem) => {
    if (item.category === 'skin') {
      return currentCustomization.hairColor === item.value;
    }
    return currentCustomization[item.category] === item.value;
  };

  const filteredItems = shopItems.filter(item => item.category === activeCategory);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === '전체' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 pb-24 wellness-gradient min-h-screen">
      {/* Header */}
      <div className="mb-6 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <ShoppingBag className="w-8 h-8 text-lime-600" />
            <h1 className="text-3xl bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
              상점
            </h1>
          </div>
          <p className="text-sm text-gray-500">핏프렌드 꾸미기 & 헬스케어 쇼핑</p>
        </motion.div>
      </div>

      {/* Gold Display */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
          <Coins className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-gray-700">{points} 골드</span>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMainTab('customize')}
          className={`flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
            mainTab === 'customize'
              ? 'bg-lime-600 text-white shadow-md'
              : 'bg-white text-gray-600'
          }`}
        >
          <Palette className="w-5 h-5" />
          <span>핏프렌드 꾸미기</span>
        </button>
        <button
          onClick={() => setMainTab('store')}
          className={`flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
            mainTab === 'store'
              ? 'bg-lime-600 text-white shadow-md'
              : 'bg-white text-gray-600'
          }`}
        >
          <Store className="w-5 h-5" />
          <span>헬스케어 스토어</span>
        </button>
      </div>

      {/* Character Customization Tab */}
      {mainTab === 'customize' && (
        <>
          {/* Character Preview */}
          <motion.div 
            className="wellness-card p-8 mb-6 soft-shadow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Character 
              healthScore={80}
              customization={previewCustomization}
              size="large"
            />
          </motion.div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-lime-600 text-white shadow-md'
                    : 'bg-white text-gray-600'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`wellness-card p-4 cursor-pointer transition-all ${
                  previewCustomization[item.category] === item.value
                    ? 'ring-2 ring-lime-500'
                    : ''
                }`}
                onClick={() => handlePreview(item)}
              >
                <div className="aspect-square bg-gradient-to-br from-lime-100 to-green-100 rounded-xl mb-3 flex items-center justify-center text-3xl">
                  {item.category === 'skin' && '🎨'}
                  {item.category === 'outfit' && '👕'}
                  {item.category === 'accessory' && '👒'}
                </div>
                
                <h3 className="text-sm text-gray-800 mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{item.description}</p>
                
                {isOwned(item) ? (
                  <div className="py-2 bg-green-100 text-green-700 rounded-lg text-xs text-center">
                    보유중
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(item);
                    }}
                    disabled={points < item.cost}
                    className={`w-full py-2 rounded-lg text-xs flex items-center justify-center gap-1 ${
                      points >= item.cost
                        ? 'bg-lime-600 text-white hover:bg-lime-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Coins className="w-3 h-3" />
                    <span>{item.cost}</span>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Healthcare Store Tab */}
      {mainTab === 'store' && (
        <>
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="제품 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-200"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {productCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-md'
                    : 'bg-white text-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs">
                      SALE
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="text-sm text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <Coins className="w-3 h-3 text-amber-500" />
                        <span className="text-sm text-lime-600">{priceToGold(product.price)} 골드</span>
                      </div>
                      <span className="text-xs text-gray-400">{product.price}</span>
                    </div>
                  </div>

                  {/* Buy Button with Gold */}
                  <button 
                    className={`w-full py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors ${
                      points >= priceToGold(product.price)
                        ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={points < priceToGold(product.price)}
                  >
                    <Coins className="w-3 h-3" />
                    <span>{priceToGold(product.price)} 골드로 구매</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}