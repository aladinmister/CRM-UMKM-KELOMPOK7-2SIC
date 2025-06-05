import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

const DashboardUser = () => {
  // Banner images
  const banners = [
    "https://recruitment.astra-honda.com/image-testimony/26_slider84.jpg",
    "https://www.otoinfo.id/wp-content/uploads/2022/09/AHM-Gedung-Karawang-Lokerteen.Info_.jpg",
    "https://recruitment.astra-honda.com/image-testimony/31_slider84.jpg",
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

  // Products
  const baseProducts = [
    {
      name: 'Oli Mesin AHM',
      category: 'Oli',
      price: 45000,
      image: 'https://www.hondacengkareng.com/wp-content/uploads/2021/04/MPX2-Oli-Honda.jpg',
    },
    {
      name: 'Busi Motor NGK',
      category: 'Sparepart',
      price: 25000,
      image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR18YccyAj-ThFCLCdXy3KT7tjLLdaNEWPw8YewNlDYkcYVzSgVksLxyo_Y0s2ObbuBJDLSIkWnjaxIQOBmhAOrbORua6YRb57a3j2_fuuoBI1qSU1eXUQ6Z2k',
    },
    {
      name: 'Kampas Rem',
      category: 'Sparepart',
      price: 30000,
      image: 'https://www.hondacengkareng.com/wp-content/uploads/2017/11/Pad-Set-FR-06455KVBT01.jpg',
    },
    {
      name: 'Cairan Radiator',
      category: 'Cairan',
      price: 20000,
      image: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//1001/honda_honda-genuine-parts-coolant-air-radiator--500-ml-_full03.jpg',
    },
    {
      name: 'Ban Motor Tubeless',
      category: 'Ban',
      price: 150000,
      image: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//102/MTA-2987562/ahm_ban-motor-ahm-tubeless-80-90-14-ft-235-k59-a12-tl_full02.jpg',
    },
  ];

  // Gandakan baseProducts 3x
  const allProducts = [];
  for (let i = 0; i < 3; i++) {
    baseProducts.forEach((p, idx) => {
      allProducts.push({
        ...p,
        name: `${p.name} ${i > 0 ? `#${i}` : ''}`,
      });
    });
  }

  // Promo produk
  const basePromoProducts = [
    {
      name: 'Oli Mesin AHM',
      category: 'Oli',
      price: 40000,
      originalPrice: 45000,
      image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRwBv__FURu7Dx6nYbEoUl3skvkO3VblOg86HtQMWdXSQDaRrBMBStMy6B411pmM4WZ2TtBC4nKG65FDxXKlm5F53h6HsYDvV9cl3zRQYFedqe3gZkVpn9JNA',
      hashtags: ['#Promo', '#OliMurah', '#BengkelAHM'],
    },
    {
      name: 'Busi Motor NGK',
      category: 'Sparepart',
      price: 20000,
      originalPrice: 25000,
      image: 'https://www.hondacengkareng.com/wp-content/uploads/2019/05/9806958911-600x600.jpg',
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
    { name: 'Budi Santoso', skill: 'Mekanik Motor', photo: 'https://images.mobilinanews.com/posts/1/2024/2024-08-16/8fae31ceaa3c8035591e676ec33ec6c6_1.jpg' },
    { name: 'Sari Dewi', skill: 'Service Elektrik', photo: 'https://asset.kompas.com/crops/AzX8YTh-QnNFddGcZ0GNv_9D30o=/211x0:1831x1080/750x500/data/photo/2021/08/18/611c615e31e74.jpg' },
    { name: 'Agus Wahyudi', skill: 'Ganti Oli & Tune Up', photo: 'https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/179/2024/05/07/IMG-20240507-WA0002-67547691.jpg' },
  ];

  // Gallery images
  const galleryImages = [
    'https://www.naikmotor.com/wp-content/uploads/2021/12/EdukasiHariIbu03.jpeg',
    'https://asset.kompas.com/crops/srJJvJ91pN2MgelnWfrznc4xZP4=/0x0:780x520/750x500/data/photo/2022/10/03/633a7ef0b26aa.jpg',
    'https://i0.wp.com/imotorium.com/wp-content/uploads/2019/09/AHM_HariPelangganNasional.-02-.jpg?ssl=1',
     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIqscFdgy3GDTN_8tjfzvz6m2-EkMosAAnyc1_YjeCpI3T-K_rrBlyPcYnCDs_wybMI1c&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbryUoUqIOl8aNR8so-Fat3VoezCkp4s8mxdJWE5N42LG3SOz5bJWcac273EnW1Pii2jY&usqp=CAU',
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAt1o0ZJHGDRvXQCiqerK3DbNNLmGF9Wn3S1g-yBx0-6krWXC8xx3NTGMrrkLsTbxlcgQ&usqp=CAU',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxAaH3JlJXJhPg3Zg3I9-9TeOtu4Qvom2dMalMHQOGRVtpHkES5Ew1-LNFazzvwvVsJAY&usqp=CAU',
         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXvI63dHatmEMtchIuEQHxyEvz8apXASWxNbb2GVXiK978fJ0QBEuKehPOun6PCHUggRw&usqp=CAU',
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
     <div className="w-full min-h-screen bg-white text-black font-sans">
      {/* Banner Fullscreen - PERBAIKAN UTAMA */}
      <section className="relative w-full h-[40vh] min-h-[300px] max-h-[500px] overflow-hidden select-none flex items-center justify-center bg-gray-900">
        {/* Linear Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70 z-5"></div>
        
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={banners[currentBanner]}
            alt={`banner-${currentBanner}`}
            className="w-full h-full object-cover transition-all duration-1000"
          />
        </div>
        
        {/* Navigation Buttons */}
        <button
          onClick={prevBanner}
          className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/75 transition z-10"
          aria-label="Previous Banner"
        >
          ‹
        </button>
        <button
          onClick={nextBanner}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/75 transition z-10"
          aria-label="Next Banner"
        >
          ›
        </button>
        
        {/* Banner Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentBanner(idx);
                startBannerAutoScroll();
              }}
              className={`w-3 h-3 rounded-full ${
                currentBanner === idx ? 'bg-white' : 'bg-gray-400'
              }`}
              aria-label={`Go to banner ${idx + 1}`}
            />
          ))}
        </div>
        
        {/* Banner Text */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-6 text-center text-white drop-shadow-lg z-10">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Selamat Datang di Bengkel AHM</h1>
          <p className="text-base md:text-lg">Servis Motor Profesional & Produk Berkualitas</p>
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