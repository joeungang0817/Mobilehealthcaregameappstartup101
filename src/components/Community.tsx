import { useState, useEffect } from 'react';
import { Users, Trophy, Zap, Heart, Apple, UserPlus, Mail, X, Check, Star, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Character } from './Character';
import { Friend, CharacterCustomization } from '../App';

type CommunityProps = {
  friends: Friend[];
  onAddFriend: (friend: Friend) => void;
  onRemoveFriend: (friendId: string) => void;
  currentUserStats: {
    name: string;
    healthScore: number;
    customization: CharacterCustomization;
    points: number;
  };
};

type BattleType = 'long-jump' | 'long-run' | 'sprint';

type BattleResult = {
  winner: 'user' | 'opponent';
  userScore: number;
  opponentScore: number;
  battleType: BattleType;
  opponentName: string;
};

type Stats = {
  power: number;      // 힘 (운동 기반)
  stamina: number;    // 지구력 (식단 기반)
  critical: number;   // 크리티컬 (수면 기반)
};

type FriendRequest = {
  id: string;
  name: string;
  healthScore: number;
  customization: CharacterCustomization;
  points: number;
};

const battleTypes = [
  {
    id: 'long-jump' as const,
    name: '멀리뛰기',
    icon: '💪',
    description: '힘으로 승부!',
    stat: 'power' as const,
    color: 'from-orange-400 to-red-400'
  },
  {
    id: 'long-run' as const,
    name: '장거리 달리기',
    icon: '🍎',
    description: '지구력 대결!',
    stat: 'stamina' as const,
    color: 'from-green-400 to-emerald-400'
  },
  {
    id: 'sprint' as const,
    name: '단거리 달리기',
    icon: '⚡',
    description: '크리티컬 확률!',
    stat: 'critical' as const,
    color: 'from-purple-400 to-pink-400'
  }
];

const dummyRequests: FriendRequest[] = [
  {
    id: 'req-1',
    name: 'Chris Park',
    healthScore: 78,
    customization: {
      skin: 'default',
      outfit: 'sporty',
      accessory: 'none',
      hairColor: '#8B4513',
      hairStyle: 'short'
    },
    points: 420
  },
  {
    id: 'req-2',
    name: 'Jenny Kim',
    healthScore: 88,
    customization: {
      skin: 'default',
      outfit: 'casual',
      accessory: 'glasses',
      hairColor: '#FFD700',
      hairStyle: 'long'
    },
    points: 550
  }
];

function calculateStats(healthScore: number, points: number): Stats {
  const baseScore = healthScore;
  const bonusFromPoints = Math.min(points / 10, 30);
  
  return {
    power: Math.min(Math.round(baseScore * 0.8 + bonusFromPoints * 0.6 + Math.random() * 10), 100),
    stamina: Math.min(Math.round(baseScore * 0.9 + bonusFromPoints * 0.5 + Math.random() * 10), 100),
    critical: Math.min(Math.round(baseScore * 0.7 + bonusFromPoints * 0.7 + Math.random() * 15), 100)
  };
}

function simulateBattle(
  userStats: Stats,
  opponentStats: Stats,
  battleType: BattleType
): BattleResult {
  const battle = battleTypes.find(b => b.id === battleType)!;
  const statKey = battle.stat;
  
  // 기본 스탯
  let userScore = userStats[statKey];
  let opponentScore = opponentStats[statKey];
  
  // 크리티컬 보너스
  const userCrit = Math.random() < (userStats.critical / 100);
  const opponentCrit = Math.random() < (opponentStats.critical / 100);
  
  if (userCrit) userScore *= 1.5;
  if (opponentCrit) opponentScore *= 1.5;
  
  // 랜덤 요소
  userScore *= (0.9 + Math.random() * 0.2);
  opponentScore *= (0.9 + Math.random() * 0.2);
  
  const winner = userScore > opponentScore ? 'user' : 'opponent';

  return {
    winner,
    userScore: Math.round(userScore),
    opponentScore: Math.round(opponentScore),
    battleType,
    opponentName: ''
  };
}

