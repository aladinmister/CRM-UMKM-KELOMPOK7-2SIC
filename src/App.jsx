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

// User
const MainLayoutUser = lazy(() => import('./components/Pages/User/MainLayoutUser'));
const DashboardUser = lazy(() => import('./components/Pages/User/DashboardUser'));
const ProductCard = lazy(() => import('./components/Pages/User/ProductCard'));
const FormBookingService = lazy(() => import('./components/Pages/User/FormBookingService'));
const HalamanToko = lazy(() => import('./components/Pages/User/HalamanToko'));
const Keranjang = lazy(() => import('./components/Pages/User/Keranjang'));
const Contact = lazy(() => import('./components/Pages/User/Contact'));

// 🔄 Loading Component with AHM rotating
function LoadingAHM() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-6xl font-bold text-red-600 animate-spin origin-center">
        AHM
      </div>
    </div>
  );
}

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
          <Route path="/dashboardUser" element={<DashboardUser />} />
          <Route path="/productcard" element={<ProductCard />} />
          <Route path="/booking" element={<FormBookingService />} />
           <Route path="/contact" element={<Contact />} />
          <Route path="/toko" element={<HalamanToko addToCart={addToCart} cart={cart} />} />
          <Route path="/keranjang" element={<Keranjang cart={cart} />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
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
