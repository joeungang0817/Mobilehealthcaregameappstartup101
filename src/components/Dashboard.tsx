import { useState, useRef, useEffect } from 'react';
import { Character } from './Character';
import { UserData, Habit } from '../App'; // Habit 타입 import 추가
import { Heart, Utensils, Dumbbell, Coins, Send, ShoppingCart, ExternalLink, MessageCircle, Sparkles, Trophy, Star, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Message = {
  id: string;
  type: 'user' | 'character' | 'product';
  content: string;
  timestamp: Date;
  product?: {
    name: string;
    price: string;
    image: string;
    link: string;
    description: string;
  };
};

// Habit 타입 정의 제거 (App.tsx에서 import)

type DashboardProps = {
  userData: UserData;
  completedHabits?: Habit[];
  onFaceRecognitionComplete?: () => void;
  onNavigate: (page: "dashboard" | "health" | "shop" | "community" | "profile" | "chat") => void; // onNavigate prop 추가
};

export function Dashboard({ userData, completedHabits = [], onFaceRecognitionComplete, onNavigate }: DashboardProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'character',
      content: '안녕! 오늘 기분은 어때? 건강 관리를 도와줄게! 💚',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 건강 상품 추천 데이터
  const healthProducts = [
    {
      name: '프리미엄 요가 매트',
      price: '₩45,000',
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
      link: '#',
      description: '미끄럼 방지 친환경 매트'
    },
    {
      name: '스마트 워터 보틀',
      price: '₩32,000',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      link: '#',
      description: '물 섭취량 추적 보틀'
    },
    {
      name: '프로틴 쉐이크',
      price: '₩28,000',
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
      link: '#',
      description: '운동 회복 단백질 보충제'
    },
    {
      name: '슬립 마스크',
      price: '₩15,000',
      image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400',
      link: '#',
      description: '숙면 아로마 슬립 마스크'
    },
    {
      name: '피트니스 밴드',
      price: '₩12,000',
      image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400',
      link: '#',
      description: '홈트레이닝 저항 밴드'
    }
  ];

  const getCharacterResponse = (userMessage: string): Message[] => {
    const lowerMessage = userMessage.toLowerCase();
    const responses: Message[] = [];

    if (lowerMessage.includes('수면') || lowerMessage.includes('잠')) {
      responses.push({
        id: Date.now().toString(),
        type: 'character',
        content: '수면은 정말 중요해! 하루 7-8시간은 자야 건강을 유지할 수 있어. 😴',
        timestamp: new Date()
      });
      responses.push({
        id: (Date.now() + 1).toString(),
        type: 'product',
        content: '숙면에 도움이 되는 제품을 추천할게!',
        timestamp: new Date(),
        product: healthProducts[3]
      });
    } else if (lowerMessage.includes('운동') || lowerMessage.includes('헬스')) {
      responses.push({
        id: Date.now().toString(),
        type: 'character',
        content: '운동 시작하려는구나! 정말 좋아! 매일 30분씩만 움직여도 건강이 좋아질 거야! 💪',
        timestamp: new Date()
      });
      responses.push({
        id: (Date.now() + 1).toString(),
        type: 'product',
        content: '운동에 도움되는 아이템을 추천해줄게!',
        timestamp: new Date(),
        product: healthProducts[4]
      });
    } else if (lowerMessage.includes('물') || lowerMessage.includes('수분')) {
      responses.push({
        id: Date.now().toString(),
        type: 'character',
        content: '하루에 물 8잔(약 2L)을 마시는 게 좋아! 수분 섭취는 건강의 기본이야! 💧',
        timestamp: new Date()
      });
      responses.push({
        id: (Date.now() + 1).toString(),
        type: 'product',
        content: '이 스마트 보틀이 물 마시는 걸 도와줄 거야!',
        timestamp: new Date(),
        product: healthProducts[1]
      });
    } else if (lowerMessage.includes('식단') || lowerMessage.includes('음식') || lowerMessage.includes('먹')) {
      responses.push({
        id: Date.now().toString(),
        type: 'character',
        content: '균형 잡힌 식단이 중요해! 채소와 단백질을 충분히 섭취하는 게 좋아. 🥗',
        timestamp: new Date()
      });
      responses.push({
        id: (Date.now() + 1).toString(),
        type: 'product',
        content: '단백질 보충에는 이 제품이 좋아!',
        timestamp: new Date(),
        product: healthProducts[2]
      });
    } else if (lowerMessage.includes('요가') || lowerMessage.includes('스트레칭')) {
      responses.push({
        id: Date.now().toString(),
        type: 'character',
        content: '요가와 스트레칭은 몸과 마음의 건강에 정말 좋아! 매일 조금씩 해보자! 🧘',
        timestamp: new Date()
      });
      responses.push({
        id: (Date.now() + 1).toString(),
        type: 'product',
        content: '요가를 위한 매트를 추천할게!',
        timestamp: new Date(),
        product: healthProducts[0]
      });
    } else if (lowerMessage.includes('추천') || lowerMessage.includes('제품')) {
      const randomProduct = healthProducts[Math.floor(Math.random() * healthProducts.length)];
      responses.push({
        id: Date.now().toString(),
        type: 'character',
        content: '건강 관리에 도움되는 제품을 추천해줄게!',
        timestamp: new Date()
      });
      responses.push({
        id: (Date.now() + 1).toString(),
        type: 'product',
        content: '이 제품 어때?',
        timestamp: new Date(),
        product: randomProduct
      });
    } else {
      const defaultResponses = [
        '그렇구나! 건강 관리에 궁금한 게 있으면 물어봐! 😊',
        '좋아! 함께 건강한 습관을 만들어보자! 💚',
        '잘하고 있어! 계속 이렇게 노력하면 좋은 결과가 있을 거야! ✨',
        '오늘도 화이팅! 건강이 최고야! 🌟'
      ];
      responses.push({
        id: Date.now().toString(),
        type: 'character',
        content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
        timestamp: new Date()
      });
    }

    return responses;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const responses = getCharacterResponse(input);
      setMessages(prev => [...prev, ...responses]);
    }, 500);
  };

  // Calculate health score (0-100)
  const calculateHealthScore = () => {
    const sleepScore = Math.min((userData.healthData.sleep / 8) * 100, 100);
    const dietScore = Math.min((userData.healthData.diet / 2000) * 100, 100);
    const exerciseScore = Math.min((userData.healthData.exercise / 30) * 100, 100);
    
    return Math.round((sleepScore + dietScore + exerciseScore) / 3);
  };

  const healthScore = calculateHealthScore();

  return (
    <div className="p-6 pb-24 wellness-gradient min-h-screen">
      {/* Header with Gradient Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 relative"
      >
        <div className="flex items-center gap-3 mb-1">
          <Home className="w-8 h-8 text-lime-600" />
          <h1 className="text-3xl bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
            홈
          </h1>
        </div>
        <p className="text-sm text-gray-500">당신의 건강한 하루</p>
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-6 h-6 text-lime-400 animate-pulse" />
        </div>
      </motion.div>

      {/* Gold Display */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-end mb-4"
      >
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
          <Coins className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-gray-700">{userData.gold} 골드</span>
        </div>
      </motion.div>

      {/* Character Display */}
      <motion.div 
        className="wellness-card p-8 mb-4 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Character 
          healthScore={healthScore}
          customization={userData.customization}
          size="large"
          healthData={userData.healthData}
          onPhotoCapture={!userData.hasUsedFaceRecognition ? (imageData) => {
            console.log('Photo captured:', imageData);
            // TODO: Send to AI to analyze face and create character
            if (onFaceRecognitionComplete) {
              onFaceRecognitionComplete();
            }
          } : undefined}
        />
      </motion.div>

      {/* Completed Habits Achievements */}
      {completedHabits.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="wellness-card p-5 mb-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg text-gray-800">완료한 습관</h3>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600">{completedHabits.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {completedHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative aspect-square rounded-2xl bg-gradient-to-br ${habit.color} p-3 shadow-md hover:shadow-xl transition-all cursor-pointer group`}
              >
                {/* Sparkle effect */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-white drop-shadow-lg" />
                </motion.div>

                {/* Badge */}
                <div className="flex flex-col items-center justify-center h-full">
                  <motion.div
                    className="text-4xl mb-1"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {habit.badge}
                  </motion.div>
                  <p className="text-xs text-white text-center font-medium drop-shadow">
                    {habit.title}
                  </p>
                  <p className="text-xs text-white/80 text-center mt-0.5">
                    {habit.goal}일 달성
                  </p>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Character Chat - Right below character */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="wellness-card p-5 mb-6 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors" // cursor-pointer, hover 효과 추가
        onClick={() => onNavigate('chat')} // 클릭 시 'chat' 페이지로 이동
      >
        <div className="flex items-center gap-2 mb-4 pointer-events-none"> {/* 내부 요소 클릭 방지 */}
          <MessageCircle className="w-5 h-5 text-lime-600" />
          <h3 className="text-lg text-gray-800">핏프렌드와 대화하기</h3>
        </div>

        {/* Messages */}
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pointer-events-none"> {/* 내부 요소 클릭 방지 */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'product' && message.product ? (
                <div className="bg-gradient-to-r from-lime-50 to-green-50 rounded-2xl p-4 max-w-[85%] border border-lime-100">
                  <p className="text-sm text-gray-700 mb-3">{message.content}</p>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={message.product.image}
                      alt={message.product.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="text-sm text-gray-800 mb-1">{message.product.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{message.product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-lime-700">{message.product.price}</span>
                        <button className="flex items-center gap-1 text-xs bg-lime-600 text-white px-3 py-1.5 rounded-lg hover:bg-lime-700 transition-colors">
                          <ShoppingCart className="w-3 h-3" />
                          <span>구매하기</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[75%] ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white'
                      : 'bg-gradient-to-br from-lime-50 to-green-50 text-gray-800 border border-lime-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - disabled look */}
        <div className="flex gap-2 pointer-events-none"> {/* 내부 요소 클릭 방지 */}
          <div
            className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-400"
          >
            건강 관련 질문을 해보세요...
          </div>
          <div
            className="p-3 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl shadow-sm"
          >
            <Send className="w-5 h-5" />
          </div>
        </div>
      </motion.div>

      {/* Health Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="wellness-card p-4 shadow-md text-center"
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-lime-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-lime-600" />
          </div>
          <p className="text-xs text-gray-500 mb-1">수면</p>
          <p className="text-lg text-gray-800">{userData.healthData.sleep}h</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="wellness-card p-4 shadow-md text-center"
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
            <Utensils className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 mb-1">칼로리</p>
          <p className="text-lg text-gray-800">{userData.healthData.diet}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="wellness-card p-4 shadow-md text-center"
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mb-1">운동</p>
          <p className="text-lg text-gray-800">{userData.healthData.exercise}분</p>
        </motion.div>
      </div>

      {/* Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="wellness-card p-6 shadow-lg bg-gradient-to-br from-white to-lime-50"
      >
        <h3 className="text-lg text-gray-800 mb-4">오늘의 건강 점수</h3>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-lime-400 to-green-400 flex items-center justify-center shadow-lg">
            <span className="text-2xl text-white">{healthScore}</span>
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-lime-500 to-green-500 h-3 rounded-full transition-all"
                style={{ width: `${healthScore}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {healthScore >= 80 ? '훌륭해요! 💪' : healthScore >= 60 ? '잘하고 있어요! 🌟' : '조금 더 노력해봐요! 💚'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}