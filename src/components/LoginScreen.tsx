import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import logoGreen from 'figma:asset/6c134fa0a0d080b685790b9926bedcd569863d36.png';

type LoginScreenProps = {
  onLogin: (email: string, password: string) => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 bg-lime-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-green-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-white/95">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center mb-8"
          >
            <img
              src={logoGreen}
              alt="FitFriends Logo"
              className="w-48 h-auto mb-2"
            />
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl text-gray-800 mb-2">
              {isSignUp ? '환영합니다! 👋' : '다시 만나서 반가워요! 💚'}
            </h2>
            <p className="text-sm text-gray-600">
              {isSignUp ? '건강한 여정을 시작해볼까요?' : '오늘도 건강한 하루를 만들어가요'}
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Name Input (Sign Up only) */}
            {isSignUp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative"
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                />
              </motion.div>
            )}

            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                style={{ fontFamily: 'Nunito, sans-serif' }}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                style={{ fontFamily: 'Nunito, sans-serif' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password */}
            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-lime-600 hover:text-lime-700 transition-colors"
                  style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}
            >
              <span>{isSignUp ? '시작하기' : '로그인'}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400" style={{ fontFamily: 'Nunito, sans-serif' }}>또는</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full py-3 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
              style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-gray-700">Google로 계속하기</span>
            </button>

            <button
              type="button"
              className="w-full py-3 bg-[#FEE500] border-2 border-[#FEE500] rounded-2xl hover:bg-[#FDD835] transition-all flex items-center justify-center gap-3"
              style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3Z" fill="#3C1E1E"/>
                <path d="M10.5 16.5L7.5 12L9 10.5L10.5 12L15 7.5L16.5 9L10.5 16.5Z" fill="#FEE500"/>
              </svg>
              <span className="text-gray-800">카카오로 계속하기</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-600"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {isSignUp ? '이미 계정이 있으신가요? ' : '아직 계정이 없으신가요? '}
              <span className="text-lime-600 hover:text-lime-700 transition-colors" style={{ fontWeight: 700 }}>
                {isSignUp ? '로그인' : '회원가입'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-6 text-sm text-gray-500"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          건강한 습관으로 더 나은 내일을 만들어가세요 🌱
        </motion.p>
      </motion.div>
    </div>
  );
}
