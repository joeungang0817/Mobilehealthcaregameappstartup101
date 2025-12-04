import { useState } from 'react';
import { Character } from './Character';
import { UserProfile, HealthData, CharacterCustomization } from '../App';
import { Edit2, Calendar, Mail, Coins, Award, Trophy, Target } from 'lucide-react';
import { motion } from 'motion/react';

type ProfileProps = {
  profile: UserProfile;
  points: number;
  healthData: HealthData;
  customization: CharacterCustomization;
  sleepLogs: Array<{ date: string; start: string; end: string; hours: number; quality: string }>;
  dietLogs: Array<{ date: string; meal: string; calories: number; image?: string }>;
  exerciseLogs: Array<{ date: string; type: string; duration: number }>;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
};

export function Profile({
  profile,
  points,
  healthData,
  customization,
  sleepLogs,
  dietLogs,
  exerciseLogs,
  onUpdateProfile
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);

  const handleSave = () => {
    onUpdateProfile({
      name: editName,
      bio: editBio,
      avatar: editAvatar
    });
    setIsEditing(false);
  };

  const calculateHealthScore = () => {
    const sleepScore = Math.min((healthData.sleep / 8) * 100, 100);
    const dietScore = Math.min((healthData.diet / 2000) * 100, 100);
    const exerciseScore = Math.min((healthData.exercise / 30) * 100, 100);
    
    return Math.round((sleepScore + dietScore + exerciseScore) / 3);
  };

  const healthScore = calculateHealthScore();

  const totalActivities = sleepLogs.length + dietLogs.length + exerciseLogs.length;
  const daysActive = new Date().getTime() - new Date(profile.joinDate).getTime();
  const daysSinceJoin = Math.floor(daysActive / (1000 * 60 * 60 * 24));

  const achievements = [
    {
      id: 'first-log',
      icon: '🎯',
      name: 'First Step',
      description: 'Logged your first activity',
      unlocked: totalActivities > 0
    },
    {
      id: 'week-streak',
      icon: '🔥',
      name: 'Week Warrior',
      description: 'Logged activities for 7 days',
      unlocked: totalActivities >= 21
    },
    {
      id: 'health-hero',
      icon: '⭐',
      name: 'Health Hero',
      description: 'Maintained 80+ health score',
      unlocked: healthScore >= 80
    },
    {
      id: 'point-master',
      icon: '💎',
      name: 'Point Master',
      description: 'Earned 500+ points',
      unlocked: points >= 500
    },
    {
      id: 'early-bird',
      icon: '🌅',
      name: 'Early Bird',
      description: 'Consistently sleep before midnight',
      unlocked: sleepLogs.filter(log => parseInt(log.start.split(':')[0]) < 24).length >= 3
    },
    {
      id: 'fitness-fan',
      icon: '💪',
      name: 'Fitness Fan',
      description: 'Completed 10+ exercises',
      unlocked: exerciseLogs.length >= 10
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const avatarEmojis = ['😊', '😎', '🥰', '🤗', '😄', '🌟', '💫', '✨', '🎯', '🏆'];

  return (
    <div className="p-6 pb-24 wellness-gradient min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gray-800 text-2xl mb-1">내 프로필</h1>
          <p className="text-sm text-gray-500">건강 여정</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-lime-600 text-white p-2 rounded-full shadow-lg hover:bg-lime-700 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="wellness-card p-6 mb-6 soft-shadow"
      >
        <div className="flex items-start gap-4 mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editAvatar}
              onChange={(e) => setEditAvatar(e.target.value)}
              className="w-16 h-16 text-center text-3xl bg-gray-50 border border-gray-200 rounded-2xl"
              maxLength={2}
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-lime-100 to-green-100 rounded-2xl flex items-center justify-center text-3xl">
              {profile.avatar}
            </div>
          )}
          
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full mb-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50"
              />
            ) : (
              <h2 className="text-gray-800 mb-1">{profile.name}</h2>
            )}
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl resize-none bg-gray-50"
              rows={3}
              placeholder="Tell us about yourself..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-md hover:shadow-lg transition-all"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(profile.name);
                  setEditBio(profile.bio);
                  setEditAvatar(profile.avatar);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-sm">{profile.bio}</p>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="wellness-card p-4 text-center soft-shadow"
        >
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl text-gray-800 mb-1">{healthScore}</p>
          <p className="text-xs text-gray-500">Health Score</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="wellness-card p-4 text-center soft-shadow"
        >
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
            <Coins className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-2xl text-gray-800 mb-1">{points}</p>
          <p className="text-xs text-gray-500">Gold</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="wellness-card p-4 text-center soft-shadow"
        >
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl text-gray-800 mb-1">{totalActivities}</p>
          <p className="text-xs text-gray-500">Activities</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="wellness-card p-4 text-center soft-shadow"
        >
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-lime-100 to-green-100 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-lime-600" />
          </div>
          <p className="text-2xl text-gray-800 mb-1">{daysSinceJoin}</p>
          <p className="text-xs text-gray-500">Days Active</p>
        </motion.div>
      </div>

      {/* Character Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="wellness-card p-8 mb-6 soft-shadow bg-gradient-to-br from-lime-50 to-green-50"
      >
        <h3 className="text-gray-800 mb-4 text-center">Your Buddy</h3>
        <div className="flex justify-center">
          <Character
            healthScore={healthScore}
            customization={customization}
            size="large"
          />
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h3 className="text-gray-800 mb-4">Achievements</h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className={`wellness-card p-4 text-center soft-shadow ${
                achievement.unlocked ? 'bg-gradient-to-br from-lime-50 to-green-50' : 'opacity-50 grayscale'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className="text-sm text-gray-800 mb-1">{achievement.name}</p>
              <p className="text-xs text-gray-500">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="wellness-card p-6 soft-shadow"
      >
        <h3 className="text-gray-800 mb-4">Activity Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center">
                <span className="text-lg">🌙</span>
              </div>
              <span className="text-gray-700">Sleep Logs</span>
            </div>
            <span className="text-gray-800">{sleepLogs.length}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <span className="text-lg">🍽️</span>
              </div>
              <span className="text-gray-700">Meal Logs</span>
            </div>
            <span className="text-gray-800">{dietLogs.length}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <span className="text-lg">💪</span>
              </div>
              <span className="text-gray-700">Exercise Logs</span>
            </div>
            <span className="text-gray-800">{exerciseLogs.length}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}