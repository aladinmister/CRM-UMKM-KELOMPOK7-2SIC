import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const DashboardUser = () => {
  const banners = [
    "https://recruitment.astra-honda.com/image-testimony/26_slider84.jpg",
    "https://www.otoinfo.id/wp-content/uploads/2022/09/AHM-Gedung-Karawang-Lokerteen.Info_.jpg",
    "https://recruitment.astra-honda.com/image-testimony/31_slider84.jpg",
  ];

  const categories = [
    { name: 'Booking Servis', icon: '🛠️', link: '/booking' },
    { name: 'Riwayat', icon: '📄', link: '/history' },
    { name: 'Promo', icon: '🎁', link: '/promo' },
    { name: 'Produk', icon: '🛍️', link: '/produk' },
    { name: 'Galeri', icon: '🖼️', link: '/galeri' },
    { name: 'Kontak', icon: '📞', link: '/kontak' },
  ];

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [bookingList, setBookingList] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [error, setError] = useState(null);
  const bannerIntervalRef = useRef(null);

  const startBannerAutoScroll = () => {
    if (bannerIntervalRef.current) clearInterval(bannerIntervalRef.current);
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
  };

  useEffect(() => {
    startBannerAutoScroll();
    return () => clearInterval(bannerIntervalRef.current);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('https://ahm.inspirasienergiprimanusa.com/api/dashboard-user');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) {
          setBookingList(data.data.bookings || []);
          setLatestProducts(data.data.produk || []);
          setStaffs(data.data.staffs || []);
        } else {
          throw new Error('Gagal mengambil data dashboard');
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      }
    };
    fetchDashboardData();
  }, []);

  const filteredProducts = latestProducts
    .filter(p => filter === 'All' || p.kategori === filter)
    .filter(p =>
      p.nama_produk?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      p.kategori?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-black font-sans">
      {/* Banner */}
      <motion.section className="relative w-full h-[60vh] overflow-hidden flex items-center justify-center bg-gray-900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <img src={banners[currentBanner]} alt={`banner-${currentBanner}`} className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 z-0" />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6 text-center text-white drop-shadow-lg z-20">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-2">Selamat Datang di Bengkel AHM</h1>
          <p className="text-lg md:text-2xl font-light">Servis Motor Profesional & Produk Berkualitas</p>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {banners.map((_, idx) => (
            <button key={idx} onClick={() => { setCurrentBanner(idx); startBannerAutoScroll(); }}
              className={`w-3 h-3 rounded-full ${currentBanner === idx ? 'bg-white' : 'bg-gray-400'}`} />
          ))}
        </div>
      </motion.section>

      {/* Kategori */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map((cat, idx) => (
          <motion.a key={idx} href={cat.link} whileHover={{ scale: 1.1 }} className="flex flex-col items-center text-gray-700 hover:text-green-600">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center text-3xl shadow-md mb-2">
              {cat.icon}
            </div>
            <span className="text-sm font-medium text-center">{cat.name}</span>
          </motion.a>
        ))}
      </section>

      {/* Booking Table */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700">Riwayat Booking</h2>
        </div>
        {bookingList.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow ring-1 ring-green-200">
            <table className="min-w-full divide-y divide-green-100 text-sm sm:text-base">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-green-700">No</th>
                  <th className="px-4 py-3 text-left font-semibold text-green-700">Tanggal</th>
                  <th className="px-4 py-3 text-left font-semibold text-green-700">Jenis Servis</th>
                  <th className="px-4 py-3 text-left font-semibold text-green-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-50">
                {bookingList.map((b, idx) => (
                  <tr key={idx} className="hover:bg-green-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{new Date(b.tanggal_booking).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2">{b.jenis_servis}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        b.status_booking === 'Selesai' ? 'bg-green-100 text-green-700' :
                        b.status_booking === 'Proses' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'}`}>{b.status_booking}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500">Belum ada data booking</div>
        )}
      </section>

      {/* Produk */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari produk..."
            className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 shadow-sm"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full md:w-1/4 border border-gray-300 rounded-md px-4 py-2 shadow-sm"
          >
            <option value="All">Semua Kategori</option>
            <option value="Oli">Oli</option>
            <option value="Sparepart">Sparepart</option>
            <option value="Cairan">Cairan</option>
            <option value="Ban">Ban</option>
          </select>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-green-700">Produk Terbaru</h2>
        {filteredProducts.length > 0 ? (
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            initial="hidden" animate="visible" variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 }
              }
            }}>
            {filteredProducts.map((product, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.05 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-500">Tidak ada produk ditemukan.</div>
        )}
      </section>

      {/* Staff */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Tukang Servis Kami</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {staffs.map((staff, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.05 }} className="bg-white p-4 rounded-lg shadow text-center">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3">
                {staff.foto_karyawan ? (
                  <img src={staff.foto_karyawan} alt={staff.nama_karyawan} className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                    👨‍🔧
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-lg">{staff.nama_karyawan}</h3>
              <p className="text-sm text-gray-500">{staff.bidang_keahlian}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardUser;
