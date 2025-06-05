import React, { useState } from 'react';

const HeaderUser = ({ totalItem }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="shadow-md">
      {/* Top Bar */}
      <div className="bg-red-700 text-white text-sm py-2 px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>📞 021-555-333</span>
          <span>✉️ bengkel@ahm.co.id</span>
        </div>
        <div className="hidden sm:block">
          <span>Pelayanan Cepat & Garansi Resmi</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white text-red-700 px-4 py-3 flex justify-between items-center relative border-b border-red-700">
        <a href="/" className="text-2xl font-bold tracking-wide text-red-700">Bengkel AHM</a>

        {/* Hamburger Menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-2xl text-red-700 focus:outline-none"
        >
          ☰
        </button>

        {/* Menu Items */}
        <ul
          className={`absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent transition-all duration-300 ease-in-out lg:flex lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 p-4 lg:p-0 z-10 ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <li><a href="/" className="hover:text-red-500">Home</a></li>
          <li><a href="/booking" className="hover:text-red-500">Booking</a></li>
          <li><a href="/toko" className="hover:text-red-500">Toko</a></li>
          <li><a href="/contact" className="hover:text-red-500">Kontak</a></li>
          <li>
            <a href="/cart" className="hover:text-red-500 relative">
              🛒
              {totalItem > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1">
                  {totalItem}
                </span>
              )}
            </a>
          </li>
          <li>
            <a
              href="/login"
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Login
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderUser;
