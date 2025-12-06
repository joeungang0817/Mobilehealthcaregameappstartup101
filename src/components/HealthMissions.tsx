import { useState } from 'react';
import { Target, CheckCircle, Lock, Coins, Trophy, Star, TrendingUp, Activity, BarChart3, MessageSquare, Calendar, Sparkles, Award, Flame, Zap, Moon, Apple, Dumbbell, Camera, X, Loader2, Share2, Brain, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Character } from './Character';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- Types & Interfaces ---
type VerificationType = 'photo' | 'text' | 'auto';

type Mission = {
  id: string;
  title: string;
  description: string;
  category: 'sleep' | 'diet' | 'exercise';
  reward: number;
  difficulty: string;
  icon: string;
  requirement: string;
  completed: boolean;
  locked: boolean;
  verificationType?: VerificationType;
};

type Habit = {
  id: string;
  title: string;
  description: string;
  category: 'sleep' | 'diet' | 'exercise';
  goal: number; 
  currentStreak: number;
  bestStreak: number;
  icon: string;
  color: string;
  badge: string;
  completed: boolean;
  verificationType?: VerificationType;
};

type HealthMissionsProps = {
  onCompleteMission: (category: 'sleep' | 'diet' | 'exercise', reward: number) => void;
};

// --- Verification Components (인증 연출 컴포넌트) ---

const DietVerification = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState<'camera' | 'analyzing' | 'result'>('camera');

  const handleCapture = () => {
    setStep('analyzing');
    setTimeout(() => setStep('result'), 2000);
  };

  return (
    <div className="h-full flex flex-col relative p-6">
      {step === 'camera' && (
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div 
              onClick={handleCapture}
              className="w-full aspect-[4/3] bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-lime-500 transition-all group relative overflow-hidden mb-4"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform z-10">
                <Camera className="w-8 h-8 text-gray-400 group-hover:text-lime-500" />
              </div>
              <p className="mt-3 text-gray-500 font-medium z-10 text-sm">촬영하기</p>
            </div>
            <p className="text-gray-400 text-xs text-center">음식이나 음료를 촬영해주세요.</p>
          </div>
          {/* 하단 버튼 공간 확보용 (투명 버튼이나 여백) */}
          <div className="h-12" />
        </div>
      )}
      {step === 'analyzing' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[300px]">
          <Loader2 className="w-10 h-10 text-lime-500 animate-spin mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">AI 분석 중...</h3>
          <p className="text-sm text-gray-500">영양소를 계산하고 있습니다.</p>
        </div>
      )}
      {step === 'result' && (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 overflow-y-auto">
          {/* 이미지 영역 */}
          <div className="relative w-full h-full bg-gray-200 rounded-xl mb-6 flex items-center justify-center overflow-hidden shadow-inner">
            <img src="src/assets/salad.jpg" width="300"/>
          </div>
          <div className="flex">
          <div className="left-2 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-orange-600 shadow-sm border border-white/50">
                🥗 닭가슴살 샐러드
          </div>
          &ensp;
          &ensp;
          &ensp;
          &ensp;
          &ensp;
          &ensp;
          <div className=" right-2 bg-black/70 backdrop-blur-md text-black px-2 py-1 rounded-full text-[10px] font-bold shadow-sm">
                320 kcal
          </div>
          </div>
          {/* 영양 정보 */}
          <div className="bg-gray-50 rounded-xl p-4 mt-2 mb-6 border border-gray-100 shadow-sm shrink-0">
            <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-lime-500" /> 영양소 분석
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 w-16">탄수화물</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full mx-2 overflow-hidden">
                  <div className="h-full bg-orange-400 w-[40%]" />
                </div>
                <span className="font-bold text-gray-800 w-8 text-right">24g</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 w-16">단백질</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full mx-2 overflow-hidden">
                  <div className="h-full bg-blue-500 w-[60%]" />
                </div>
                <span className="font-bold text-blue-600 w-8 text-right">28g</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 w-16">지방</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full mx-2 overflow-hidden">
                  <div className="h-full bg-yellow-400 w-[30%]" />
                </div>
                <span className="font-bold text-gray-800 w-8 text-right">12g</span>
              </div>
            </div>
          </div>

          {/* 버튼: mt-auto를 통해 하단에 고정하고 상단 요소와 간격 확보 */}
          <button onClick={onComplete} className="w-full py-3 bg-lime-500 text-white font-bold rounded-xl shadow-md hover:bg-lime-600 transition-all flex items-center justify-center gap-2 mt-auto text-sm mb-2">
            <CheckCircle className="w-4 h-4" /> 인증 완료
          </button>
        </div>
      )}
    </div>
  );
};

