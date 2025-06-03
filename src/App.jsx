import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';

// Lazy load pages
const Dashboard = lazy(() => import('./components/Dashboard'));
const SalesManagement = lazy(() => import('./components/Pages/SalesManagement'));
const ProdukManagement = lazy(() => import('./components/Pages/ProdukManagement'));
const UploadProduk = lazy(() => import('./components/Pages/UploadProduk'));
const CustomerManagement = lazy(() => import('./components/Pages/CustomerManagement'));
const Laporan = lazy(() => import('./components/Pages/Booking'));
const DataKaryawan = lazy(() => import('./components/Pages/DataKaryawan'));
const InputKaryawan = lazy(() => import('./components/Pages/InputKaryawan'));

function App() {
  const [produkList, setProdukList] = useState([]);
  const [karyawanList, setKaryawanList] = useState([]);

  // Fungsi menambah produk baru
  const tambahProduk = (produkBaru) => {
    setProdukList((prev) => [...prev, { id: prev.length + 1, ...produkBaru }]);
  };

  // Fungsi menambah karyawan baru
  const tambahKaryawan = (dataBaru) => {
    setKaryawanList((prev) => [...prev, { id: prev.length + 1, ...dataBaru }]);
  };

  return (
    <Suspense fallback={<div className="p-6">Memuat halaman...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/penjualan" element={<SalesManagement />} />

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
