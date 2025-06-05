import React, { useState } from 'react';
import { ShoppingCart, Star, Search } from 'lucide-react';

function Keranjang({ cart, updateQty, removeFromCart, isOpen, onClose }) {
  const totalHarga = cart.reduce(
    (acc, item) => acc + (item.promoPrice || item.price) * item.qty,
    0
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg flex flex-col z-50"
      style={{ boxShadow: '-4px 0 10px rgba(0,0,0,0.1)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Keranjang Belanja</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Tutup keranjang"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Isi keranjang */}
      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Keranjang kosong. Silakan tambah produk.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.id} className="flex py-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-md object-cover"
                />
                <div className="ml-4 flex flex-col flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm font-medium text-gray-900">
                      Rp{((item.promoPrice || item.price) * item.qty).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">{item.category}</p>

                  {/* Quantity control */}
                  <div className="mt-2 flex items-center space-x-3">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className={`px-2 py-1 border rounded text-gray-700 font-semibold ${
                        item.qty <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                      }`}
                    >
                      –
                    </button>
                    <span className="text-gray-800 font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="px-2 py-1 border rounded text-gray-700 font-semibold hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>

                  {/* Hapus */}
                  <div className="mt-auto flex justify-end text-sm text-gray-600">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer total dan checkout */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>Rp{totalHarga.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Termasuk pajak dan ongkir</p>
          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

const categories = [
  { name: 'Semua', image: 'https://source.unsplash.com/100x100/?tools' },
  { name: 'Oli', image: 'https://source.unsplash.com/100x100/?oil' },
  { name: 'Aki', image: 'https://source.unsplash.com/100x100/?battery' },
  { name: 'Ban', image: 'https://source.unsplash.com/100x100/?tire' },
  { name: 'Kampas Rem', image: 'https://source.unsplash.com/100x100/?brake' },
];

const allProducts = [
  {
    id: 1,
    name: 'Oli Mesin Promo',
    category: 'Oli',
    price: 40000,
    promoPrice: 30000,
    image: 'https://source.unsplash.com/400x300/?oil',
    sold: 150,
    rating: 4.5,
    stock: 20,
  },
  {
    id: 2,
    name: 'Aki Kering Promo',
    category: 'Aki',
    price: 350000,
    promoPrice: 280000,
    image: 'https://source.unsplash.com/400x300/?battery',
    sold: 100,
    rating: 4.8,
    stock: 10,
  },
  {
    id: 3,
    name: 'Ban Motor Tubeless',
    category: 'Ban',
    price: 250000,
    image: 'https://source.unsplash.com/400x300/?motorcycle-tire',
    sold: 70,
    rating: 4.2,
    stock: 15,
  },
  {
    id: 4,
    name: 'Kampas Rem Belakang',
    category: 'Kampas Rem',
    price: 70000,
    image: 'https://source.unsplash.com/400x300/?brake',
    sold: 60,
    rating: 4.1,
    stock: 25,
  },
  {
    id: 5,
    name: 'Oli Mesin Standar',
    category: 'Oli',
    price: 45000,
    image: 'https://source.unsplash.com/400x300/?engine-oil',
    sold: 90,
    rating: 4.3,
    stock: 18,
  },
  {
    id: 6,
    name: 'Aki Basah',
    category: 'Aki',
    price: 300000,
    image: 'https://source.unsplash.com/400x300/?car-battery',
    sold: 50,
    rating: 4.0,
    stock: 12,
  },
  {
    id: 7,
    name: 'Ban Offroad',
    category: 'Ban',
    price: 400000,
    image: 'https://source.unsplash.com/400x300/?offroad-tire',
    sold: 40,
    rating: 4.6,
    stock: 8,
  },
  {
    id: 8,
    name: 'Kampas Rem Depan',
    category: 'Kampas Rem',
    price: 75000,
    image: 'https://source.unsplash.com/400x300/?brake-pad',
    sold: 55,
    rating: 4.4,
    stock: 20,
  },
];

export default function HalamanToko() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Tambah produk ke keranjang, jika sudah ada qty +1, kalau belum ada set qty 1
  const addToCart = (product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  // Update qty di keranjang (jaga qty minimal 1)
  const updateQty = (productId, newQty) => {
    if (newQty < 1) return;
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  // Hapus produk dari keranjang
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const filteredProducts = allProducts.filter(
    (p) =>
      (selectedCategory === 'Semua' || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans relative">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Toko Bengkel</h1>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:text-gray-900"
            aria-label="Buka keranjang"
          >
            <ShoppingCart size={28} />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="flex items-center bg-white shadow rounded-lg overflow-hidden w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 text-sm outline-none"
              placeholder="Cari produk..."
            />
            <div className="p-3 text-gray-500">
              <Search size={20} />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Kategori</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex flex-col items-center space-y-1 min-w-[80px] px-2 py-1 rounded-lg border ${
                  selectedCategory === cat.name
                    ? 'border-blue-600 bg-blue-100 text-blue-700'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-10 w-10 object-cover rounded-full"
                />
                <span className="text-sm">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover rounded-md mb-3"
              />
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                {product.promoPrice && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                    Promo
                  </span>
                )}
              </div>
              <div className="mb-1 text-gray-700 font-semibold">
                Rp{(product.promoPrice || product.price).toLocaleString()}
                {product.promoPrice && (
                  <span className="line-through text-gray-400 text-sm ml-2">
                    Rp{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center text-yellow-400 mb-3">
                <Star size={16} />
                <span className="ml-1 text-sm text-gray-600">
                  {product.rating.toFixed(1)}
                </span>
                <span className="ml-auto text-sm text-gray-600">
                  {product.sold} terjual
                </span>
              </div>
              <button
                onClick={() => addToCart(product)}
                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                Tambah ke Keranjang
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Keranjang sebelah kanan */}
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
