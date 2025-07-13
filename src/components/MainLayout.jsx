import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { motion } from "framer-motion";

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

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden relative bg-white">
      {/* Sidebar */}
      <div className="hidden md:block w-72 flex-shrink-0 z-30">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex flex-col flex-1 relative bg-white">
        {/* Header */}
        <div className="z-30 shadow-md sticky top-0 bg-white">
          <Header />
        </div>

        {/* Konten Utama */}
        <main className="flex-1 overflow-y-auto z-10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-gray-800">
            <Outlet />
          </div>
        </main>

        {/* Floating Icons - di atas konten tapi tidak menghalangi interaksi */}
        <div className="absolute inset-0 z-40 pointer-events-none">
          <FloatingIcon icon="🔧" style={{ top: "10%", left: "20%" }} animation={{ y: [0, -60, 0], x: [0, 20, 0] }} />
          <FloatingIcon icon="🛞" style={{ top: "25%", left: "75%" }} animation={{ y: [0, 40, 0], x: [0, -30, 0] }} />
          <FloatingIcon icon="🔩" style={{ top: "55%", left: "30%" }} animation={{ y: [0, -50, 0], x: [0, 25, 0] }} />
          <FloatingIcon icon="🪛" style={{ top: "75%", left: "60%" }} animation={{ y: [0, -70, 0], x: [0, 30, 0] }} />
          <FloatingIcon icon="🔧" style={{ top: "20%", left: "85%" }} animation={{ y: [0, 50, 0], x: [0, -25, 0] }} />
          <FloatingIcon icon="🛞" style={{ top: "40%", left: "10%" }} animation={{ y: [0, 60, 0], x: [0, 20, 0] }} />
          <FloatingIcon icon="🔩" style={{ top: "70%", left: "45%" }} animation={{ y: [0, 80, 0], x: [0, -20, 0] }} />
        </div>
      </div>
    </div>
  );
}
