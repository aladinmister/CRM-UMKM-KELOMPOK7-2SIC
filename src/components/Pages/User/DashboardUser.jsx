import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

const DashboardUser = () => {
  // Banner images
  const banners = [
    "https://cdn.motor1.com/images/mgl/jJJzK/s3/2022-honda-cbr1000rr-r-fireblade.jpg",
    "https://otomotifnet.gridoto.com/photobank/images/ahm-honda-motogp.jpg",
    "https://asset.kompas.com/crops/lVZImAwlyy9TSmCu_EpkxP5GM80=/0x0:780x390/750x500/data/photo/2022/01/07/61d7b9cb5b403.jpeg",
  ];

  // Categories with icon and link
  const categories = [
    { name: 'Booking Servis', icon: '🛠️', link: '/booking' },
    { name: 'Riwayat', icon: '📄', link: '/history' },
    { name: 'Promo', icon: '🎁', link: '/promo' },
    { name: 'Produk', icon: '🛍️', link: '/produk' },
    { name: 'Galeri', icon: '🖼️', link: '/galeri' },
    { name: 'Kontak', icon: '📞', link: '/kontak' },
  ];

  // Products (lebih banyak produk digandakan supaya banyak)
  const baseProducts = [
    {
      name: 'Oli Mesin AHM',
      category: 'Oli',
      price: 45000,
      image: 'https://images.tokopedia.net/img/cache/700/product-1/2020/6/8/34586579/34586579_f0f8b631-e293-4398-9ea6-39b620e3b56e.jpg',
    },
    {
      name: 'Busi Motor NGK',
      category: 'Sparepart',
      price: 25000,
      image: 'https://static.ralali.id/p/global/1701316385946_GA11060351675885.png',
    },
    {
      name: 'Kampas Rem',
      category: 'Sparepart',
      price: 30000,
      image: 'https://img.ws.mms.shopee.co.id/56ee07f524c0b921a430875ed0db19f6',
    },
    {
      name: 'Cairan Radiator',
      category: 'Cairan',
      price: 20000,
      image: 'https://static.wixstatic.com/media/9ff49f_8b9b6d40efae4f1488777d29f1699a07~mv2.jpg',
    },
    {
      name: 'Ban Motor Tubeless',
      category: 'Ban',
      price: 150000,
      image: 'https://s1.bukalapak.com/img/2316370922/large/data.jpeg',
    },
  ];

  // Gandakan baseProducts 3x supaya lebih banyak
  const allProducts = [];
  for (let i = 0; i < 3; i++) {
    baseProducts.forEach((p, idx) => {
      allProducts.push({
        ...p,
        name: `${p.name} ${i > 0 ? `#${i}` : ''}`,
        // Bisa juga tambahkan ID unik jika diperlukan
      });
    });
  }

  // Promo produk (lebih banyak juga saya gandakan)
  const basePromoProducts = [
    {
      name: 'Oli Mesin AHM',
      category: 'Oli',
      price: 40000,
      originalPrice: 45000,
      image: 'https://images.tokopedia.net/img/cache/700/product-1/2020/6/8/34586579/34586579_f0f8b631-e293-4398-9ea6-39b620e3b56e.jpg',
      hashtags: ['#Promo', '#OliMurah', '#BengkelAHM'],
    },
    {
      name: 'Busi Motor NGK',
      category: 'Sparepart',
      price: 20000,
      originalPrice: 25000,
      image: 'https://static.ralali.id/p/global/1701316385946_GA11060351675885.png',
      hashtags: ['#BusiNGK', '#DiskonSparepart', '#AHMService'],
    },
  ];

  const promoProducts = [];
  for (let i = 0; i < 3; i++) {
    basePromoProducts.forEach((p, idx) => {
      promoProducts.push({
        ...p,
        name: `${p.name} ${i > 0 ? `#${i}` : ''}`,
      });
    });
  }

  // Technicians
  const technicians = [
    { name: 'Budi Santoso', skill: 'Mekanik Motor', photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Sari Dewi', skill: 'Service Elektrik', photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Agus Wahyudi', skill: 'Ganti Oli & Tune Up', photo: 'https://randomuser.me/api/portraits/men/45.jpg' },
  ];

  // Gallery images
  const galleryImages = [
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
  ];

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);

  const bannerIntervalRef = useRef(null);

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

  const prevBanner = () => {
    setCurrentBanner(prev => (prev === 0 ? banners.length - 1 : prev - 1));
    startBannerAutoScroll();
  };

  const nextBanner = () => {
    setCurrentBanner(prev => (prev + 1) % banners.length);
    startBannerAutoScroll();
  };

  // Filter dan cari produk
  const filteredProducts = allProducts
    .filter(p => filter === 'All' || p.category === filter)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Banner Fullscreen */}
      <section className="relative w-full h-screen max-h-[700px] overflow-hidden select-none">
        <img
          src={banners[currentBanner]}
          alt={`banner-${currentBanner}`}
          className="w-full h-full object-cover object-center transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
        <button
          onClick={prevBanner}
          className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
          aria-label="Previous Banner"
        >
          ‹
        </button>
        <button
          onClick={nextBanner}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
          aria-label="Next Banner"
        >
          ›
        </button>
        <div className="absolute bottom-12 left-8 max-w-xl text-white drop-shadow-lg">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Selamat Datang di Bengkel AHM</h1>
          <p className="text-lg md:text-xl">Servis Motor Profesional & Produk Berkualitas</p>
        </div>
      </section>

      {/* Kategori Bulat */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-3 sm:grid-cols-6 gap-8 justify-items-center">
        {categories.map((cat, idx) => (
          <a
            key={idx}
            href={cat.link}
            className="flex flex-col items-center text-center text-gray-700 hover:text-blue-600 transition"
            title={cat.name}
          >
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl shadow-lg mb-3 transform hover:scale-110 transition-transform">
              {cat.icon}
            </div>
            <span className="font-semibold text-sm">{cat.name}</span>
          </a>
        ))}
      </section>

      {/* Search & Filter Produk */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Cari produk..."
            className="flex-grow border border-gray-300 rounded-md px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            onChange={e => setFilter(e.target.value)}
            value={filter}
            className="border border-gray-300 rounded-md px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">Semua Kategori</option>
            <option value="Oli">Oli</option>
            <option value="Sparepart">Sparepart</option>
            <option value="Cairan">Cairan</option>
            <option value="Ban">Ban</option>
          </select>
        </div>

        {/* Produk Populer */}
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Produk Populer</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Produk tidak ditemukan.</p>
          )}
        </div>
      </section>

      {/* Promo Produk */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-red-600">Promo Spesial</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {promoProducts.length > 0 ? (
            promoProducts.map((product, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                title={`${product.name} - Promo`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                <p className="text-xl font-bold text-red-600 mb-2">{product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                <div className="flex flex-wrap gap-2">
                  {product.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full select-none"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Tidak ada promo saat ini.</p>
          )}
        </div>
      </section>

      {/* Tukang Servis */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Tukang Servis Kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {technicians.map((tech, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
            >
              <img
                src={tech.photo}
                alt={tech.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">{tech.name}</h3>
              <p className="text-gray-600">{tech.skill}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Galeri */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Galeri</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galleryImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`gallery-${idx}`}
              className="w-full h-40 object-cover rounded-lg hover:opacity-90 transition"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardUser;
