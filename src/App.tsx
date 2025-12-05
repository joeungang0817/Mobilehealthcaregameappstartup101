import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { HealthMissions } from "./components/HealthMissions";
import { Shop } from "./components/Shop";
import { Profile } from "./components/Profile";
import { Community } from "./components/Community";
import { CharacterChat } from "./components/CharacterChat"; // 새로 만들 컴포넌트
import { Navigation } from "./components/Navigation";
import { SplashScreen } from "./components/SplashScreen";
import { LoginScreen } from "./components/LoginScreen";

// ... (기존 Type 정의들은 그대로 유지) ...
export type HealthData = {
  sleep: number;
  diet: number;
  exercise: number;
  lastUpdated: Date;
};

export type CharacterCustomization = {
  skin: string;
  outfit: string;
  accessory: string;
  hairColor?: string;
  hairStyle?: string;
  faceFeatures?: {
    eyeColor?: string;
    skinTone?: string;
  };
};

export type Friend = {
  id: string;
  name: string;
  healthScore: number;
  customization: CharacterCustomization;
  lastActive: string;
  points: number;
};

export type UserProfile = {
  name: string;
  email: string;
  joinDate: string;
  bio: string;
  avatar: string;
};

export type Habit = {
  id: string;
  title: string;
  badge: string;
  goal: number;
  color: string;
};

export type UserData = {
  gold: number;
  healthData: HealthData;
  customization: CharacterCustomization;
  sleepLogs: Array<{
    date: string;
    start: string;
    end: string;
    hours: number;
    quality: string;
  }>;
  dietLogs: Array<{
    date: string;
    meal: string;
    calories: number;
    image?: string;
  }>;
  exerciseLogs: Array<{
    date: string;
    type: string;
    duration: number;
  }>;
  profile: UserProfile;
  friends: Friend[];
  completedHabits: Habit[];
  hasUsedFaceRecognition?: boolean;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 'chat' 페이지 추가
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "health" | "shop" | "community" | "profile" | "chat"
  >("dashboard");

  // 데이터 영구 저장을 위한 초기화 로직 (localStorage)
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('fitfriends_data');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      gold: 450,
      hasUsedFaceRecognition: false,
      healthData: {
        sleep: 7.5,
        diet: 1800,
        exercise: 30,
        lastUpdated: new Date(),
      },
      customization: {
        skin: "default",
        outfit: "casual",
        accessory: "none",
        hairColor: "#4A3428",
        hairStyle: "short",
        faceFeatures: {
          eyeColor: "#2C1810",
          skinTone: "#FFD4B3",
        },
      },
      sleepLogs: [],
      dietLogs: [],
      exerciseLogs: [],
      profile: {
        name: "Alex Kim",
        email: "alex.kim@university.edu",
        joinDate: "2025-10-15",
        bio: "University student trying to stay healthy! 💪",
        avatar: "😊",
      },
      friends: [
        {
          id: "1",
          name: "Sarah Lee",
          healthScore: 85,
          customization: { skin: "default", outfit: "sporty", accessory: "glasses", hairColor: "#FFB3D9", hairStyle: "long" },
          lastActive: "2 hours ago",
          points: 520,
        },
        {
          id: "2",
          name: "Mien",
          healthScore: 72,
          customization: { skin: "default", outfit: "casual", accessory: "hat", hairColor: "#2C1810", hairStyle: "short" },
          lastActive: "5 hours ago",
          points: 380,
        },
      ],
      completedHabits: [],
    };
  });

  // 데이터 변경 시 자동 저장
  useEffect(() => {
    localStorage.setItem('fitfriends_data', JSON.stringify(userData));
  }, [userData]);

  // ... (기존 update 함수들은 그대로 유지하되, 필요시 Context로 분리 가능) ...
  const addGold = (amount: number) => {
    setUserData((prev) => ({ ...prev, gold: prev.gold + amount }));
  };

  const spendGold = (amount: number) => {
    setUserData((prev) => ({ ...prev, gold: prev.gold - amount }));
  };

  const updateCustomization = (newCustomization: Partial<CharacterCustomization>) => {
    setUserData((prev) => ({
      ...prev,
      customization: { ...prev.customization, ...newCustomization },
    }));
  };
  
  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setUserData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...newProfile },
    }));
  };

  const addFriend = (friend: Friend) => {
    setUserData((prev) => ({ ...prev, friends: [...prev.friends, friend] }));
  };

  const removeFriend = (friendId: string) => {
    setUserData((prev) => ({ ...prev, friends: prev.friends.filter((f) => f.id !== friendId) }));
  };

  const handleFaceRecognitionComplete = () => {
    setUserData((prev) => ({ ...prev, hasUsedFaceRecognition: true }));
  };

  const handleLogin = (email: string, password: string) => {
    console.log("Login:", email, password);
    setIsLoggedIn(true);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />;
  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen wellness-gradient pb-20">
      <div className="max-w-md mx-auto min-h-screen bg-white/30 relative">
        {currentPage === "dashboard" && (
          <Dashboard
            userData={userData}
            completedHabits={userData.completedHabits}
            onFaceRecognitionComplete={handleFaceRecognitionComplete}
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}
        {currentPage === "health" && (
          <HealthMissions
            onCompleteMission={(category, reward) => addGold(reward)}
          />
        )}
        {currentPage === "shop" && (
          <Shop
            points={userData.gold}
            currentCustomization={userData.customization}
            onPurchase={(item, cost) => {
              spendGold(cost);
              updateCustomization(item);
            }}
          />
        )}
        {currentPage === "community" && (
          <Community
            friends={userData.friends}
            onAddFriend={addFriend}
            onRemoveFriend={removeFriend}
            currentUserStats={{
              name: userData.profile.name,
              healthScore: Math.round((userData.healthData.sleep/8*100 + userData.healthData.diet/2000*100 + userData.healthData.exercise/30*100)/3),
              customization: userData.customization,
              points: userData.gold,
            }}
          />
        )}
        {currentPage === "profile" && (
          <Profile
            profile={userData.profile}
            points={userData.gold}
            healthData={userData.healthData}
            customization={userData.customization}
            sleepLogs={userData.sleepLogs}
            dietLogs={userData.dietLogs}
            exerciseLogs={userData.exerciseLogs}
            onUpdateProfile={updateProfile}
          />
        )}
        {/* 캐릭터 챗 페이지 (전체 화면 덮기 위해 Navigation 숨김 처리 가능하지만 여기선 유지) */}
        {currentPage === "chat" && (
          <CharacterChat 
            userData={userData}
            onBack={() => setCurrentPage("dashboard")}
          />
        )}
      </div>

      {/* 채팅 페이지가 아닐 때만 하단 네비게이션 표시 */}
      {currentPage !== "chat" && (
        <Navigation
          currentPage={currentPage as any}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}