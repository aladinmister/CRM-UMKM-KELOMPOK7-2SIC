import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';


// Admin
const Dashboard = lazy(() => import('./components/DashboardAdmin'));
const Login = lazy(() => import('./components/Pages/User/Login'));
const Register = lazy(() => import('./components/Pages/User/Register'));
const DashboardAdmin = lazy(() => import('./components/DashboardAdmin'));
const SalesManagement = lazy(() => import('./components/Pages/Admin/SalesManagement'));
const ProdukManagement = lazy(() => import('./components/Pages/Admin/ProdukManagement'));
const UploadProduk = lazy(() => import('./components/Pages/Admin/UploadProduk'));
const CustomerManagement = lazy(() => import('./components/Pages/Admin/CustomerManagement'));
const Laporan = lazy(() => import('./components/Pages/Admin/Booking'));
const DataKaryawan = lazy(() => import('./components/Pages/Admin/DataKaryawan'));
const InputKaryawan = lazy(() => import('./components/Pages/Admin/InputKaryawan'));
const ServisChart = lazy(() => import('./components/Pages/Admin/ServisChart'));
const TransaksiAdmin = lazy(() => import('./components/Pages/Admin/TransaksiAdmin'));


// User
const MainLayoutUser = lazy(() => import('./components/Pages/User/MainLayoutUser'));
const DashboardUser = lazy(() => import('./components/Pages/User/DashboardUser'));
const ProductCard = lazy(() => import('./components/Pages/User/ProductCard'));
const FormBookingService = lazy(() => import('./components/Pages/User/FormBookingService'));
const HalamanToko = lazy(() => import('./components/Pages/User/HalamanToko'));
const Keranjang = lazy(() => import('./components/Pages/User/Keranjang'));
const Contact = lazy(() => import('./components/Pages/User/Contact'));

// 🔧 Custom Loading Component: Obeng + Gear SVG
function LoadingAHM() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-red-600">
      {/* SVG Icon Gear + Wrench */}
      <svg
        className="w-20 h-20 mb-4 animate-spin-slow text-red-600"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M19.14,12.94a7.13,7.13,0,0,0,.06-.94,7.13,7.13,0,0,0-.06-.94l2.11-1.65a.5.5,0,0,0,.12-.63l-2-3.46a.5.5,0,0,0-.6-.22l-2.49,1a6.92,6.92,0,0,0-1.63-.94L14,2.5a.5.5,0,0,0-.5-.5H10.5a.5.5,0,0,0-.5.5l-.38,2.56a6.92,6.92,0,0,0-1.63.94l-2.49-1a.5.5,0,0,0-.6.22l-2,3.46a.5.5,0,0,0,.12.63l2.11,1.65a7.13,7.13,0,0,0-.06.94,7.13,7.13,0,0,0,.06.94L2.52,14.59a.5.5,0,0,0-.12.63l2,3.46a.5.5,0,0,0,.6.22l2.49-1a6.92,6.92,0,0,0,1.63.94L10,21.5a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5l.38-2.56a6.92,6.92,0,0,0,1.63-.94l2.49,1a.5.5,0,0,0,.6-.22l2-3.46a.5.5,0,0,0-.12-.63ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        <path d="M21.72,2.28a1,1,0,0,0-1.41,0l-2.82,2.82,1.41,1.41L21.72,3.69A1,1,0,0,0,21.72,2.28Z" />
      </svg>

      <h1 className="text-2xl font-bold tracking-wide">AHM SERVICE</h1>
      <p className="text-sm text-gray-500">Memuat halaman, mohon tunggu...</p>
    </div>
  );
}

// Tambahkan animasi spin custom
const styles = document.createElement("style");
styles.innerHTML = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
`;
document.head.appendChild(styles);

function App() {
  const [produkList, setProdukList] = useState([]);
  const [karyawanList, setKaryawanList] = useState([]);
  const [cart, setCart] = useState([]);

  const tambahProduk = (produkBaru) => {
    setProdukList((prev) => [...prev, { id: prev.length + 1, ...produkBaru }]);
  };

  const tambahKaryawan = (dataBaru) => {
    setKaryawanList((prev) => [...prev, { id: prev.length + 1, ...dataBaru }]);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  return (
    <Suspense fallback={<LoadingAHM />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayoutUser />}>
          <Route path="/" element={<DashboardUser />} />
          <Route path="/productcard" element={<ProductCard />} />
          <Route path="/booking" element={<FormBookingService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/toko" element={<HalamanToko addToCart={addToCart} cart={cart} />} />
          <Route path="/keranjang" element={<Keranjang cart={cart} />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboardAdmin" element={<Dashboard />} />
            <Route path="/transaksiAdmin" element={<TransaksiAdmin />} />
            <Route path="/Servischart" element={<ServisChart />} />
          <Route path="/penjualan" element={<SalesManagement />} />
          <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
          <Route path="/produk">
            <Route index element={<ProdukManagement produkList={produkList} />} />
            <Route path="tambah" element={<UploadProduk tambahProduk={tambahProduk} />} />
          </Route>
          <Route path="/pelanggan" element={<CustomerManagement />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/datakaryawan">
            <Route index element={<DataKaryawan karyawanList={karyawanList} />} />
            <Route path="inputdatakaryawan" element={<InputKaryawan tambahKaryawan={tambahKaryawan} />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
