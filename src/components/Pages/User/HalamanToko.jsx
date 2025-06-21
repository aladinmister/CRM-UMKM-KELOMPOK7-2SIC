import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ShoppingCart, Star, Search, Flame, Sparkles,
  Heart, PlusCircle, CreditCard, MapPin, Truck, Loader
} from 'lucide-react';

const kategoriList = [
  { label: 'Oli', icon: '🛢️' },
  { label: 'Ban', icon: '🛞' },
  { label: 'Sparepart', icon: '🔩' },
  { label: 'Aki', icon: '🔋' },
  { label: 'Servis', icon: '🧰' },
  { label: 'Lampu', icon: '💡' },
];

// --- Konfigurasi RajaOngkir ---
const RAJAONGKIR_API_KEY = 'b0486067f4cf5ca8ab46b6edad7465bb'; // Pastikan ini API key Anda yang valid
const RAJAONGKIR_BASE_PROXY_PATH = '/rajaongkir-api'; 
const RAJAONGKIR_PACKAGE_TYPE = 'starter'; // TETAP STARTER, SESUAI KONFIRMASI ANDA

const RAJAONGKIR_ORIGIN_CITY = '350'; // ID kota Pekanbaru (asal pengiriman)

// URL API produk Anda
const PRODUCT_API_BASE_URL = 'https://ahm.inspirasienergiprimanusa.com'; 

