import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ShoppingCart, Star, Search, Flame, Sparkles,
  Heart, PlusCircle, CreditCard, MapPin, Truck, Loader, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Daftar kategori produk
const kategoriList = [
  { label: 'Oli', icon: '🛢️' },
  { label: 'Ban', icon: '🛞' },
  { label: 'Sparepart', icon: '🔩' },
  { label: 'Aki', icon: '🔋' },
  { label: 'Servis', icon: '🧰' },
  { label: 'Lampu', icon: '💡' },
];

// Konfigurasi RajaOngkir
const RAJAONGKIR_API_KEY = 'b0486067f4cf5ca8ab46b6edad7465bb';
const RAJAONGKIR_BASE_PROXY_PATH = 'https://ahm.inspirasienergiprimanusa.com/api/rajaongkir';
const RAJAONGKIR_PACKAGE_TYPE = 'starter';
const RAJAONGKIR_ORIGIN_CITY = '350'; // ID kota Pekanbaru

// URL API backend
const API_BASE_URL = 'https://ahm.inspirasienergiprimanusa.com';

// Komponen untuk bubble kategori dengan animasi
const CategoryBubble = ({ label, icon, active, onClick }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onClick(label)} 
    className="flex flex-col items-center justify-center space-y-1 w-20 focus:outline-none"
  >
    <motion.div 
      initial={false}
      animate={{ 
        backgroundColor: active ? '#dc2626' : '#ffffff',
        color: active ? '#ffffff' : '#dc2626',
        borderColor: active ? 'transparent' : '#dc2626'
      }}
      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow"
    >
      {icon}
    </motion.div>
    <motion.span 
      animate={{ 
        color: active ? '#dc2626' : '#374151',
        fontWeight: active ? '600' : '400'
      }}
      className="text-sm text-center"
    >
      {label}
    </motion.span>
  </motion.button>
);

// Komponen untuk menampilkan daftar kategori dengan animasi
function KategoriSection({ selectedKategori, onSelect }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-10"
    >
      {kategoriList.map((kategori, i) => (
        <CategoryBubble
          key={i}
          label={kategori.label}
          icon={kategori.icon}
          active={selectedKategori === kategori.label}
          onClick={onSelect}
        />
      ))}
    </motion.div>
  );
}

