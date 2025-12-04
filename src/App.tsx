import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { HealthMissions } from "./components/HealthMissions";
import { Shop } from "./components/Shop";
import { Profile } from "./components/Profile";
import { Community } from "./components/Community";
import { Navigation } from "./components/Navigation";
import { SplashScreen } from "./components/SplashScreen";
import { LoginScreen } from "./components/LoginScreen";

export type HealthData = {
  sleep: number; // hours
  diet: number; // calories
  exercise: number; // minutes
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
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "health" | "shop" | "community"
  >("dashboard");

  const [userData, setUserData] = useState<UserData>({
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
    sleepLogs: [
      {
        date: "2025-12-01",
        start: "23:00",
        end: "07:30",
        hours: 8.5,
        quality: "excellent",
      },
      {
        date: "2025-11-30",
        start: "00:30",
        end: "07:00",
        hours: 6.5,
        quality: "fair",
      },
      {
        date: "2025-11-29",
        start: "23:30",
        end: "08:00",
        hours: 8.5,
        quality: "excellent",
      },
    ],
    dietLogs: [
      { date: "2025-12-01", meal: "Breakfast", calories: 450 },
      { date: "2025-12-01", meal: "Lunch", calories: 650 },
      { date: "2025-11-30", meal: "Dinner", calories: 700 },
    ],
    exerciseLogs: [
      { date: "2025-12-01", type: "Running", duration: 30 },
      { date: "2025-11-30", type: "Yoga", duration: 20 },
      { date: "2025-11-29", type: "Cycling", duration: 45 },
    ],
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
        customization: {
          skin: "default",
          outfit: "sporty",
          accessory: "glasses",
          hairColor: "#FFB3D9",
          hairStyle: "long",
        },
        lastActive: "2 hours ago",
        points: 520,
      },
      {
        id: "2",
        name: "Mien",
        healthScore: 72,
        customization: {
          skin: "default",
          outfit: "casual",
          accessory: "hat",
          hairColor: "#2C1810",
          hairStyle: "short",
        },
        lastActive: "5 hours ago",
        points: 380,
      },
      {
        id: "3",
        name: "Emma Park",
        healthScore: 91,
        customization: {
          skin: "default",
          outfit: "elegant",
          accessory: "crown",
          hairColor: "#89CFF0",
          hairStyle: "ponytail",
        },
        lastActive: "1 day ago",
        points: 650,
      },
    ],
    completedHabits: [
      {
        id: "habit-4",
        title: "건강한 식단",
        badge: "🌱",
        goal: 14,
        color: "from-green-400 to-emerald-400",
      },
    ],
  });

  const updateHealthData = (newData: Partial<HealthData>) => {
    setUserData((prev) => ({
      ...prev,
      healthData: {
        ...prev.healthData,
        ...newData,
        lastUpdated: new Date(),
      },
    }));
  };

  const addGold = (amount: number) => {
    setUserData((prev) => ({
      ...prev,
      gold: prev.gold + amount,
    }));
  };

  const spendGold = (amount: number) => {
    setUserData((prev) => ({
      ...prev,
      gold: prev.gold - amount,
    }));
  };

  const updateCustomization = (
    newCustomization: Partial<CharacterCustomization>,
  ) => {
    setUserData((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        ...newCustomization,
      },
    }));
  };

  const addSleepLog = (log: {
    date: string;
    start: string;
    end: string;
    hours: number;
    quality: string;
  }) => {
    setUserData((prev) => ({
      ...prev,
      sleepLogs: [log, ...prev.sleepLogs],
    }));
    updateHealthData({ sleep: log.hours });
    addGold(20);
  };

  const addDietLog = (log: {
    date: string;
    meal: string;
    calories: number;
    image?: string;
  }) => {
    setUserData((prev) => ({
      ...prev,
      dietLogs: [log, ...prev.dietLogs],
    }));
    addGold(15);
  };

  const addExerciseLog = (log: {
    date: string;
    type: string;
    duration: number;
  }) => {
    setUserData((prev) => ({
      ...prev,
      exerciseLogs: [log, ...prev.exerciseLogs],
    }));
    updateHealthData({ exercise: log.duration });
    addGold(25);
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setUserData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...newProfile },
    }));
  };

  const addFriend = (friend: Friend) => {
    setUserData((prev) => ({
      ...prev,
      friends: [...prev.friends, friend],
    }));
  };

  const removeFriend = (friendId: string) => {
    setUserData((prev) => ({
      ...prev,
      friends: prev.friends.filter((f) => f.id !== friendId),
    }));
  };

  const handleFaceRecognitionComplete = () => {
    setUserData((prev) => ({
      ...prev,
      hasUsedFaceRecognition: true,
    }));
  };

  const handleLogin = (email: string, password: string) => {
    // In a real app, authenticate with backend here
    console.log("Login:", email, password);
    setIsLoggedIn(true);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Show main app
  return (
    <div className="min-h-screen wellness-gradient pb-20">
      <div className="max-w-md mx-auto">
        {currentPage === "dashboard" && (
          <Dashboard
            userData={userData}
            completedHabits={userData.completedHabits}
            onFaceRecognitionComplete={
              handleFaceRecognitionComplete
            }
          />
        )}
        {currentPage === "health" && (
          <HealthMissions
            onCompleteMission={(category, reward) => {
              addGold(reward);
            }}
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
              healthScore: Math.round(
                (Math.min(
                  (userData.healthData.sleep / 8) * 100,
                  100,
                ) +
                  Math.min(
                    (userData.healthData.diet / 2000) * 100,
                    100,
                  ) +
                  Math.min(
                    (userData.healthData.exercise / 30) * 100,
                    100,
                  )) /
                  3,
              ),
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
      </div>

      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}