const CategoryBubble = ({ label, icon, active, onClick }) => (
  <button onClick={() => onClick(label)} className="flex flex-col items-center justify-center space-y-1 w-20 focus:outline-none">
    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow ${active ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-600'}`}>{icon}</div>
    <span className={`text-sm text-center ${active ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>{label}</span>
  </button>
);

function KategoriSection({ selectedKategori, onSelect }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-10">
      {kategoriList.map((kategori, i) => (
        <CategoryBubble
          key={i}
          label={kategori.label}
          icon={kategori.icon}
          active={selectedKategori === kategori.label}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}

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
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Slide ${i}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        />
      ))}
    </div>
  );
}

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

function ProductSection({ title, icon: Icon, products, addToCart }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="text-red-600" />}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map(product => {
          const promo = isPromo(product);
          const diskon = promo ? Math.round((1 - parseInt(product.harga_promo) / parseInt(product.harga_produk)) * 100) : 0;

          return (
            <div key={product.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-2 flex flex-col">
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
              <div className="flex justify-between items-center mt-auto gap-2">
                <button className="text-gray-500 hover:text-red-500"><Heart size={20} /></button>
                <button onClick={() => addToCart({ ...product, harga_final: getHargaFinal(product) })} className="text-gray-600 hover:text-red-600"><PlusCircle size={20} /></button>
                <button className="ml-auto text-white bg-green-600 hover:bg-green-700 text-xs px-3 py-1 rounded flex items-center gap-1"><CreditCard size={14} /> Beli</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
  notification, // Menambahkan prop notifikasi
  setNotification, // Menambahkan prop setNotification
  isLoadingShipping // Menambahkan prop loading
}) {
  const totalHargaProduk = cart.reduce((acc, item) => acc + item.harga_final * item.qty, 0);
  const totalPembayaran = totalHargaProduk + (shippingCost || 0);
  const totalBerat = cart.reduce((acc, item) => acc + (item.berat_produk ? parseInt(item.berat_produk) : 1) * item.qty, 0);

  const displayNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Notifikasi hilang setelah 3 detik
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedCity(''); 
    setDestinationAddress(prev => ({ ...prev, postalCode: '' })); // Reset kode pos
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
    
    // Coba set kode pos otomatis jika kota memiliki kode pos
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

  const handleCheckOngkir = () => {
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

    // Validasi sederhana kode pos (opsional, karena RajaOngkir Starter tidak validasi mendalam)
    const selectedCityData = cities.find(city => city.city_id === selectedCity);
    if (selectedCityData && selectedCityData.postal_code && selectedCityData.postal_code !== destinationAddress.postalCode) {
        // Ini adalah validasi sederhana: jika ada kode pos otomatis dari RO, dan user mengganti tapi tidak cocok.
        // Pada paket Starter, RajaOngkir tidak melakukan validasi silang kode pos dengan kota secara ketat saat request cost.
        // Ini lebih ke UX hint.
        displayNotification("Kode pos mungkin tidak cocok dengan kota yang dipilih. Pastikan kode pos benar.", 'warning');
    }


    fetchShippingCosts(totalBerat, selectedCity);
  };

  const handleCourierSelect = (cost, courierCode, service) => {
    setShippingCost(cost);
    const formattedCourierName = `${courierCode.toUpperCase()} - ${service}`;
    setShippingCourier(formattedCourierName);
  };

  return (
    <div className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 flex flex-col`}>
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
        <h3 className="text-lg font-semibold">Keranjang Belanja & Pengiriman</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Tutup</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notification && (
          <div className={`p-3 rounded-md text-sm ${notification.type === 'error' ? 'bg-red-100 text-red-700' : notification.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
            {notification.message}
          </div>
        )}
        {cart.length === 0 ? (
          <p className="text-gray-500">Keranjang kosong.</p>
        ) : (
          <>
            <h4 className="font-bold text-md mb-2 flex items-center gap-2"><ShoppingCart size={18} /> Isi Keranjang</h4>
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                <img src={item.gambar_produk} alt={item.nama_produk} className="w-16 h-16 rounded object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm line-clamp-1">{item.nama_produk}</h4>
                  <div className="text-xs text-gray-500">Rp{parseInt(item.harga_final).toLocaleString()}</div>
                  <div className="flex items-center mt-1 flex-wrap">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2 text-red-600">-</button>
                    <span className="px-2">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 text-green-600">+</button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-600 text-sm">Hapus</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-right text-sm font-semibold mt-2">Total Berat: {totalBerat} gram</div>

            <hr className="my-4" />

            <h4 className="font-bold text-md mb-2 flex items-center gap-2"><MapPin size={18} /> Alamat Pengiriman</h4>
            <div className="space-y-3">
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700">Provinsi</label>
                <select id="province" name="province" value={selectedProvince} onChange={handleProvinceChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                  <option value="">Pilih Provinsi</option>
                  {provinces.map(prov => (
                    <option key={prov.province_id} value={prov.province_id}>{prov.province}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Kota/Kabupaten</label>
                <select id="city" name="city" value={selectedCity} onChange={handleCityChange} disabled={!selectedProvince || cities.length === 0} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                  <option value="">Pilih Kota/Kabupaten</option>
                  {cities.map(city => (
                    <option key={city.city_id} value={city.city_id}>{city.type} {city.city_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Kode Pos</label>
                <input
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
                <textarea
                  id="detailAddress"
                  name="detailAddress"
                  rows="3"
                  value={destinationAddress.detailAddress}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Contoh: Desa Suka Maju, Jl. Merdeka No. 10"
                ></textarea>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Catatan Lokasi (Opsional)</label>
                <input
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

            <button
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
            </button>

            {shippingOptions.length > 0 && !isLoadingShipping && (
              <div className="mt-4">
                <h4 className="font-bold text-md mb-2 flex items-center gap-2"><Truck size={18} /> Jasa Pengiriman Tersedia</h4>
                <div className="space-y-2">
                  {shippingOptions.map((option, index) => (
                    <div
                      key={`${option.courier}-${option.service}-${index}`} 
                      className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${shippingCourier === `${option.courier.toUpperCase()} - ${option.service}` ? 'border-red-600 ring-1 ring-red-600' : 'border-gray-200'}`}
                      onClick={() => handleCourierSelect(option.cost[0].value, option.courier, option.service)}
                    >
                      <div>
                        <p className="font-semibold text-sm">{option.description} ({option.service})</p>
                        <p className="text-xs text-gray-500">Estimasi: {option.etd} hari</p>
                      </div>
                      <span className="font-bold text-red-600">Rp{option.cost[0].value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {shippingOptions.length === 0 && !isLoadingShipping && selectedCity && totalBerat > 0 && (
                <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md text-sm">
                    Tidak ada opsi pengiriman tersedia untuk tujuan ini atau berat produk tidak valid. Pastikan berat produk lebih dari 0.
                </div>
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
        <button
          onClick={() => handleCheckout(totalPembayaran)}
          disabled={cart.length === 0 || !shippingCourier || !selectedCity || !destinationAddress.detailAddress || !destinationAddress.postalCode || totalPembayaran < 1000} 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold"
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}

function isNormal(product) {
  return (!product.harga_promo || parseInt(product.harga_promo) >= parseInt(product.harga_produk));
}

export default function HalamanToko() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [allProducts, setAllProducts] = useState([]);

  // --- State untuk RajaOngkir ---
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
  const [notification, setNotification] = useState(null); // State untuk notifikasi
  const [isLoadingShipping, setIsLoadingShipping] = useState(false); // State untuk loading ongkir


  useEffect(() => {
    // Fetch produk
    axios.get(`${PRODUCT_API_BASE_URL}/api/produk`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setAllProducts(data);
      })
      .catch(err => {
        console.error('Gagal fetch produk:', err.message);
        setNotification({ message: 'Gagal memuat produk. Coba refresh halaman.', type: 'error' });
      });

    // --- Fetch provinsi RajaOngkir MELALUI PROXY ---
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
        setNotification({ message: 'Gagal mengambil data provinsi. Pastikan proxy server Vite berjalan dan konfigurasi RajaOngkir benar.', type: 'error' });
      });
  }, []); 

  // Fungsi fetchCities menggunakan PROXY
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

  // Fungsi fetchShippingCosts menggunakan PROXY
  const fetchShippingCosts = useCallback(async (weight, destinationCityId) => {
    setShippingOptions([]); 
    setShippingCost(0);
    setShippingCourier('');
    setIsLoadingShipping(true); // Mulai loading

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
          return { data: { rajaongkir: { status: { code: 500, description: `Failed to fetch for ${courier}` } } } }; // Return structured error
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
        setNotification({ message: "Tidak ada opsi pengiriman tersedia untuk tujuan ini atau berat produk tidak valid. Pastikan berat produk lebih dari 0.", type: 'warning' });
      } else {
        setNotification({ message: "Opsi pengiriman berhasil dimuat!", type: 'info' });
      }
    } catch (err) {
      console.error('Gagal fetch ongkos kirim:', err.message);
      setNotification({ message: "Gagal mengambil ongkos kirim. Pastikan proxy server Vite berjalan, API key dan konfigurasi RajaOngkir sudah benar, serta koneksi internet Anda stabil.", type: 'error' });
    } finally {
      setIsLoadingShipping(false); // Selesai loading
    }
  }, []);


  const addToCart = (product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1, berat_produk: product.berat_produk || 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQty = (productId, newQty) => {
    if (newQty < 1) return;
    setCart(cart.map((item) => item.id === productId ? { ...item, qty: newQty } : item));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
    setShippingCost(0);
    setShippingCourier('');
    setShippingOptions([]);
    setNotification(null); // Hapus notifikasi saat keranjang berubah
  };

  const handleCheckout = (totalPembayaran) => {
    if (totalPembayaran < 1000) {
      setNotification({ message: "Total pembayaran minimal Rp 1.000", type: 'error' });
      return;
    }
    if (!selectedCity || !shippingCourier || !destinationAddress.detailAddress || !destinationAddress.postalCode) {
      setNotification({ message: "Harap lengkapi detail pengiriman (provinsi, kota, alamat detail, kode pos) dan pilih jasa pengiriman.", type: 'error' });
      return;
    }

    axios.post('https://ahm.inspirasienergiprimanusa.com/api/midtrans/token', {
      total: totalPembayaran,
      items: cart.map(item => ({
        id: item.id,
        name: item.nama_produk,
        price: item.harga_final,
        quantity: item.qty
      })),
      shipping: {
        cost: shippingCost,
        courier: shippingCourier,
        address: {
          province_id: selectedProvince,
          city_id: selectedCity,
          detail_address: destinationAddress.detailAddress,
          postal_code: destinationAddress.postalCode,
          notes: destinationAddress.notes
        }
      }
    })
      .then(res => {
        const snapToken = res.data.token;

        if (!window.snap || !window.snap.pay) {
          setNotification({ message: "Midtrans belum siap. Silakan refresh halaman dan coba lagi.", type: 'error' });
          return;
        }

        window.snap.pay(snapToken, {
          onSuccess: result => {
            setNotification({ message: "Pembayaran sukses!", type: 'info' });
            setCart([]);
            setIsCartOpen(false);
            setShippingCost(0);
            setShippingCourier('');
            setSelectedProvince('');
            setSelectedCity('');
            setDestinationAddress({ detailAddress: '', postalCode: '', notes: '' });
            setShippingOptions([]);
          },
          onPending: result => {
            setNotification({ message: "Pembayaran tertunda. Menunggu pembayaran Anda.", type: 'warning' });
          },
          onError: result => {
            setNotification({ message: "Pembayaran gagal! Silakan coba lagi.", type: 'error' });
          },
          onClose: () => {
            setNotification({ message: "Anda menutup popup pembayaran tanpa menyelesaikan transaksi.", type: 'warning' });
          }
        });
      })
      .catch(err => {
        console.error('Gagal membuat token Midtrans:', err);
        const message = (err.response && err.response.data && err.response.data.message)
          ? err.response.data.message
          : err.message || "Terjadi kesalahan";
        setNotification({ message: `Gagal membuat token Midtrans: ${message}`, type: 'error' });
      });
  };

  const filterProducts = (product) => {
    const matchSearch = searchQuery ? product.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const matchKategori = selectedKategori ? product.kategori === selectedKategori : true;
    return matchSearch && matchKategori;
  };

  const promoProducts = allProducts.filter(isPromo).filter(filterProducts);
  const newProducts = allProducts.filter(isNew).filter(filterProducts);
  const normalProducts = allProducts.filter(p => !isPromo(p) && !isNew(p)).filter(filterProducts);

  return (
    <div className="w-full min-h-screen bg-white text-black font-sans">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end items-center mb-6">
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-700 hover:text-red-600">
            <ShoppingCart size={28} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center text-white font-semibold">
                {cart.length}
              </span>
            )}
          </button>
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

        <ProductSection title="Promo Spesial" icon={Flame} products={promoProducts} addToCart={addToCart} />
        <ProductSection title="Produk Baru" icon={Sparkles} products={newProducts} addToCart={addToCart} />
        <ProductSection title="Produk Lainnya" icon={null} products={normalProducts} addToCart={addToCart} />
      </div>

      <Keranjang
        cart={cart}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        handleCheckout={handleCheckout}
        // Props untuk RajaOngkir
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
        notification={notification} // Pass notification state
        setNotification={setNotification} // Pass setNotification function
        isLoadingShipping={isLoadingShipping} // Pass loading state
      />
    </div>
  );
}