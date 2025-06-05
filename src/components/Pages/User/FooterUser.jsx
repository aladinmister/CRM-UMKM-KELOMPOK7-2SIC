import React from 'react';

const FooterUser = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Lokasi Bengkel</h3>
          <p>Jl. Raya Motor No.123, Jakarta Selatan, Indonesia</p>
          <p>Telp: (021) 1234 5678</p>
          <p>Email: info@bengkelahm.co.id</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Jam Operasional</h3>
          <p>Senin - Jumat: 08.00 - 17.00</p>
          <p>Sabtu: 08.00 - 14.00</p>
          <p>Minggu: Libur</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Sosial Media</h3>
          <div className="flex space-x-4 text-2xl">
            <a href="#" aria-label="Facebook" className="hover:text-blue-500">📘</a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500">📸</a>
            <a href="#" aria-label="Twitter" className="hover:text-sky-400">🐦</a>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center text-sm text-gray-500">&copy; 2025 Bengkel AHM. All rights reserved.</div>
    </footer>
  );
};

export default FooterUser;
