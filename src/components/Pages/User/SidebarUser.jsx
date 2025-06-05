import React from 'react';

const SidebarUser = () => {
  return (
    <aside className="w-full lg:w-64 bg-white shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Menu Pengguna</h2>
      <ul className="space-y-2">
        <li><a href="/profile" className="block hover:text-blue-500">Profil Saya</a></li>
        <li><a href="/booking-history" className="block hover:text-blue-500">Riwayat Booking</a></li>
        <li><a href="/services" className="block hover:text-blue-500">Layanan</a></li>
        <li><a href="/logout" className="block text-red-500">Logout</a></li>
      </ul>
    </aside>
  );
};

export default SidebarUser;
