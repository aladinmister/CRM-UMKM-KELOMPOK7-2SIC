import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const {
    nama_produk,
    kategori,
    harga_produk,
    harga_promo,
    stock_produk,
    gambar_produk,
    rating_produk,
    terjual
  } = product;

  const displayName = nama_produk || 'Produk Tidak Dikenal';
  const displayKategori = kategori || 'Kategori Tidak Ada';
  const hargaAsli = Number(harga_produk || 0);
  const hargaDiskon = harga_promo ? Number(harga_promo) : null;
  const diskonPersen = hargaDiskon
    ? Math.round(((hargaAsli - hargaDiskon) / hargaAsli) * 100)
    : 0;

  const displayRating = parseFloat(rating_produk) || 0;
  const displayTerjual = terjual ?? 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-3 w-full">
      <div className="w-full h-40 bg-white rounded overflow-hidden flex items-center justify-center mb-3">
        {gambar_produk ? (
          <img
            src={gambar_produk}
            alt={displayName}
            className="object-contain h-full w-full"
          />
        ) : (
          <span className="text-gray-400 text-sm">Tidak ada gambar</span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">{displayName}</h3>

      {/* Rating dan Terjual */}
      <div className="text-xs text-yellow-600 flex items-center space-x-1 mb-1">
        <span>⭐ {displayRating.toFixed(1)}</span>
        <span className="text-gray-500">| Terjual {displayTerjual}</span>
      </div>

      {/* Harga */}
      <div className="mb-1">
        {hargaDiskon ? (
          <>
            <div className="text-sm text-gray-400 line-through">
              Rp {hargaAsli.toLocaleString('id-ID')}
            </div>
            <div className="text-red-600 font-bold text-base">
              Rp {hargaDiskon.toLocaleString('id-ID')}{' '}
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded ml-1">
                -{diskonPersen}%
              </span>
            </div>
          </>
        ) : (
          <div className="text-red-600 font-bold text-base">
            Rp {hargaAsli.toLocaleString('id-ID')}
          </div>
        )}
      </div>

      {/* Tombol Beli Sekarang */}
      <button
        onClick={() => navigate('/toko')}
        className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded flex items-center justify-center space-x-2 transition"
      >
        <span>🛒</span>
        <span>Beli Sekarang</span>
      </button>
    </div>
  );
};

export default ProductCard;
