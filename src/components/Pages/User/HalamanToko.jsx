import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Search, Flame, Sparkles, Heart, PlusCircle, CreditCard } from 'lucide-react';

const kategoriList = [
  { label: 'Oli', icon: '🛢️' },
  { label: 'Ban', icon: '🛞' },
  { label: 'Sparepart', icon: '🔩' },
  { label: 'Aki', icon: '🔋' },
  { label: 'Servis', icon: '🧰' },
  { label: 'Lampu', icon: '💡' },
];

function Carousel() {
  const [current, setCurrent] = useState(0);
  const slides = [
    'https://www.naikmotor.com/wp-content/uploads/2017/02/Spare_Part_Honda.jpg',
    'https://hondababel.com/wp-content/uploads/2018/04/honda-genuine-parts.jpg',
    'https://source.unsplash.com/1200x400/?engine,bike',
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

function ProductSection({ title, icon: Icon, products, addToCart }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="text-red-600" />}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-2 flex flex-col">
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-2" />
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
            <div className="text-xs text-gray-500 flex items-center mb-1">
              <Star size={14} className="text-yellow-400 mr-1" />
              {product.rating.toFixed(1)} | Terjual {product.sold}
            </div>
            <div className="text-red-600 font-bold text-sm mb-2">
              {product.promoPrice ? `Rp${product.promoPrice.toLocaleString()}` : `Rp${product.price.toLocaleString()}`}
            </div>
            <div className="flex justify-between items-center mt-auto gap-2">
              <button className="text-gray-500 hover:text-red-500"><Heart size={20} /></button>
              <button onClick={() => addToCart(product)} className="text-gray-600 hover:text-red-600"><PlusCircle size={20} /></button>
              <button className="ml-auto text-white bg-green-600 hover:bg-green-700 text-xs px-3 py-1 rounded flex items-center gap-1"><CreditCard size={14} /> Beli</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Keranjang({ cart, updateQty, removeFromCart, isOpen, onClose }) {
  const totalHarga = cart.reduce((acc, item) => acc + (item.promoPrice || item.price) * item.qty, 0);

  return (
    <div className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 flex flex-col`}>
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
        <h3 className="text-lg font-semibold">Keranjang</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Tutup</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? <p className="text-gray-500">Keranjang kosong.</p> : cart.map(item => (
          <div key={item.id} className="flex items-center gap-3 border-b pb-3">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
              <div className="text-xs text-gray-500">Rp{(item.promoPrice || item.price).toLocaleString()}</div>
              <div className="flex items-center mt-1 flex-wrap">
                <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2 text-red-600">-</button>
                <span className="px-2">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 text-green-600">+</button>
                <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-600 text-sm">Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex-shrink-0">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold">Total:</span>
          <span className="text-lg font-bold text-red-600">Rp{totalHarga.toLocaleString()}</span>
        </div>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold">Bayar Sekarang</button>
      </div>
    </div>
  );
}

export default function HalamanToko() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState('');

  // Ganti ini dengan daftar produk nyata
  const allProducts = [
    {
      id: 1,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
      {
      id: 4,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
      {
      id: 5,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
      {
      id: 6,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
      {
      id: 7,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
      {
      id: 8,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
      {
      id: 9,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
      {
      id: 10,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
      {
      id: 11,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
      {
      id: 12,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
      {
      id: 13,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
      {
      id: 1,
      name: 'Oli Mesin Premium',
      category: 'Promo',
      kategori: 'Oli',
      price: 50000,
      promoPrice: 40000,
      image: 'https://source.unsplash.com/400x300/?oil',
      sold: 122,
      rating: 4.7,
      stock: 10,
    },
    {
      id: 2,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
     {
      id: 14,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
     {
      id: 15,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
     {
      id: 16,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
     {
      id: 17,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
     {
      id: 18,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
     {
      id: 19,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
     {
      id: 20,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
     {
      id: 21,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
     {
      id: 22,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
     {
      id: 23,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
     {
      id: 24,
      name: 'Ban Motor Sport',
      category: 'Baru',
      kategori: 'Ban',
      price: 300000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,tire',
      sold: 95,
      rating: 4.5,
      stock: 8,
    },
    {
      id: 25,
      name: 'Lampu LED Motor',
      category: 'Biasa',
      kategori: 'Lampu',
      price: 75000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,light',
      sold: 150,
      rating: 4.6,
      stock: 20,
    },
    {
      id: 26,
      name: 'Lampu LED Motor',
      category: 'Biasa',
      kategori: 'Lampu',
      price: 75000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,light',
      sold: 150,
      rating: 4.6,
      stock: 20,
    },
      {
      id: 27,
      name: 'Lampu LED Motor',
      category: 'Biasa',
      kategori: 'Lampu',
      price: 75000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,light',
      sold: 150,
      rating: 4.6,
      stock: 20,
    },
      {
      id: 28,
      name: 'Lampu LED Motor',
      category: 'Biasa',
      kategori: 'Lampu',
      price: 75000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,light',
      sold: 150,
      rating: 4.6,
      stock: 20,
    },
      {
      id: 29,
      name: 'Lampu LED Motor',
      category: 'Biasa',
      kategori: 'Lampu',
      price: 75000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,light',
      sold: 150,
      rating: 4.6,
      stock: 20,
    },
      {
      id: 30,
      name: 'Lampu LED Motor',
      category: 'Biasa',
      kategori: 'Lampu',
      price: 75000,
      promoPrice: null,
      image: 'https://source.unsplash.com/400x300/?motorcycle,light',
      sold: 150,
      rating: 4.6,
      stock: 20,
    },
    // Tambahkan lebih banyak produk berbeda di sini...
  ];

  const addToCart = (product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQty = (productId, newQty) => {
    if (newQty < 1) return;
    setCart(cart.map((item) => item.id === productId ? { ...item, qty: newQty } : item));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const filterProducts = (categoryName) => (product) => {
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = selectedKategori ? product.kategori === selectedKategori : true;
    return product.category === categoryName && matchSearch && matchKategori;
  };

  const promoProducts = allProducts.filter(filterProducts('Promo'));
  const newProducts = allProducts.filter(filterProducts('Baru'));
  const normalProducts = allProducts.filter(filterProducts('Biasa'));

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
      />
    </div>
  );
}
