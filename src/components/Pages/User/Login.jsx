import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

// Komponen ikon melayang
const FloatingIcon = ({ icon, style, animation }) => (
  <motion.div
    className="absolute text-gray-300 text-4xl opacity-20 drop-shadow pointer-events-none select-none"
    style={style}
    animate={animation}
    transition={{
      repeat: Infinity,
      repeatType: "mirror",
      duration: 12 + Math.random() * 4,
      ease: "easeInOut",
    }}
  >
    {icon}
  </motion.div>
);

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/Servischart');
      } else {
        navigate('/');
      }
    } catch (error) {
      alert('Email atau password salah');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://ahm.inspirasienergiprimanusa.com/api/login/google';
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-red-50 px-4 overflow-hidden">
      {/* Floating icons ala bengkel */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingIcon icon="🔧" style={{ top: "10%", left: "20%" }} animation={{ y: [0, -60, 0], x: [0, 20, 0] }} />
        <FloatingIcon icon="🛞" style={{ top: "25%", left: "75%" }} animation={{ y: [0, 40, 0], x: [0, -30, 0] }} />
        <FloatingIcon icon="🔩" style={{ top: "55%", left: "30%" }} animation={{ y: [0, -50, 0], x: [0, 25, 0] }} />
        <FloatingIcon icon="🪛" style={{ top: "75%", left: "60%" }} animation={{ y: [0, -70, 0], x: [0, 30, 0] }} />
        <FloatingIcon icon="🔧" style={{ top: "20%", left: "85%" }} animation={{ y: [0, 50, 0], x: [0, -25, 0] }} />
        <FloatingIcon icon="🛞" style={{ top: "40%", left: "10%" }} animation={{ y: [0, 60, 0], x: [0, 20, 0] }} />
        <FloatingIcon icon="🔩" style={{ top: "70%", left: "45%" }} animation={{ y: [0, 80, 0], x: [0, -20, 0] }} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-red-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-red-700">
          🔧 AHM Bengkel Login
        </h2>

        <div className="relative mb-4">
          <span className="absolute left-3 top-2.5 text-xl">📧</span>
          <input
            type="email"
            placeholder="Email"
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative mb-6">
          <span className="absolute left-3 top-2.5 text-xl">🔒</span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="pl-10 pr-10 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-xl"
            tabIndex={-1}
          >
            {showPassword ? '🛠️' : '🔧'}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? 'Memproses...' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center gap-3 bg-white text-red-700 border border-red-300 py-2 rounded-lg hover:bg-red-50 transition"
        >
          <img
            src="https://e7.pngegg.com/pngimages/882/225/png-clipart-google-logo-google-logo-google-search-icon-google-text-logo-thumbnail.png"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Login dengan Google</span>
        </button>
      </form>
    </div>
  );
};

export default Login;