const ExerciseVerification = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [text, setText] = useState('');

  const handleAnalyze = () => {
    setStep('analyzing');
    setTimeout(() => setStep('result'), 2000);
  };

  return (
    <div className="h-full flex flex-col p-6">
      {step === 'input' && (
        <div className="flex-1 flex flex-col h-full">
          <h3 className="text-base font-bold text-gray-800 mb-3">어떤 운동을 하셨나요?</h3>
          <textarea 
            className="w-full flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[120px]"
            placeholder="예: 한강에서 30분 동안 러닝했어."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* 버튼: 상단 textarea와 mb-6로 간격 확보, mt-auto로 하단 배치 */}
          <button onClick={handleAnalyze} disabled={!text} className={`w-full py-3 rounded-xl font-bold text-black transition-all text-sm mt-auto mb-2 ${text ? 'bg-blue-500 shadow-md' : 'bg-gray-300'}`}>
            기록 분석하기
          </button>
        </div>
      )}
      {step === 'analyzing' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[300px]">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">분석 중...</h3>
        </div>
      )}
      {step === 'result' && (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-blue-500 rounded-2xl p-5 text-black text-center mb-6 shadow-md mt-4">
            <Dumbbell className="w-10 h-10 mx-auto mb-2 text-blue-100" />
            <h3 className="text-xl font-bold mb-1">오운완!</h3>
            <p className="text-blue-100 text-sm">약 350kcal 소모 추정</p>
          </div>
          {/* 버튼: 상단 카드와 mb-6로 간격 확보, mt-auto로 하단 배치 */}
          <button onClick={onComplete} className="w-full py-3 bg-blue-600 text-black font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-auto mb-2 text-sm">
            <CheckCircle className="w-4 h-4" /> 인증 완료
          </button>
        </div>
      )}
    </div>
  );
};

const SleepVerification = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState<'start' | 'loading' | 'result'>('start');

  const handleCheck = () => {
    setStep('loading');
    setTimeout(() => setStep('result'), 2000);
  };

  return (
    <div className="h-full flex flex-col p-6">
      {step === 'start' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center h-full">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 relative">
            <Moon className="w-10 h-10 text-indigo-500" />
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping opacity-20" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">수면 시간 측정</h3>
          <p className="text-gray-500 text-xs mb-8">핸드폰 미사용 시간을 확인합니다.</p>
          
          {/* 버튼: 상단 텍스트와 mb-8로 간격 확보, mt-auto로 하단 배치 */}
          <button onClick={handleCheck} className="w-full py-3 bg-indigo-500 text-black font-bold rounded-xl shadow-md hover:bg-indigo-600 transition-all text-sm mt-auto mb-2">
            데이터 불러오기
          </button>
        </div>
      )}
      {step === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[300px]">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">동기화 중...</h3>
        </div>
      )}
      {step === 'result' && (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-slate-800 rounded-2xl p-6 text-black text-center mb-6 shadow-md mt-4">
            <div className="text-3xl font-bold mb-1">7시간 42분</div>
            <p className="text-slate-400 text-xs">총 수면 시간</p>
          </div>
          {/* 버튼: 상단 카드와 mb-6로 간격 확보, mt-auto로 하단 배치 */}
          <button onClick={onComplete} className="w-full py-3 bg-indigo-500 text-black font-bold rounded-xl shadow-md hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 mt-auto mb-2 text-sm">
            <CheckCircle className="w-4 h-4" /> 인증 완료
          </button>
        </div>
      )}
    </div>
  );
};

