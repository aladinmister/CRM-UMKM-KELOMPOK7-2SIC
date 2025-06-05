import React, { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

export default function ProdukManagement({ produkList }) {
  const [filterText, setFilterText] = useState("");

  const formatCurrency = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num);

  // Filter data berdasarkan filterText di nama atau kategori
  const filteredProduk = produkList.filter(
    (p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase()) ||
      p.category.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "Nama",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Kategori",
      selector: (row) => row.category,
      sortable: true,
      wrap: true,
    },
    {
      name: "Stok",
      selector: (row) => row.stock,
      sortable: true,
      right: true,
    },
    {
      name: "Harga",
      selector: (row) => row.price,
      sortable: true,
      right: true,
      cell: (row) => formatCurrency(row.price),
    },
    {
      name: "Status",
      selector: (row) => (row.active ? "Aktif" : "Nonaktif"),
      sortable: true,
      center: true,
      cell: (row) =>
        row.active ? (
          <span className="text-green-700 bg-green-100 px-2 py-1 rounded text-sm">
            Aktif
          </span>
        ) : (
          <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded text-sm">
            Nonaktif
          </span>
        ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <Link
            to="/produk/tambah"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Tambah Produk
          </Link>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari nama atau kategori produk..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredProduk}
          pagination
          highlightOnHover
          noHeader
          striped
          responsive
          persistTableHead
          noDataComponent={
            <div className="p-4 text-center text-gray-500">Belum ada produk</div>
          }
        />
      </div>
    </div>
  );
}
