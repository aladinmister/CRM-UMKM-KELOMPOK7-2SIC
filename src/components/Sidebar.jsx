import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Box,
  BarChart2,
  Settings,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboardAdmin' },
  { name: 'Produk', icon: <Box size={18} />, path: '/produk/tambah' },
  { name: 'Penjualan', icon: <BarChart2 size={18} />, path: '/pembeliannew' },
  { name: 'Laporan', icon: <BarChart2 size={18} />, path: '/laporan' },
  { name: 'Karyawan', icon: <BarChart2 size={18} />, path: '/datakaryawan' },

];

const accountItems = [
  { name: 'Pengaturan Akun', icon: <Settings size={18} />, path: '/akun' },
  { name: 'Sign In', icon: <LogIn size={18} />, path: '/signin' },
  { name: 'Sign Up', icon: <UserPlus size={18} />, path: '/signup' },
];

export const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-screen w-72 bg-white text-red-700 shadow-2xl z-20 border-r border-red-200 overflow-hidden"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Motor Jalan dari kanan ke kiri */}
      <motion.img
        src="https://media.istockphoto.com/id/906608494/id/vektor/ikon-warna-sepeda-motor.jpg?s=612x612&w=is&k=20&c=ApnnilwMgrERihidzIsqTknouGfzjvIksO0ejsmQL3A="
        alt="Motor Icon"
        className="absolute top-2 w-12 h-12 z-30"
        animate={{ x: ['120%', '-100%'], opacity: [1, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'linear',
          times: [0, 0.8, 1],
        }}
      />

      {/* Efek ban motor */}
      <motion.div
        className="absolute top-6 right-[-30px] w-20 h-20 rounded-full border-4 border-dashed border-red-600 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
      />

      {/* Judul */}
      <div className="text-2xl font-bold text-center mt-10 mb-10 tracking-wide">
        🏍️ AHM Bengkel
      </div>

      {/* Menu utama */}
      <div className="px-4">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <div
              key={item.name}
              className="relative mb-2"
              style={{
                clipPath: active
                  ? 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)'
                  : 'none',
              }}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3 transition-all duration-300 rounded-r-full font-medium ${
                  active
                    ? 'bg-red-600 text-white shadow-md'
                    : 'hover:bg-red-50 hover:text-red-700 text-red-800'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Label akun */}
      <div className="px-5 mt-10 text-xs font-semibold text-red-400 uppercase tracking-wider">
        Akun
      </div>

      {/* Menu akun */}
      <div className="px-4 mt-3">
        {accountItems.map((item) => {
          const active = isActive(item.path);
          return (
            <div
              key={item.name}
              className="relative mb-2"
              style={{
                clipPath: active
                  ? 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)'
                  : 'none',
              }}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3 transition-all duration-300 rounded-r-full font-medium ${
                  active
                    ? 'bg-red-600 text-white shadow-md'
                    : 'hover:bg-red-50 hover:text-red-700 text-red-800'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Strip bawah */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-pulse" />
    </motion.aside>
  );
};

export default Sidebar;
