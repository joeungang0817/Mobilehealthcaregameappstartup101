import { useState } from 'react';
import { Users, Trophy, Zap, Heart, Apple, Swords, UserPlus, Mail, X, Check, Star } from 'lucide-react';
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

export function Community({ friends, onAddFriend, onRemoveFriend, currentUserStats }: CommunityProps) {
  const [selectedTab, setSelectedTab] = useState<'friends' | 'battle' | 'requests'>('friends');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(dummyRequests);
  const [showAddFriend, setShowAddFriend] = useState(false);
  
  // Battle modal states
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState<Friend | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [isBattling, setIsBattling] = useState(false);

  const userStats = calculateStats(currentUserStats.healthScore, currentUserStats.points);

  const startBattle = (opponent: Friend, battleType: BattleType) => {
    setIsBattling(true);
    
    const opponentStats = calculateStats(opponent.healthScore, opponent.points);
    const result = simulateBattle(userStats, opponentStats, battleType);
    result.opponentName = opponent.name;

    setTimeout(() => {
      setBattleResult(result);
      setIsBattling(false);
    }, 2000);
  };

  const closeBattleModal = () => {
    setShowBattleModal(false);
    setSelectedOpponent(null);
    setBattleResult(null);
    setIsBattling(false);
  };

  const openBattleModal = (friend: Friend) => {
    setSelectedOpponent(friend);
    setShowBattleModal(true);
    setBattleResult(null);
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">힘 (운동)</span>
                </div>
                <div className="flex items-center gap-2 flex-1 mx-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full"
                      style={{ width: `${userStats.power}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-700 w-8 text-right">{userStats.power}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Apple className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">지구력 (식단)</span>
                </div>
                <div className="flex items-center gap-2 flex-1 mx-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full"
                      style={{ width: `${userStats.stamina}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-700 w-8 text-right">{userStats.stamina}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">크리티컬 (수면)</span>
                </div>
                <div className="flex items-center gap-2 flex-1 mx-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                      style={{ width: `${userStats.critical}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-700 w-8 text-right">{userStats.critical}</span>
                </div>
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
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="character-circle w-16 h-16 absolute"></div>
                      <div className="relative">
                        <Character 
                          healthScore={friend.healthScore} 
                          customization={friend.customization} 
                          size="small" 
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 mb-1">{friend.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-lime-50 rounded-full">
                          <Heart className="w-3 h-3 text-lime-600" />
                          <span className="text-xs text-lime-700">{friend.healthScore}</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full">
                          <Trophy className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600">{friend.points}P</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{friend.lastActive}</p>
                    </div>
                    <button
                      onClick={() => openBattleModal(friend)}
                      className="px-4 py-2 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-lg text-sm hover:shadow-lg transition-shadow"
                    >
                      대결
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
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="character-circle w-16 h-16 absolute"></div>
                    <div className="relative">
                      <Character 
                        healthScore={request.healthScore} 
                        customization={request.customization} 
                        size="small" 
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-800 mb-1">{request.name}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-lime-50 rounded-full">
                        <Heart className="w-3 h-3 text-lime-600" />
                        <span className="text-xs text-lime-700">{request.healthScore}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600">{request.points}P</span>
                      </div>
                    </div>
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
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
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
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6"
            onClick={closeBattleModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="wellness-card p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {!battleResult && !isBattling && (
                <>
                  <h3 className="text-xl text-gray-800 mb-6 text-center">대결 종목 선택</h3>
                  
                  {/* VS Display */}
                  <div className="flex items-center justify-around mb-6 bg-gradient-to-r from-lime-50 to-green-50 rounded-2xl p-4">
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                        <div className="character-circle w-16 h-16 absolute"></div>
                        <div className="relative">
                          <Character 
                            healthScore={currentUserStats.healthScore} 
                            customization={currentUserStats.customization} 
                            size="small" 
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{currentUserStats.name}</p>
                    </div>
                    <div className="text-3xl">⚔️</div>
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                        <div className="character-circle w-16 h-16 absolute"></div>
                        <div className="relative">
                          <Character 
                            healthScore={selectedOpponent.healthScore} 
                            customization={selectedOpponent.customization} 
                            size="small" 
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{selectedOpponent.name}</p>
                    </div>
                  </div>

                  {/* Battle Type Selection */}
                  <div className="space-y-3">
                    {battleTypes.map((battle) => {
                      const opponentStats = calculateStats(selectedOpponent.healthScore, selectedOpponent.points);
                      const userStat = userStats[battle.stat];
                      const opponentStat = opponentStats[battle.stat];
                      
                      return (
                        <button
                          key={battle.id}
                          onClick={() => startBattle(selectedOpponent, battle.id)}
                          className="w-full wellness-card p-4 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{battle.icon}</span>
                            <div className="flex-1 text-left">
                              <h4 className="text-gray-800">{battle.name}</h4>
                              <p className="text-xs text-gray-500">{battle.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">{userStat}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`bg-gradient-to-r ${battle.color} h-2 rounded-full`}
                                style={{ width: `${(userStat / (userStat + opponentStat)) * 100}%` }}
                              />
                            </div>
                            <span className="text-gray-400">VS</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-gray-400 to-gray-500 h-2 rounded-full"
                                style={{ width: `${(opponentStat / (userStat + opponentStat)) * 100}%` }}
                              />
                            </div>
                            <span className="text-gray-600">{opponentStat}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {isBattling && (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-6xl mb-4"
                  >
                    ⚔️
                  </motion.div>
                  <p className="text-gray-700 mb-4">대결 중...</p>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 h-2 bg-lime-200 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {battleResult && !isBattling && (
                <div className="text-center">
                  {battleResult.winner === 'user' ? (
                    <>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="text-7xl mb-4"
                      >
                        🏆
                      </motion.div>
                      <h3 className="text-3xl text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text mb-2">
                        승리!
                      </h3>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-6xl mb-4"
                      >
                        💪
                      </motion.div>
                      <h3 className="text-2xl text-gray-800 mb-2">패배...</h3>
                    </>
                  )}
                  
                  <p className="text-gray-600 mb-6">
                    {battleTypes.find(b => b.id === battleResult.battleType)?.name}
                  </p>

                  <div className="bg-gradient-to-r from-lime-50 to-green-50 rounded-2xl p-5 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <p className="text-sm text-gray-600 mb-1">{currentUserStats.name}</p>
                        <p className={`text-2xl ${battleResult.winner === 'user' ? 'text-lime-600' : 'text-gray-500'}`}>
                          {battleResult.userScore}
                        </p>
                      </div>
                      <div className="text-2xl text-gray-400 mx-4">VS</div>
                      <div className="text-center flex-1">
                        <p className="text-sm text-gray-600 mb-1">{battleResult.opponentName}</p>
                        <p className={`text-2xl ${battleResult.winner === 'opponent' ? 'text-lime-600' : 'text-gray-500'}`}>
                          {battleResult.opponentScore}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={closeBattleModal}
                    className="w-full py-3 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-shadow"
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
              <h3 className="text-xl text-gray-800 mb-4">친구 추가</h3>
              <input
                type="text"
                placeholder="친구 아이디를 입력하세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddFriend(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setShowAddFriend(false);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-shadow"
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