// Confetti Component for Victory
const Confetti = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][Math.floor(Math.random() * 5)]}`}
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
            duration: 1 + Math.random(), 
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

export function Community({ friends, onAddFriend, onRemoveFriend, currentUserStats }: CommunityProps) {
  const [selectedTab, setSelectedTab] = useState<'friends' | 'requests'>('friends');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(dummyRequests);
  const [showAddFriend, setShowAddFriend] = useState(false);
  
  // Battle modal states
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState<Friend | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [battlePhase, setBattlePhase] = useState<'select' | 'intro' | 'clash' | 'result'>('select');

  const userStats = calculateStats(currentUserStats.healthScore, currentUserStats.points);

  const startBattle = (opponent: Friend, battleType: BattleType) => {
    setBattlePhase('intro');
    
    const opponentStats = calculateStats(opponent.healthScore, opponent.points);
    const result = simulateBattle(userStats, opponentStats, battleType);
    result.opponentName = opponent.name;

    // Sequence: Intro -> Clash -> Result
    setTimeout(() => {
      setBattlePhase('clash');
      setTimeout(() => {
        setBattleResult(result);
        setBattlePhase('result');
      }, 2500); // Clash duration
    }, 2000); // Intro duration
  };

  const closeBattleModal = () => {
    setShowBattleModal(false);
    setSelectedOpponent(null);
    setBattleResult(null);
    setBattlePhase('select');
  };

  const openBattleModal = (friend: Friend) => {
    setSelectedOpponent(friend);
    setShowBattleModal(true);
    setBattleResult(null);
    setBattlePhase('select');
  };

  const acceptFriendRequest = (request: FriendRequest) => {
    const newFriend: Friend = {
      id: request.id,
      name: request.name,
      healthScore: request.healthScore,
      customization: request.customization,
      lastActive: 'Just now',
      points: request.points
    };
    onAddFriend(newFriend);
    setFriendRequests(prev => prev.filter(r => r.id !== request.id));
  };

  const rejectFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  return (
    <div className="min-h-screen wellness-gradient pb-24">
      {/* Header */}
      <div className="p-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <Users className="w-8 h-8 text-lime-600" />
          <h1 className="text-3xl bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
            커뮤니티
          </h1>
        </motion.div>
        <p className="text-gray-600 text-sm">친구들과 함께 건강한 경쟁을! 💪</p>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTab('friends')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              selectedTab === 'friends'
                ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-lg'
                : 'bg-white text-gray-600 shadow-md'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              <span>친구 목록</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('requests')}
            className={`flex-1 py-3 rounded-xl transition-all relative ${
              selectedTab === 'requests'
                ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-lg'
                : 'bg-white text-gray-600 shadow-md'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              <span>친구 요청</span>
              {friendRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {friendRequests.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Friends Tab */}
      {selectedTab === 'friends' && (
        <div className="px-6 space-y-4">
          {/* Add Friend Button */}
          <button
            onClick={() => setShowAddFriend(true)}
            className="w-full wellness-card p-4 hover:shadow-lg transition-shadow flex items-center justify-center gap-2 text-lime-600"
          >
            <UserPlus className="w-5 h-5" />
            <span>친구 추가하기</span>
          </button>

          {/* My Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="wellness-card p-5"
          >
            <h3 className="text-gray-700 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              내 스탯
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="character-circle w-20 h-20 absolute"></div>
                <div className="relative">
                  <Character 
                    healthScore={currentUserStats.healthScore} 
                    customization={currentUserStats.customization} 
                    size="small" 
                  />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-gray-800 mb-1">{currentUserStats.name}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-lime-50 rounded-full">
                    <Heart className="w-3 h-3 text-lime-600" />
                    <span className="text-xs text-lime-700">{currentUserStats.healthScore}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-full">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-600">{currentUserStats.points}P</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Stats Bars */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-24">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">힘</span>
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${userStats.power}%` }}
                    className="h-full bg-gradient-to-r from-orange-400 to-red-400"
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">{userStats.power}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-24">
                  <Apple className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">지구력</span>
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${userStats.stamina}%` }}
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">{userStats.stamina}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-24">
                  <Star className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">크리티컬</span>
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${userStats.critical}%` }}
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">{userStats.critical}</span>
              </div>
            </div>
          </motion.div>

          {/* Friends List */}
          <div className="space-y-3">
            {friends.length === 0 ? (
              <div className="wellness-card p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">아직 친구가 없습니다</p>
                <p className="text-xs text-gray-400">친구를 추가해보세요!</p>
              </div>
            ) : (
              friends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="wellness-card p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="character-circle w-14 h-14 absolute"></div>
                      <div className="relative">
                        <Character 
                          healthScore={friend.healthScore} 
                          customization={friend.customization} 
                          size="small" 
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 font-bold mb-1">{friend.name}</h4>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-lime-50 rounded-full">
                          <Heart className="w-3 h-3 text-lime-600" />
                          <span className="text-xs text-lime-700">{friend.healthScore}</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full">
                          <Trophy className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600">{friend.points}P</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => openBattleModal(friend)}
                      className="p-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl shadow-md hover:shadow-lg transition-transform active:scale-95"
                    >
                      <Swords className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Friend Requests Tab */}
      {selectedTab === 'requests' && (
        <div className="px-6 space-y-4">
          <h3 className="text-gray-700 mb-4">받은 친구 요청</h3>
          {friendRequests.length === 0 ? (
            <div className="wellness-card p-8 text-center">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">새로운 친구 요청이 없습니다</p>
              <p className="text-xs text-gray-400">친구 요청이 오면 여기에 표시됩니다</p>
            </div>
          ) : (
            friendRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="wellness-card p-5"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="character-circle w-14 h-14 absolute"></div>
                    <div className="relative">
                      <Character 
                        healthScore={request.healthScore} 
                        customization={request.customization} 
                        size="small" 
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-800 font-bold mb-1">{request.name}</h4>
                    <p className="text-xs text-gray-500">건강 점수 {request.healthScore}점</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptFriendRequest(request)}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>수락</span>
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(request.id)}
                    className="flex-1 py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span>거절</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Battle Modal */}
      <AnimatePresence>
        {showBattleModal && selectedOpponent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
            onClick={battlePhase === 'select' || battlePhase === 'result' ? closeBattleModal : undefined}
          >
            <motion.div
              layout
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="wellness-card w-full max-w-sm overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Battle Background Effect */}
              {(battlePhase === 'intro' || battlePhase === 'clash') && (
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-blue-50 opacity-50 animate-pulse" />
              )}

              {/* Phase 1: Select Battle Type */}
              {battlePhase === 'select' && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">대결 종목 선택</h3>
                    <p className="text-sm text-gray-500">자신있는 종목을 선택하세요!</p>
                  </div>
                  
                  {/* VS Display Mini */}
                  <div className="flex justify-center items-center gap-4 mb-6">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-lime-100 rounded-full flex items-center justify-center mb-1">
                        <Character healthScore={currentUserStats.healthScore} customization={currentUserStats.customization} size="small" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">나</span>
                    </div>
                    <span className="text-lg font-black text-gray-300">VS</span>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-1">
                        <Character healthScore={selectedOpponent.healthScore} customization={selectedOpponent.customization} size="small" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{selectedOpponent.name}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {battleTypes.map((battle) => {
                      const userStat = userStats[battle.stat];
                      return (
                        <button
                          key={battle.id}
                          onClick={() => startBattle(selectedOpponent, battle.id)}
                          className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-lime-500 hover:bg-lime-50 transition-all group text-left"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl group-hover:scale-110 transition-transform">{battle.icon}</span>
                              <div>
                                <h4 className="font-bold text-gray-800">{battle.name}</h4>
                                <p className="text-xs text-gray-500">{battle.description}</p>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-lime-600">내 스탯: {userStat}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${battle.color}`} 
                              style={{ width: `${userStat}%` }} 
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Phase 2: Intro (VS Animation) */}
              {battlePhase === 'intro' && (
                <div className="p-8 py-16 flex flex-col items-center justify-center h-full min-h-[400px]">
                  <motion.div 
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="absolute left-4 top-12"
                  >
                    <div className="w-24 h-24 bg-blue-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                      <Character healthScore={currentUserStats.healthScore} customization={currentUserStats.customization} size="medium" />
                    </div>
                    <p className="text-center font-bold mt-2 bg-white/80 rounded-full px-3 py-1 shadow-sm">{currentUserStats.name}</p>
                  </motion.div>

                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1.5, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="z-10 text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-orange-500 drop-shadow-lg italic"
                  >
                    VS
                  </motion.div>

                  <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="absolute right-4 bottom-12"
                  >
                    <div className="w-24 h-24 bg-red-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                      <Character healthScore={selectedOpponent.healthScore} customization={selectedOpponent.customization} size="medium" />
                    </div>
                    <p className="text-center font-bold mt-2 bg-white/80 rounded-full px-3 py-1 shadow-sm">{selectedOpponent.name}</p>
                  </motion.div>
                </div>
              )}

              {/* Phase 3: Clash (Action Animation) */}
              {battlePhase === 'clash' && (
                <div className="p-8 py-16 flex flex-col items-center justify-center h-full min-h-[400px]">
                  <div className="flex justify-center items-center w-full gap-8">
                    {/* User */}
                    <motion.div
                      animate={{ 
                        x: [0, 50, 0],
                        rotate: [0, 15, 0]
                      }}
                      transition={{ duration: 0.5, repeat: 3, repeatType: "reverse" }}
                    >
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-200">
                        <Character healthScore={currentUserStats.healthScore} customization={currentUserStats.customization} size="medium" />
                      </div>
                    </motion.div>

                    {/* Impact Effect */}
                    <motion.div
                      className="absolute z-10 text-5xl"
                      animate={{ scale: [1, 2, 1], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.3, repeat: 4 }}
                    >
                      💥
                    </motion.div>

                    {/* Opponent */}
                    <motion.div
                      animate={{ 
                        x: [0, -50, 0],
                        rotate: [0, -15, 0]
                      }}
                      transition={{ duration: 0.5, repeat: 3, repeatType: "reverse" }}
                    >
                      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center border-4 border-red-200">
                        <Character healthScore={selectedOpponent.healthScore} customization={selectedOpponent.customization} size="medium" />
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center"
                  >
                    <p className="text-lg font-bold text-gray-700 animate-pulse">치열한 접전 중...</p>
                    <div className="mt-2 text-sm text-gray-500">
                      {battleTypes.find(b => b.id === battleResult?.battleType)?.description}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Phase 4: Result */}
              {battlePhase === 'result' && battleResult && (
                <div className="p-6 text-center relative overflow-hidden">
                  {battleResult.winner === 'user' && <Confetti />}
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mb-4"
                  >
                    {battleResult.winner === 'user' ? (
                      <div className="text-6xl mb-2">🏆</div>
                    ) : (
                      <div className="text-6xl mb-2">😢</div>
                    )}
                  </motion.div>

                  <h3 className={`text-3xl font-black mb-1 ${
                    battleResult.winner === 'user' 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500' 
                      : 'text-gray-500'
                  }`}>
                    {battleResult.winner === 'user' ? 'YOU WIN!' : 'DEFEAT...'}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-6">
                    {battleResult.winner === 'user' 
                      ? '축하합니다! 상대를 압도했습니다!' 
                      : '아쉽네요. 다음에 다시 도전해보세요!'}
                  </p>

                  <div className="bg-gray-50 rounded-2xl p-4 mb-6 grid grid-cols-3 gap-2 items-center">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">{currentUserStats.name}</p>
                      <p className={`text-xl font-bold ${battleResult.winner === 'user' ? 'text-blue-600' : 'text-gray-400'}`}>
                        {battleResult.userScore}
                      </p>
                    </div>
                    <div className="text-center text-xs text-gray-400 font-bold">SCORE</div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">{selectedOpponent.name}</p>
                      <p className={`text-xl font-bold ${battleResult.winner === 'opponent' ? 'text-red-600' : 'text-gray-400'}`}>
                        {battleResult.opponentScore}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={closeBattleModal}
                    className="w-full py-3.5 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl font-bold hover:shadow-lg transition-transform active:scale-95"
                  >
                    확인
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Friend Modal */}
      <AnimatePresence>
        {showAddFriend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6"
            onClick={() => setShowAddFriend(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="wellness-card p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl text-gray-800 mb-4 font-bold">친구 추가</h3>
              <input
                type="text"
                placeholder="친구 아이디를 입력하세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500 bg-gray-50"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddFriend(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  취소
                </button>
                <button
                  onClick={() => setShowAddFriend(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-shadow font-medium"
                >
                  요청 보내기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}