import { useEffect, useState } from 'react';
import { Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setIsLoggedIn(true);
      setRole(role);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 bg-gradient-to-r from-red-600 to-red-800 shadow-lg text-white"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
      }}
    >
      <div className="flex justify-between items-center px-6 py-4">
        {/* Title kiri */}
        <div className="text-sm tracking-wide">
          Pages / <span className="font-bold text-white">Dashboard</span>
        </div>

        {/* Kanan - Search dan Auth */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari..."
              className="px-4 py-2 pl-10 text-sm rounded-full focus:outline-none text-black"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          </div>

          {/* Auth */}
          {isLoggedIn ? (
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm cursor-pointer hover:text-yellow-300"
            >
              <LogOut className="w-4 h-4" />
              Logout ({role})
            </div>
          ) : (
            <div
              onClick={handleLoginClick}
              className="flex items-center gap-2 text-sm cursor-pointer hover:text-yellow-300"
            >
              <User className="w-4 h-4" />
              Sign In
            </div>
          )}
        </div>
      </div>

      {/* Strip bawah mirip body motor */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-red-600 animate-pulse" />
    </motion.header>
  );
};

export default Header;