export function HealthMissions({ onCompleteMission }: HealthMissionsProps) {
  const [selectedTab, setSelectedTab] = useState<'missions' | 'habits' | 'report' | 'analysis'>('missions');
  const [reportPeriod, setReportPeriod] = useState<'week' | 'month'>('week');
  const [celebratingHabit, setCelebratingHabit] = useState<string | null>(null);
  
  // Verification Modal State
  const [verifyingItem, setVerifyingItem] = useState<Mission | Habit | null>(null);

  const [missions, setMissions] = useState<Mission[]>([
    { id: 'sleep-1', title: '8시간 수면', description: '충분한 수면으로 하루를 시작하세요', category: 'sleep', difficulty: '쉬움', reward: 50, requirement: '8시간 이상 수면', icon: '🌙', completed: false, locked: false, verificationType: 'auto' },
    { id: 'sleep-2', title: '스트레칭', description: '잠들기 전 10분 스트레칭', category: 'sleep', difficulty: '쉬움', reward: 35, requirement: '10분 스트레칭', icon: '🧘', completed: false, locked: false, verificationType: 'text' },
    { id: 'diet-1', title: '아침 식사', description: '건강한 아침 식사 챙기기', category: 'diet', difficulty: '쉬움', reward: 30, requirement: '건강한 아침 식사', icon: '🍳', completed: false, locked: false, verificationType: 'photo' },
    { id: 'diet-2', title: '물 8잔', description: '하루에 물 8잔을 마시세요', category: 'diet', difficulty: '보통', reward: 40, requirement: '2L 이상 물 섭취', icon: '💧', completed: false, locked: false, verificationType: 'photo' },
    { id: 'diet-3', title: '채소 5종류', description: '다양한 채소를 섭취하세요', category: 'diet', difficulty: '어려움', reward: 90, requirement: '5종류 채소 섭취', icon: '🥗', completed: false, locked: true, verificationType: 'photo' },
    { id: 'exercise-1', title: '30분 운동', description: '30분 이상 운동', category: 'exercise', difficulty: '보통', reward: 75, requirement: '30분 이상 운동', icon: '🏃', completed: false, locked: false, verificationType: 'text' },
    { id: 'exercise-2', title: '10,000 걸음', description: '하루 만보를 걸어보세요', category: 'exercise', difficulty: '보통', reward: 60, requirement: '10,000보 걷기', icon: '👟', completed: false, locked: false, verificationType: 'auto' },
    { id: 'exercise-3', title: '근력 운동', description: '근력 운동으로 몸을 강화하세요', category: 'exercise', difficulty: '어려움', reward: 100, requirement: '30분 근력 운동', icon: '💪', completed: false, locked: true, verificationType: 'text' }
  ]);

  const [habits, setHabits] = useState<Habit[]>([
    { id: 'habit-1', title: '아침형 인간', description: '30일 연속 7시 전 기상', category: 'sleep', goal: 30, currentStreak: 12, bestStreak: 15, icon: '🌅', color: 'from-lime-400 to-green-400', badge: '🏆', completed: false, verificationType: 'auto' },
    { id: 'habit-2', title: '수면 마스터', description: '7일 연속 8시간 수면', category: 'sleep', goal: 7, currentStreak: 4, bestStreak: 6, icon: '😴', color: 'from-teal-400 to-cyan-400', badge: '🌙', completed: false, verificationType: 'auto' },
    { id: 'habit-3', title: '물 마시기 챌린지', description: '30일 연속 2L 물 섭취', category: 'diet', goal: 30, currentStreak: 18, bestStreak: 20, icon: '💧', color: 'from-blue-400 to-cyan-400', badge: '💎', completed: false, verificationType: 'photo' },
    { id: 'habit-4', title: '건강한 식단', description: '14일 연속 채소 섭취', category: 'diet', goal: 14, currentStreak: 14, bestStreak: 14, icon: '🥗', color: 'from-green-400 to-emerald-400', badge: '🌱', completed: true, verificationType: 'photo' },
    { id: 'habit-5', title: '운동 전사', description: '21일 연속 30분 운동', category: 'exercise', goal: 21, currentStreak: 8, bestStreak: 10, icon: '🔥', color: 'from-orange-400 to-red-400', badge: '⚡', completed: false, verificationType: 'text' },
    { id: 'habit-6', title: '만보 걷기', description: '14일 연속 10,000보', category: 'exercise', goal: 14, currentStreak: 5, bestStreak: 7, icon: '👟', color: 'from-yellow-400 to-orange-400', badge: '🥇', completed: false, verificationType: 'auto' }
  ]);

  const handleVerify = (item: Mission | Habit) => {
    setVerifyingItem(item);
  };

  const handleVerificationComplete = () => {
    if (!verifyingItem) return;

    if ('requirement' in verifyingItem) {
      completeMission(verifyingItem.id);
    } else {
      incrementHabit(verifyingItem.id);
    }
    setVerifyingItem(null);
  };

  const completeMission = (missionId: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId && !m.completed && !m.locked) {
        onCompleteMission(m.category, m.reward);
        return { ...m, completed: true };
      }
      return m;
    }));
  };

  const incrementHabit = (habitId: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId && !h.completed) {
        const newStreak = h.currentStreak + 1;
        const isCompleted = newStreak >= h.goal;
        
        if (isCompleted) {
          setCelebratingHabit(habitId);
          setTimeout(() => setCelebratingHabit(null), 3000);
          onCompleteMission(h.category, h.goal * 10);
        }
        
        return {
          ...h,
          currentStreak: newStreak,
          bestStreak: Math.max(h.bestStreak, newStreak),
          completed: isCompleted
        };
      }
      return h;
    }));
  };

  const resetHabit = (habitId: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        return {
          ...h,
          currentStreak: 0,
          completed: false
        };
      }
      return h;
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '쉬움': return 'text-green-600 bg-green-100';
      case '보통': return 'text-yellow-600 bg-yellow-100';
      case '어려움': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sleep': return <Moon className="w-4 h-4" />;
      case 'diet': return <Apple className="w-4 h-4" />;
      case 'exercise': return <Dumbbell className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Mock health data for report
  const weekData = [
    { day: '월', sleep: 7, diet: 75, exercise: 45 },
    { day: '화', sleep: 8, diet: 80, exercise: 30 },
    { day: '수', sleep: 6, diet: 60, exercise: 60 },
    { day: '목', sleep: 7.5, diet: 85, exercise: 40 },
    { day: '금', sleep: 8, diet: 90, exercise: 50 },
    { day: '토', sleep: 9, diet: 70, exercise: 70 },
    { day: '일', sleep: 7, diet: 80, exercise: 35 }
  ];

  const monthData = [
    { week: '1주', sleep: 7.2, diet: 72, exercise: 42 },
    { week: '2주', sleep: 7.5, diet: 78, exercise: 48 },
    { week: '3주', sleep: 7.8, diet: 80, exercise: 52 },
    { week: '4주', sleep: 7.6, diet: 85, exercise: 55 }
  ];

  const currentData = reportPeriod === 'week' ? weekData : monthData;

  return (
    <div className="pb-24">
      {/* Header with Gradient Title */}
      <div className="px-6 pt-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="flex items-center gap-3 mb-1">
            <Heart className="w-8 h-8 text-lime-600" />
            <h1 className="text-3xl bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
              건강
            </h1>
          </div>
          <p className="text-sm text-gray-500">목표를 달성하고 보상을 받으세요</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {/* ... Tabs Buttons ... */}
          <button
            onClick={() => setSelectedTab('missions')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedTab === 'missions'
                ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-lg'
                : 'bg-white text-gray-600 shadow-md'
            }`}
          >
            <Target className="w-4 h-4" />
            <span className="text-sm">일일 미션</span>
          </button>
          <button
            onClick={() => setSelectedTab('habits')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedTab === 'habits'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 shadow-md'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span className="text-sm">습관 형성</span>
          </button>
          <button
            onClick={() => setSelectedTab('report')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedTab === 'report'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                : 'bg-white text-gray-600 shadow-md'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">리포트</span>
          </button>
          <button
            onClick={() => setSelectedTab('analysis')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedTab === 'analysis'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'bg-white text-gray-600 shadow-md'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">AI 분석</span>
          </button>
        </div>
      </div>

      {/* Daily Missions Tab */}
      {selectedTab === 'missions' && (
        <div className="px-6 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-700">오늘의 미션</h2>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4" />
              <span>{missions.filter(m => m.completed).length}/{missions.filter(m => !m.locked).length}</span>
            </div>
          </div>

          {missions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`wellness-card p-4 ${
                mission.locked ? 'opacity-50' : ''
              } ${mission.completed ? 'border-2 border-green-400' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{mission.icon}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-gray-800 mb-1">{mission.title}</h3>
                      <p className="text-sm text-gray-500">{mission.description}</p>
                    </div>
                    {mission.locked && <Lock className="w-5 h-5 text-gray-400" />}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(mission.difficulty)}`}>
                      {mission.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{mission.requirement}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Coins className="w-4 h-4" />
                      <span className="text-sm">{mission.reward}</span>
                    </div>

                    {mission.completed ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm">완료!</span>
                      </div>
                    ) : mission.locked ? (
                      <button
                        disabled
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-400 text-sm"
                      >
                        잠김
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(mission)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-lime-500 to-green-500 text-white text-sm hover:shadow-lg transition-shadow"
                      >
                        완료하기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Habits Tab */}
      {selectedTab === 'habits' && (
        <div className="px-6">
          <div className="mb-6">
            <h2 className="text-gray-700 mb-2">습관 형성 챌린지</h2>
            <p className="text-sm text-gray-500">꾸준히 실천하고 배지를 획득하세요!</p>
          </div>

          {/* Active Habits */}
          <div className="mb-8">
            <h3 className="text-sm text-gray-600 mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              진행 중
            </h3>
            <div className="space-y-3">
              {habits.filter(h => !h.completed).map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="wellness-card p-5 relative overflow-hidden"
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${habit.color} opacity-10`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{habit.icon}</div>
                        <div>
                          <h3 className="text-gray-800 mb-1">{habit.title}</h3>
                          <p className="text-xs text-gray-500">{habit.description}</p>
                        </div>
                      </div>
                      <div className={`p-2 rounded-full bg-gradient-to-r ${habit.color}`}>
                        {getCategoryIcon(habit.category)}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {habit.currentStreak} / {habit.goal}일
                        </span>
                        <span className="text-sm text-gray-500">
                          최고 {habit.bestStreak}일
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${habit.color} relative`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(habit.currentStreak / habit.goal) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        >
                          {habit.currentStreak > 0 && (
                            <motion.div
                              className="absolute inset-0 bg-white"
                              animate={{ opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                        </motion.div>
                      </div>
                    </div>

                    {/* Streak indicator */}
                    {habit.currentStreak > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(Math.min(habit.currentStreak, 7))].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <Flame className="w-4 h-4 text-orange-500" />
                            </motion.div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          {habit.currentStreak}일 연속 🔥
                        </span>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(habit)}
                        className={`flex-1 py-2 px-4 rounded-lg bg-gradient-to-r ${habit.color} text-white text-sm hover:shadow-lg transition-shadow flex items-center justify-center gap-1`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>오늘 완료</span>
                      </button>
                      <button
                        onClick={() => resetHabit(habit.id)}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50"
                      >
                        초기화
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Completed Habits */}
          {habits.filter(h => h.completed).length > 0 && (
            <div>
              <h3 className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                완료한 습관
              </h3>
              <div className="space-y-3">
                {habits.filter(h => h.completed).map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="wellness-card p-5 relative overflow-hidden border-2 border-yellow-400"
                  >
                    {/* Celebration sparkles */}
                    <div className="absolute top-2 right-2">
                      <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{habit.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 mb-1">{habit.title}</h3>
                        <p className="text-xs text-gray-500">{habit.description}</p>
                      </div>
                      <div className="text-4xl">{habit.badge}</div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">🎉</div>
                      <p className="text-sm text-yellow-800 font-medium">
                        습관 형성 완료!
                      </p>
                      <p className="text-xs text-yellow-600">
                        {habit.goal}일 연속 달성
                      </p>
                    </div>

                    <button
                      onClick={() => resetHabit(habit.id)}
                      className="w-full mt-3 py-2 px-4 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50"
                    >
                      다시 시작하기
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Report Tab */}
      {selectedTab === 'report' && (
        <div className="px-6">
          {/* Period Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setReportPeriod('week')}
              className={`px-6 py-2 rounded-full transition-all ${
                reportPeriod === 'week'
                  ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 shadow-md'
              }`}
            >
              7일
            </button>
            <button
              onClick={() => setReportPeriod('month')}
              className={`px-6 py-2 rounded-full transition-all ${
                reportPeriod === 'month'
                  ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 shadow-md'
              }`}
            >
              30일
            </button>
          </div>

          {/* Charts */}
          <div className="space-y-4">
            {/* Sleep Chart */}
            <div className="wellness-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Moon className="w-5 h-5 text-lime-600" />
                <h3 className="text-gray-700">수면 시간</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey={reportPeriod === 'week' ? 'day' : 'week'} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    stroke="#e5e7eb"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    stroke="#e5e7eb"
                    domain={[0, reportPeriod === 'week' ? 12 : 10]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value}시간`, '수면']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sleep" 
                    stroke="#a78bfa" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSleep)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Exercise Chart */}
            <div className="wellness-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-5 h-5 text-orange-500" />
                <h3 className="text-gray-700">운동 시간</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient id="colorExercise" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fb923c" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey={reportPeriod === 'week' ? 'day' : 'week'} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    stroke="#e5e7eb"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    stroke="#e5e7eb"
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value}분`, '운동']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="exercise" 
                    stroke="#fb923c" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorExercise)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Diet Chart */}
            <div className="wellness-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Apple className="w-5 h-5 text-green-500" />
                <h3 className="text-gray-700">식단 점수</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient id="colorDiet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey={reportPeriod === 'week' ? 'day' : 'week'} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    stroke="#e5e7eb"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    stroke="#e5e7eb"
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value}점`, '식단']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="diet" 
                    stroke="#34d399" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorDiet)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="wellness-card p-5">
              <h3 className="text-gray-700 mb-4">평균 통계</h3>
              <div className="grid grid-cols-3 gap-3">
                {/* Sleep Average */}
                <div className="bg-lime-50 rounded-xl p-4 text-center">
                  <Moon className="w-8 h-8 text-lime-600 mx-auto mb-2" />
                  <div className="text-2xl text-lime-700 mb-1">
                    {(currentData.reduce((sum, d) => sum + d.sleep, 0) / currentData.length).toFixed(1)}h
                  </div>
                  <p className="text-xs text-gray-600">평균 수면</p>
                </div>

                {/* Exercise Average */}
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <Dumbbell className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl text-orange-600 mb-1">
                    {Math.round(currentData.reduce((sum, d) => sum + d.exercise, 0) / currentData.length)}분
                  </div>
                  <p className="text-xs text-gray-600">평균 운동</p>
                </div>

                {/* Diet Average */}
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <Apple className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl text-green-600 mb-1">
                    {Math.round(currentData.reduce((sum, d) => sum + d.diet, 0) / currentData.length)}점
                  </div>
                  <p className="text-xs text-gray-600">평균 식단</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Tab */}
      {selectedTab === 'analysis' && (
        <div className="px-6">
          <div className="wellness-card p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                <Character healthScore={75} customization={{ skin: 'default', outfit: 'casual', accessory: 'glasses' }} size="small" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-800 mb-1">건강 도우미</h3>
                <p className="text-sm text-gray-500">당신의 건강을 분석해드려요</p>
              </div>
            </div>

            <div className="bg-lime-50 border-l-4 border-lime-400 rounded-r-2xl p-4 mb-4">
              <p className="text-gray-700 leading-relaxed">
                이번 주 정말 잘하고 있어요! 🎉 특히 운동량이 지난주 대비 30% 증가했네요. 
                다만 수면 시간이 평균 6.5시간으로 약간 부족해요. 
                오늘 30분 일찍 자는 것을 목표로 해보는 건 어떨까요? 😴
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700">운동량 우수</span>
                </div>
                <span className="text-sm text-green-600">+30%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-700">식단 개선 필요</span>
                </div>
                <span className="text-sm text-yellow-600">보통</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-700">수면 시간 부족</span>
                </div>
                <span className="text-sm text-orange-600">6.5시간</span>
              </div>
            </div>
          </div>

          <div className="wellness-card p-6">
            <h3 className="text-gray-700 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              추천 미션
            </h3>
            <div className="space-y-3">
              <button className="w-full p-4 bg-gradient-to-r from-lime-50 to-green-50 rounded-xl text-left hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🌙</div>
                  <div className="flex-1">
                    <h4 className="text-gray-800 text-sm mb-1">일찍 자기 챌린지</h4>
                    <p className="text-xs text-gray-500">23시 전에 잠들기</p>
                  </div>
                  <Coins className="w-5 h-5 text-yellow-600" />
                </div>
              </button>

              <button className="w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl text-left hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🥗</div>
                  <div className="flex-1">
                    <h4 className="text-gray-800 text-sm mb-1">채소 먹기</h4>
                    <p className="text-xs text-gray-500">점심에 샐러드 추가</p>
                  </div>
                  <Coins className="w-5 h-5 text-yellow-600" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      <AnimatePresence>
        {celebratingHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden"
            >
              {/* Confetti effect */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{ 
                    x: '50%', 
                    y: '50%',
                    scale: 0
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: [0, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05
                  }}
                />
              ))}

              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: 3
                }}
                className="text-7xl mb-4"
              >
                🎉
              </motion.div>

              <h2 className="text-2xl text-gray-800 mb-2">축하합니다!</h2>
              <p className="text-gray-600 mb-4">
                {habits.find(h => h.id === celebratingHabit)?.title} 습관을 완성했습니다!
              </p>

              <div className="text-6xl mb-4">
                {habits.find(h => h.id === celebratingHabit)?.badge}
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 mb-4">
                <p className="text-sm text-gray-700">
                  습관 형성 보너스 골드 획득!
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Coins className="w-6 h-6 text-yellow-600" />
                  <span className="text-2xl text-yellow-600">
                    +{(habits.find(h => h.id === celebratingHabit)?.goal || 0) * 10}
                  </span>
                </div>
              </div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Sparkles className="w-12 h-12 mx-auto text-yellow-500" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Modal (New) */}
     <AnimatePresence>
        {verifyingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // 1. items-end(하단 정렬)를 items-center(중앙 정렬)로 변경하여 항상 화면 가운데 팝업되게 함
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setVerifyingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              
              // 👇 [수정됨] 너비 관련 클래스 변경
              // w-full -> w-[350px] 또는 w-[400px] (원하는 고정 너비)
              // max-w-sm 대신 max-w-[90vw] (화면보다 클 경우 화면 너비의 90%까지만)
              className="bg-white min-w-[600px] min-h-[400px] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
              
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-bold text-lg text-gray-800">{verifyingItem.title} 인증  &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; &ensp;</h3>
                <button onClick={() => setVerifyingItem(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden h-full">
                {verifyingItem.verificationType === 'photo' && <DietVerification onComplete={handleVerificationComplete} />}
                {verifyingItem.verificationType === 'text' && <ExerciseVerification onComplete={handleVerificationComplete} />}
                {verifyingItem.verificationType === 'auto' && <SleepVerification onComplete={handleVerificationComplete} />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}