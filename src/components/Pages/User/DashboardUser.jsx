import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bannerIntervalRef = useRef(null);

  // Fungsi untuk rotasi banner otomatis
  const startBannerAutoScroll = () => {
    if (bannerIntervalRef.current) clearInterval(bannerIntervalRef.current);
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 4000);
  };

  useEffect(() => {
    startBannerAutoScroll();
    return () => clearInterval(bannerIntervalRef.current);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://ahm.inspirasienergiprimanusa.com/api/dashboard-user');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

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
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter produk berdasarkan kategori dan pencarian
  const filteredProducts = latestProducts
    .filter(p => filter === 'All' || p.kategori === filter)
    .filter(p => 
      p.nama_produk?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      p.kategori?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
      {/* Banner Section */}
      <section className="relative w-full h-[40vh] min-h-[300px] max-h-[500px] overflow-hidden flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70 z-5"></div>
        <img
          src={banners[currentBanner]}
          alt={`banner-${currentBanner}`}
          className="w-full h-full object-cover transition-all duration-1000 relative z-0"
        />
        <button 
          onClick={() => { 
            setCurrentBanner(prev => prev === 0 ? banners.length - 1 : prev - 1); 
            startBannerAutoScroll(); 
          }}
          className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/75 z-10"
        >
          ‹
        </button>
        <button 
          onClick={() => { 
            setCurrentBanner(prev => (prev + 1) % banners.length); 
            startBannerAutoScroll(); 
          }}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/75 z-10"
        >
          ›
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {banners.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => { 
                setCurrentBanner(idx); 
                startBannerAutoScroll(); 
              }}
              className={`w-3 h-3 rounded-full ${currentBanner === idx ? 'bg-white' : 'bg-gray-400'}`}
            />
          ))}
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-6 text-center text-white drop-shadow-lg z-10">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Selamat Datang di Bengkel AHM</h1>
          <p className="text-base md:text-lg">Servis Motor Profesional & Produk Berkualitas</p>
        </div>
      </section>

      {/* Kategori Menu */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-3 sm:grid-cols-6 gap-8 justify-items-center">
        {categories.map((cat, idx) => (
          <a 
            key={idx} 
            href={cat.link} 
            className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl shadow-lg mb-3 hover:scale-110 transition-transform">
              {cat.icon}
            </div>
            <span className="font-semibold text-sm">{cat.name}</span>
          </a>
        ))}
      </section>

      {/* Booking List */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold mb-4">Booking Terbaru</h2>
        {bookingList.length > 0 ? (
          <div className="space-y-4">
            {bookingList.map((b, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <p><strong>Tanggal:</strong> {new Date(b.tanggal_booking).toLocaleDateString('id-ID')}</p>
                <p><strong>Jenis Servis:</strong> {b.jenis_servis}</p>
                <p><strong>Status:</strong> 
                  <span className={`px-2 py-1 rounded-full text-xs ml-2 ${
                    b.status_booking === 'Selesai' ? 'bg-green-100 text-green-800' :
                    b.status_booking === 'Proses' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {b.status_booking}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg text-gray-600">
            Tidak ada booking terbaru ditemukan.
          </div>
        )}
      </section>

      {/* Produk List */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <input
            type="text"
            placeholder="Cari produk..."
            className="flex-grow border border-gray-300 rounded-md px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="All">Semua Kategori</option>
            <option value="Oli">Oli</option>
            <option value="Sparepart">Sparepart</option>
            <option value="Cairan">Cairan</option>
            <option value="Ban">Ban</option>
          </select>
        </div>
        
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Produk Terbaru</h2>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <p className="text-gray-600">Tidak ada produk yang sesuai dengan pencarian Anda.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilter('All');
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </section>

      {/* Staffs */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Tukang Servis Kami</h2>
        {staffs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {staffs.map((tech, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-gray-200">
                  {tech.foto_karyawan ? (
                    <img 
                      src={tech.foto_karyawan} 
                      alt={tech.nama_karyawan}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <span className="text-3xl">👨‍🔧</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold">{tech.nama_karyawan}</h3>
                <p className="text-gray-600 text-sm">{tech.bidang_keahlian}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <p className="text-gray-600">Data teknisi tidak tersedia.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardUser;