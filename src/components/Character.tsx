import { useState } from 'react';
import { Camera, User } from 'lucide-react';
import { motion } from 'motion/react';

type CharacterProps = {
  healthScore: number;
  customization: {
    skin?: string;
    outfit?: string;
    accessory?: string;
    hairColor?: string;
    hairStyle?: string;
    faceFeatures?: {
      eyeColor?: string;
      skinTone?: string;
    };
  };
  size?: 'small' | 'medium' | 'large';
  healthData?: {
    sleep?: number;
    exercise?: number;
    diet?: number;
  };
  onPhotoCapture?: (imageData: string) => void;
};

export function Character({ 
  healthScore, 
  customization, 
  size = 'medium',
  healthData = { sleep: 7, exercise: 30, diet: 1800 },
  onPhotoCapture
}: CharacterProps) {
  const [showCamera, setShowCamera] = useState(false);
  
  const dimensions = {
    small: { width: 100, height: 120 },
    medium: { width: 150, height: 180 },
    large: { width: 200, height: 240 }
  };

  const { width, height } = dimensions[size];

  const handleCameraClick = () => {
    setShowCamera(true);
    // 실제 앱에서는 카메라 API 사용
    setTimeout(() => {
      setShowCamera(false);
      if (onPhotoCapture) {
        onPhotoCapture('mock-image-data');
      }
    }, 2000);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Character Placeholder */}
      <div 
        style={{ width, height }}
        className="bg-gradient-to-br from-lime-100 to-green-100 rounded-3xl flex items-center justify-center border-4 border-lime-200 shadow-lg"
      >
        <User className="w-1/2 h-1/2 text-lime-300" strokeWidth={1.5} />
      </div>

      {/* Camera Button for Face Recognition (only on large) */}
      {size === 'large' && onPhotoCapture && (
        <motion.button
          onClick={handleCameraClick}
          className="mt-4 flex items-center gap-2 bg-gradient-to-r from-lime-500 to-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Camera className="w-4 h-4" />
          <span className="text-sm">얼굴 인식으로 핏프렌드 만들기</span>
        </motion.button>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
        >
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4">
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 bg-gradient-to-br from-lime-100 to-green-100 rounded-2xl flex items-center justify-center mb-4">
                <Camera className="w-24 h-24 text-lime-400 animate-pulse" />
              </div>
              <p className="text-gray-700 mb-2">얼굴을 인식하는 중...</p>
              <p className="text-sm text-gray-500">AI가 당신의 특징을 분석합니다</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
