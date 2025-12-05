import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Brain, Sparkles, Activity, ChefHat, Dumbbell } from 'lucide-react';
import { motion } from 'motion/react';
import { Character } from './Character';
import { UserData } from '../App';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Message = {
  id: string;
  type: 'user' | 'character' | 'ai-analysis' | 'diet-plan' | 'workout-plan';
  content: string;
  timestamp: Date;
  data?: any;
};

type CharacterChatProps = {
  userData: UserData;
  onBack: () => void;
};

export function CharacterChat({ userData, onBack }: CharacterChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'character',
      content: `안녕! 오늘 기분은 어때? 건강 관리를 도와줄게! 💚`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock Analysis Data
  const analysisData = [
    { name: '월', score: 65 }, { name: '화', score: 70 }, { name: '수', score: 68 },
    { name: '목', score: 75 }, { name: '금', score: 82 }, { name: '토', score: 88 },
    { name: '일', score: 95 },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getAIResponse = (userMessage: string) => {
    setIsTyping(true);
    setTimeout(() => {
      let newMessages: Message[] = [];
      const timestamp = new Date();
      const lower = userMessage.toLowerCase();

      if (lower.includes('분석') || lower.includes('상태')) {
        newMessages.push({
          id: Date.now().toString(), type: 'character', content: '최근 데이터를 분석해봤어! 📈', timestamp
        });
        newMessages.push({
          id: (Date.now()+1).toString(), type: 'ai-analysis', content: '건강 리포트', timestamp,
          data: { score: 95, summary: '지난주보다 수면 질이 아주 좋아졌어! 훌륭해! 🎉' }
        });
      } else if (lower.includes('식단') || lower.includes('추천')) {
        newMessages.push({
          id: Date.now().toString(), type: 'character', content: '맛있고 건강한 식단을 준비했어 🥗', timestamp
        });
        newMessages.push({
          id: (Date.now()+1).toString(), type: 'diet-plan', content: '추천 식단', timestamp,
          data: { 
            calories: 1800, 
            meals: [
              { name: '그릭요거트와 그래놀라', cal: 350, tag: '아침' },
              { name: '훈제오리 샐러드', cal: 500, tag: '점심' },
              { name: '두부면 파스타', cal: 400, tag: '저녁' }
            ]
          }
        });
      } else {
        newMessages.push({
          id: Date.now().toString(), type: 'character', 
          content: '듣기 좋은 말이야! 건강 관리에 대해 더 궁금한 게 있으면 물어봐줘 😊', 
          timestamp
        });
      }
      setMessages(prev => [...prev, ...newMessages]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), type: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    getAIResponse(input);
  };

  // Calculate health score for avatar
  const healthScore = Math.round((userData.healthData.sleep/8*100 + userData.healthData.diet/2000*100 + userData.healthData.exercise/30*100)/3);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="ml-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center overflow-hidden border border-lime-200">
            <Character healthScore={healthScore} customization={userData.customization} size="small" />
          </div>
          {/* 텍스트 크기 키우고(text-lg) 살짝 아래로 내림(mt-1) */}
          <div className="mt-3">
            <h1 className="text-lg font-bold text-gray-900 leading-none">핏프렌드</h1>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Standard Bubble */}
            {['user', 'character'].includes(message.type) && (
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                message.type === 'user' 
                  ? 'bg-lime-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
              }`}>
                {message.content}
              </div>
            )}

            {/* AI Analysis Card */}
            {message.type === 'ai-analysis' && (
              <div className="w-full max-w-[85%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-lime-600" />
                  <span className="font-bold text-gray-800 text-sm">건강 분석</span>
                </div>
                <div className="h-32 w-full mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analysisData}>
                      <defs>
                        <linearGradient id="chatColorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                      <Tooltip />
                      <Area type="monotone" dataKey="score" stroke="#84cc16" strokeWidth={2} fillOpacity={1} fill="url(#chatColorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">{message.data.summary}</p>
              </div>
            )}

            {/* Diet Plan Card */}
            {message.type === 'diet-plan' && (
              <div className="w-full max-w-[85%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <ChefHat className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-gray-800 text-sm">추천 식단</span>
                </div>
                <div className="space-y-2">
                  {message.data.meals.map((meal: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs p-2 bg-orange-50/50 rounded-lg">
                      <span className="font-bold text-orange-600">{meal.tag}</span>
                      <span className="text-gray-700">{meal.name}</span>
                      <span className="text-gray-400">{meal.cal}kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 시간 표시 정렬 수정: text-right 추가 */}
            <span className={`text-[10px] text-gray-400 mt-1 px-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 ml-2">
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75" />
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150" />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area: 패딩을 키워 높이 확보 (py-6, pb-10) */}
      <div className="p-4 py-6 pb-10 bg-white border-t border-gray-100 margin-left-10">
        <div className="relative flex items-center gap-2 margin-left-10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="   메시지를 입력하세요..."
            className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-400 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-3 rounded-full transition-all ${input.trim() ? 'bg-lime-500 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}