// Komponen Carousel untuk banner promo dengan animasi
function Carousel() {
  const [current, setCurrent] = useState(0);
  const slides = [
    'https://www.naikmotor.com/wp-content/uploads/2017/02/Spare_Part_Honda.jpg',
    'https://hondababel.com/wp-content/uploads/2018/04/honda-genuine-parts.jpg',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEircB8GX_fWNC76QlWRHFKUA3GGXodBx4Y9wBB_limZ-epprpjewURZ7ueGGxN-3LqQ8xpVQwbjoPFQ1eXVMLnKmRkul9U1EmEox2XBNk63OtrK_klRpcYeH0U2l91VkQdOmMDNDAYYiqdy/s640/AHM+OIL.png',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-64 sm:h-96 overflow-hidden rounded-xl shadow mb-6 bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <img
            src={slides[current]}
            alt={`Slide ${current}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Fungsi helper untuk produk
function isPromo(product) {
  return product.harga_promo && parseInt(product.harga_promo) < parseInt(product.harga_produk);
}

function isNew(product) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return new Date(product.created_at) > oneMonthAgo;
}

function getHargaFinal(product) {
  return isPromo(product) ? parseInt(product.harga_promo) : parseInt(product.harga_produk);
}

// Komponen untuk menampilkan daftar produk dengan animasi
function ProductSection({ title, icon: Icon, products, addToCart, isLoggedIn }) {
  const navigate = useNavigate();

  const handleBuyClick = (product) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    addToCart({ ...product, harga_final: getHargaFinal(product) });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="text-red-600" />}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product, index) => {
          const promo = isPromo(product);
          const diskon = promo ? Math.round((1 - parseInt(product.harga_promo) / parseInt(product.harga_produk)) * 100) : 0;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-2 flex flex-col"
            >
              <img src={product.gambar_produk} alt={product.nama_produk} className="w-full h-32 object-cover rounded-lg mb-2" />

              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{product.nama_produk}</h3>
              <div className="text-xs text-gray-500 flex items-center mb-1">
                <Star size={14} className="text-yellow-400 mr-1" />
                {parseFloat(product.rating_produk).toFixed(1)} | Terjual {product.produk_terjual}
              </div>
              <div className="mb-1">
                {promo ? (
                  <>
                    <div className="text-xs text-gray-500 line-through">Rp{parseInt(product.harga_produk).toLocaleString()}</div>
                    <div className="text-red-600 font-bold text-sm">Rp{parseInt(product.harga_promo).toLocaleString()} <span className="text-xs bg-red-100 text-red-600 px-1 rounded">-{diskon}%</span></div>
                  </>
                ) : (
                  <div className="text-red-600 font-bold text-sm">Rp{parseInt(product.harga_produk).toLocaleString()}</div>
                )}
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBuyClick(product)}
                className="mt-2 w-full text-white bg-green-600 hover:bg-green-700 text-xs px-3 py-2 rounded flex items-center justify-center gap-1"
              >
                <CreditCard size={14} /> Beli Sekarang
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Komponen Keranjang Belanja dengan animasi
function Keranjang({
  cart,
  updateQty,
  removeFromCart,
  isOpen,
  onClose,
  handleCheckout,
  shippingCost,
  setShippingCost,
  shippingCourier,
  setShippingCourier,
  destinationAddress,
  setDestinationAddress,
  provinces,
  cities,
  selectedProvince,
  setSelectedProvince,
  selectedCity,
  setSelectedCity,
  fetchCities,
  fetchShippingCosts,
  shippingOptions,
  setShippingOptions,
  notification,
  setNotification,
  isLoadingShipping,
  customerData,
  setCustomerData,
  isLoggedIn
}) {
  const navigate = useNavigate();
  
  const totalHargaProduk = cart.reduce((acc, item) => acc + item.harga_final * item.qty, 0);
  const totalPembayaran = totalHargaProduk + (shippingCost || 0);
  const totalBerat = cart.reduce((acc, item) => acc + (item.berat_produk ? parseInt(item.berat_produk) : 1) * item.qty, 0);

  const displayNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedCity(''); 
    setDestinationAddress(prev => ({ ...prev, postalCode: '' }));
    setShippingOptions([]); 
    setShippingCost(0); 
    setShippingCourier(''); 
    fetchCities(provinceId);
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setShippingOptions([]); 
    setShippingCost(0); 
    setShippingCourier(''); 
    
    const selectedCityData = cities.find(city => city.city_id === cityId);
    if (selectedCityData && selectedCityData.postal_code) {
      setDestinationAddress(prev => ({ ...prev, postalCode: selectedCityData.postal_code }));
      displayNotification(`Kode pos otomatis terisi: ${selectedCityData.postal_code}`, 'info');
    } else {
      setDestinationAddress(prev => ({ ...prev, postalCode: '' }));
      displayNotification("Kode pos tidak tersedia otomatis. Harap masukkan manual.", 'warning');
    }
  };

  const handleAddressChange = (e) => {
    setDestinationAddress({ ...destinationAddress, [e.target.name]: e.target.value });
  };

  const handleCustomerDataChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleCheckOngkir = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (!selectedCity) {
      displayNotification("Harap pilih Kota/Kabupaten tujuan pengiriman.", 'error');
      return;
    }
    if (totalBerat === 0) {
      displayNotification("Keranjang Anda kosong atau berat totalnya 0. Tambahkan produk untuk cek ongkir.", 'error');
      return;
    }
    if (!destinationAddress.postalCode) {
      displayNotification("Harap masukkan Kode Pos tujuan pengiriman.", 'error');
      return;
    }

    fetchShippingCosts(totalBerat, selectedCity);
  };

  const handleCourierSelect = (cost, courierCode, service) => {
    setShippingCost(cost);
    const formattedCourierName = `${courierCode.toUpperCase()} - ${service}`;
    setShippingCourier(formattedCourierName);
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 30 }}
      className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
        <h3 className="text-lg font-semibold">Keranjang Belanja & Pengiriman</h3>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700"
        >
          Tutup
        </motion.button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-md text-sm ${notification.type === 'error' ? 'bg-red-100 text-red-700' : notification.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}
          >
            {notification.message}
          </motion.div>
        )}

        {/* Form Data Pelanggan */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <h4 className="font-bold text-md mb-3 flex items-center gap-2">
            <User size={18} /> Data Pelanggan
          </h4>
          <div className="space-y-3">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="customerName"
                name="name"
                value={customerData.name}
                onChange={handleCustomerDataChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Nama lengkap penerima"
                required
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Email</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                id="customerEmail"
                name="email"
                value={customerData.email}
                onChange={handleCustomerDataChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Email aktif"
                required
              />
            </div>
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="tel"
                id="customerPhone"
                name="phone"
                value={customerData.phone}
                onChange={handleCustomerDataChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="0812-3456-7890"
                required
              />
            </div>
          </div>
        </motion.div>

        {cart.length === 0 ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500"
          >
            Keranjang kosong.
          </motion.p>
        ) : (
          <>
            <h4 className="font-bold text-md mb-2 flex items-center gap-2"><ShoppingCart size={18} /> Isi Keranjang</h4>
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 border-b pb-3"
                >
                  <img src={item.gambar_produk} alt={item.nama_produk} className="w-16 h-16 rounded object-cover" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm line-clamp-1">{item.nama_produk}</h4>
                    <div className="text-xs text-gray-500">Rp{parseInt(item.harga_final).toLocaleString()}</div>
                    <div className="flex items-center mt-1 flex-wrap">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQty(item.id, item.qty - 1)} 
                        className="px-2 text-red-600"
                      >
                        -
                      </motion.button>
                      <span className="px-2">{item.qty}</span>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQty(item.id, item.qty + 1)} 
                        className="px-2 text-green-600"
                      >
                        +
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFromCart(item.id)} 
                        className="ml-auto text-red-600 text-sm"
                      >
                        Hapus
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="text-right text-sm font-semibold mt-2">Total Berat: {totalBerat} gram</div>

            <hr className="my-4" />

            <h4 className="font-bold text-md mb-2 flex items-center gap-2"><MapPin size={18} /> Alamat Pengiriman</h4>
            <div className="space-y-3">
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700">Provinsi</label>
                <motion.select 
                  whileFocus={{ scale: 1.01 }}
                  id="province" 
                  name="province" 
                  value={selectedProvince} 
                  onChange={handleProvinceChange} 
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map(prov => (
                    <option key={prov.province_id} value={prov.province_id}>{prov.province}</option>
                  ))}
                </motion.select>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Kota/Kabupaten</label>
                <motion.select 
                  whileFocus={{ scale: 1.01 }}
                  id="city" 
                  name="city" 
                  value={selectedCity} 
                  onChange={handleCityChange} 
                  disabled={!selectedProvince || cities.length === 0} 
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                >
                  <option value="">Pilih Kota/Kabupaten</option>
                  {cities.map(city => (
                    <option key={city.city_id} value={city.city_id}>{city.type} {city.city_name}</option>
                  ))}
                </motion.select>
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Kode Pos</label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={destinationAddress.postalCode}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Contoh: 28282"
                />
              </div>
              <div>
                <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-700">Detail Alamat (Nama Desa, Jalan, No. Rumah)</label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  id="detailAddress"
                  name="detailAddress"
                  rows="3"
                  value={destinationAddress.detailAddress}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Contoh: Desa Suka Maju, Jl. Merdeka No. 10"
                ></motion.textarea>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Catatan Lokasi (Opsional)</label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="notes"
                  name="notes"
                  value={destinationAddress.notes}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Contoh: Dekat toko kelontong"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckOngkir}
              disabled={!selectedCity || totalBerat === 0 || isLoadingShipping} 
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold flex items-center justify-center gap-2"
            >
              {isLoadingShipping ? (
                <>
                  <Loader size={18} className="animate-spin" /> Sedang mencari ongkir...
                </>
              ) : (
                <>
                  <Truck size={18} /> Cek Ongkos Kirim
                </>
              )}
            </motion.button>

            {shippingOptions.length > 0 && !isLoadingShipping && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <h4 className="font-bold text-md mb-2 flex items-center gap-2"><Truck size={18} /> Jasa Pengiriman Tersedia</h4>
                <div className="space-y-2">
                  {shippingOptions.map((option, index) => (
                    <motion.div
                      key={`${option.courier}-${option.service}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${shippingCourier === `${option.courier.toUpperCase()} - ${option.service}` ? 'border-red-600 ring-1 ring-red-600' : 'border-gray-200'}`}
                      onClick={() => handleCourierSelect(option.cost[0].value, option.courier, option.service)}
                    >
                      <div>
                        <p className="font-semibold text-sm">{option.description} ({option.service})</p>
                        <p className="text-xs text-gray-500">Estimasi: ${option.etd} hari</p>
                      </div>
                      <span className="font-bold text-red-600">Rp{option.cost[0].value.toLocaleString()}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {shippingOptions.length === 0 && !isLoadingShipping && selectedCity && totalBerat > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md text-sm"
              >
                Tidak ada opsi pengiriman tersedia untuk tujuan ini atau berat produk tidak valid. Pastikan berat produk lebih dari 0.
              </motion.div>
            )}
          </>
        )}
      </div>
      <div className="p-4 border-t flex-shrink-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold">Total Harga Produk:</span>
          <span className="text-md font-bold text-gray-900">Rp{totalHargaProduk.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold">Ongkos Kirim ({shippingCourier || 'Pilih Jasa'}):</span>
          <span className="text-md font-bold text-red-600">Rp{(shippingCost || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold">Total Pembayaran:</span>
          <span className="text-lg font-bold text-red-600">Rp{totalPembayaran.toLocaleString()}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (!isLoggedIn) {
              navigate('/login');
              return;
            }
            if (!customerData.name || !customerData.email || !customerData.phone) {
              displayNotification("Harap lengkapi data pelanggan (nama, email, dan telepon)", 'error');
              return;
            }
            handleCheckout(totalPembayaran);
          }}
          disabled={cart.length === 0 || !shippingCourier || !selectedCity || !destinationAddress.detailAddress || !destinationAddress.postalCode || totalPembayaran < 1000} 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold"
        >
          Bayar Sekarang
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function HalamanToko() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State untuk pengiriman
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [destinationAddress, setDestinationAddress] = useState({
    detailAddress: '',
    postalCode: '',
    notes: '',
  });
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingCourier, setShippingCourier] = useState('');
  const [notification, setNotification] = useState(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  // State untuk data pelanggan
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Cek status login saat komponen dimount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Fungsi untuk mengambil data produk dari API
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/produk`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setAllProducts(data);
      })
      .catch(err => {
        console.error('Gagal fetch produk:', err.message);
        setNotification({ message: 'Gagal memuat produk. Coba refresh halaman.', type: 'error' });
      });

    // Mengambil data provinsi dari RajaOngkir
    axios.get(`${RAJAONGKIR_BASE_PROXY_PATH}/${RAJAONGKIR_PACKAGE_TYPE}/province`, { 
      headers: { 'key': RAJAONGKIR_API_KEY }
    })
      .then(res => {
        if (res.data.rajaongkir.status.code === 200) {
          setProvinces(res.data.rajaongkir.results);
        } else {
          console.error("Gagal mengambil data provinsi:", res.data.rajaongkir.status.description);
          setNotification({ message: `Gagal mengambil data provinsi: ${res.data.rajaongkir.status.description}`, type: 'error' });
        }
      })
      .catch(err => {
        console.error('Gagal fetch provinsi:', err.message);
        setNotification({ message: 'Gagal mengambil data provinsi. Pastikan proxy server berjalan dan konfigurasi RajaOngkir benar.', type: 'error' });
      });
  }, []); 

  // Fungsi untuk mengambil data kota berdasarkan provinsi
  const fetchCities = useCallback((provinceId) => {
    if (!provinceId) {
      setCities([]);
      return;
    }
    axios.get(`${RAJAONGKIR_BASE_PROXY_PATH}/${RAJAONGKIR_PACKAGE_TYPE}/city?province=${provinceId}`, { 
      headers: { 'key': RAJAONGKIR_API_KEY }
    })
      .then(res => {
        if (res.data.rajaongkir.status.code === 200) {
          setCities(res.data.rajaongkir.results);
        } else {
          console.error("Gagal mengambil data kota:", res.data.rajaongkir.status.description);
          setNotification({ message: `Gagal mengambil data kota: ${res.data.rajaongkir.status.description}`, type: 'error' });
        }
      })
      .catch(err => {
        console.error('Gagal fetch kota:', err.message);
        setCities([]);
        setNotification({ message: 'Gagal mengambil data kota. Coba lagi nanti.', type: 'error' });
      });
  }, []);

  // Fungsi untuk menghitung ongkos kirim
  const fetchShippingCosts = useCallback(async (weight, destinationCityId) => {
    setShippingOptions([]); 
    setShippingCost(0);
    setShippingCourier('');
    setIsLoadingShipping(true);

    if (weight === 0 || !destinationCityId) {
      setNotification({ message: "Berat produk dan tujuan harus diisi untuk cek ongkir.", type: 'error' });
      setIsLoadingShipping(false);
      return;
    }

    const couriers = ['jne', 'pos', 'tiki'];

    try {
      const responses = await Promise.all(couriers.map(courier =>
        axios.post(`${RAJAONGKIR_BASE_PROXY_PATH}/${RAJAONGKIR_PACKAGE_TYPE}/cost`, { 
          origin: RAJAONGKIR_ORIGIN_CITY,
          originType: 'city',
          destination: destinationCityId,
          destinationType: 'city',
          weight: weight,
          courier: courier
        }, {
          headers: { 'key': RAJAONGKIR_API_KEY }
        }).catch(error => {
          console.error(`Error fetching cost for ${courier}:`, error);
          return { data: { rajaongkir: { status: { code: 500, description: `Failed to fetch for ${courier}` } } } };
        })
      ));

      let allOptions = [];
      let anySuccess = false;

      responses.forEach(res => {
        if (res.data.rajaongkir.status.code === 200) {
          anySuccess = true;
          res.data.rajaongkir.results.forEach(result => {
            if (result.costs && result.costs.length > 0) {
              result.costs.forEach(cost => {
                if (cost.cost && cost.cost.length > 0) {
                  allOptions.push({
                    courier: result.code,
                    description: cost.description,
                    service: cost.service,
                    cost: cost.cost,
                    etd: cost.cost[0].etd || 'N/A'
                  });
                }
              });
            }
          });
        } else {
          console.warn(`Gagal mengambil ongkir untuk ${res.data.rajaongkir.query?.courier || 'Unknown'}:`, res.data.rajaongkir.status.description);
        }
      });

      setShippingOptions(allOptions);
      if (!anySuccess || allOptions.length === 0) {
        setNotification({ message: "Tidak ada opsi pengiriman tersedia untuk tujuan ini atau berat produk tidak valid.", type: 'warning' });
      } else {
        setNotification({ message: "Opsi pengiriman berhasil dimuat!", type: 'info' });
      }
    } catch (err) {
      console.error('Gagal fetch ongkos kirim:', err.message);
      setNotification({ message: "Gagal mengambil ongkos kirim. Pastikan koneksi internet stabil.", type: 'error' });
    } finally {
      setIsLoadingShipping(false);
    }
  }, []);

  // Fungsi untuk menambahkan produk ke keranjang
  const addToCart = (product) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1, berat_produk: product.berat_produk || 1 }]);
    }
    setIsCartOpen(true);
  };

  // Fungsi untuk mengupdate jumlah produk di keranjang
  const updateQty = (productId, newQty) => {
    if (newQty < 1) return;
    setCart(cart.map((item) => item.id === productId ? { ...item, qty: newQty } : item));
  };

  // Fungsi untuk menghapus produk dari keranjang
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
    setShippingCost(0);
    setShippingCourier('');
    setShippingOptions([]);
    setNotification(null);
  };

  // Fungsi untuk proses checkout
  const handleCheckout = async (totalPembayaran) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Validasi data pelanggan
    if (!customerData.name || !customerData.email || !customerData.phone) {
      setNotification({
        message: "Harap lengkapi data pelanggan (nama, email, dan telepon)",
        type: 'error'
      });
      return;
    }

    // Validasi minimal pembayaran
    if (totalPembayaran < 1000) {
      setNotification({
        message: "Total pembayaran minimal Rp 1.000",
        type: 'error'
      });
      return;
    }

    // Validasi kelengkapan data
    if (!selectedCity || !shippingCourier || !destinationAddress.detailAddress || !destinationAddress.postalCode) {
      setNotification({
        message: "Harap lengkapi detail pengiriman dan pilih jasa pengiriman",
        type: 'error'
      });
      return;
    }

    try {
      // Pisahkan kurir dan layanan
      const [courier, service] = shippingCourier.split(' - ');

      // Format data untuk backend
      const transactionData = {
        items: cart.map(item => ({
          produk_id: item.id.toString(),
          nama_produk: item.nama_produk.substring(0, 255),
          harga: parseFloat(item.harga_final),
          quantity: parseInt(item.qty),
          berat: item.berat_produk ? parseInt(item.berat_produk) : 1
        })),
        total_price: cart.reduce((sum, item) => sum + (item.harga_final * item.qty), 0),
        shipping_cost: parseFloat(shippingCost),
        total_payment: parseFloat(totalPembayaran),
        courier: courier,
        shipping_service: service || 'REG',
        shipping_address: {
          provinsi_id: selectedProvince.toString(),
          kota_id: selectedCity.toString(),
          detail_alamat: destinationAddress.detailAddress.substring(0, 500),
          kode_pos: destinationAddress.postalCode.toString().substring(0, 10),
          catatan: (destinationAddress.notes || '').substring(0, 500)
        },
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone
      };

      // 1. Simpan transaksi ke database
      const transactionResponse = await axios.post(
        `${API_BASE_URL}/api/transaksi`,
        transactionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      const orderId = transactionResponse.data.data.order_id;
      const cityName = cities.find(c => c.city_id === selectedCity)?.city_name || 'Kota Tidak Diketahui';

      // 2. Generate token Midtrans
      const tokenResponse = await axios.post(
        `${API_BASE_URL}/api/midtrans/token`,
        {
          transaksi_id: orderId,
          total: totalPembayaran,
          items: cart.map(item => ({
            id: item.id.toString(),
            name: item.nama_produk.substring(0, 50),
            price: item.harga_final,
            quantity: item.qty
          })),
          customer_details: {
            first_name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            shipping_address: {
              address: destinationAddress.detailAddress,
              city: cityName,
              postal_code: destinationAddress.postalCode
            }
          }
        }
      );

      // 3. Buka popup pembayaran Midtrans
      window.snap.pay(tokenResponse.data.token, {
        onSuccess: async (result) => {
          await axios.put(`${API_BASE_URL}/api/transaksi/${orderId}/status`, {
            status: 'success',
            payment_method: result.payment_type,
            transaction_id: result.transaction_id,
            transaction_time: result.transaction_time
          });
          setNotification({
            message: `Pembayaran berhasil! ID: ${orderId}`,
            type: 'success'
          });
          resetCart();
        },
        onPending: async (result) => {
          await axios.put(`${API_BASE_URL}/api/transaksi/${orderId}/status`, {
            status: 'pending',
            payment_method: result.payment_type,
            transaction_id: result.transaction_id,
            transaction_time: result.transaction_time
          });
          setNotification({
            message: `Menunggu konfirmasi pembayaran. ID: ${orderId}`,
            type: 'warning'
          });
        },
        onError: async (error) => {
          await axios.put(`${API_BASE_URL}/api/transaksi/${orderId}/status`, {
            status: 'failed'
          });
          setNotification({
            message: `Pembayaran gagal. Silakan coba lagi. ID: ${orderId}`,
            type: 'error'
          });
        },
        onClose: async () => {
          await axios.put(`${API_BASE_URL}/api/transaksi/${orderId}/status`, {
            status: 'failed',
            transaction_id: 'user_closed'
          });
          setNotification({
            message: `Anda menutup halaman pembayaran. ID: ${orderId}`,
            type: 'info'
          });
        }
      });

    } catch (error) {
      console.error('Error proses checkout:', error);
      setNotification({
        message: error.response?.data?.message || 'Terjadi kesalahan saat proses checkout',
        type: 'error',
        duration: 5000
      });
    }
  };

  // Fungsi untuk reset keranjang
  const resetCart = () => {
    setCart([]);
    setIsCartOpen(false);
    setShippingCost(0);
    setShippingCourier('');
    setSelectedProvince('');
    setSelectedCity('');
    setDestinationAddress({ detailAddress: '', postalCode: '', notes: '' });
    setCustomerData({ name: '', email: '', phone: '' });
    setShippingOptions([]);
  };

  // Filter produk berdasarkan pencarian dan kategori
  const filterProducts = (product) => {
    const matchSearch = searchQuery ? product.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const matchKategori = selectedKategori ? product.kategori === selectedKategori : true;
    return matchSearch && matchKategori;
  };

  // Kategorikan produk
  const promoProducts = allProducts.filter(isPromo).filter(filterProducts);
  const newProducts = allProducts.filter(isNew).filter(filterProducts);
  const normalProducts = allProducts.filter(p => !isPromo(p) && !isNew(p)).filter(filterProducts);

  return (
    <div className="w-full min-h-screen bg-white text-black font-sans">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/')} className="text-lg font-bold text-red-600">Toko Sparepart</button>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  setIsLoggedIn(false);
                  navigate('/login');
                }}
                className="text-sm text-gray-700 hover:text-red-600"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="text-sm text-gray-700 hover:text-red-600"
              >
                Login
              </button>
            )}
            <button onClick={() => {
              if (!isLoggedIn) {
                navigate('/login');
                return;
              }
              setIsCartOpen(true);
            }} className="relative p-2 text-gray-700 hover:text-red-600">
              <ShoppingCart size={28} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center text-white font-semibold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <Carousel />
        <KategoriSection selectedKategori={selectedKategori} onSelect={(label) => setSelectedKategori(label === selectedKategori ? '' : label)} />

        <div className="mb-8 max-w-xl">
          <div className="relative">
            <Search className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-sm"
            />
          </div>
        </div>

        <ProductSection 
          title="Promo Spesial" 
          icon={Flame} 
          products={promoProducts} 
          addToCart={addToCart} 
          isLoggedIn={isLoggedIn} 
        />
        <ProductSection 
          title="Produk Baru" 
          icon={Sparkles} 
          products={newProducts} 
          addToCart={addToCart} 
          isLoggedIn={isLoggedIn} 
        />
        <ProductSection 
          title="Produk Lainnya" 
          icon={null} 
          products={normalProducts} 
          addToCart={addToCart} 
          isLoggedIn={isLoggedIn} 
        />
      </div>

      <Keranjang
        cart={cart}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        handleCheckout={handleCheckout}
        shippingCost={shippingCost}
        setShippingCost={setShippingCost}
        shippingCourier={shippingCourier}
        setShippingCourier={setShippingCourier}
        destinationAddress={destinationAddress}
        setDestinationAddress={setDestinationAddress}
        provinces={provinces}
        cities={cities}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        fetchCities={fetchCities}
        fetchShippingCosts={fetchShippingCosts}
        shippingOptions={shippingOptions}
        setShippingOptions={setShippingOptions}
        notification={notification}
        setNotification={setNotification}
        isLoadingShipping={isLoadingShipping}
        customerData={customerData}
        setCustomerData={setCustomerData}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}