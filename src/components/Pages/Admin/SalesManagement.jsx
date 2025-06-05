import React, { useState } from "react";
import DataTable from "react-data-table-component";

const dummyCustomers = [
  { id: 1, name: "Budi Santoso" },
  { id: 2, name: "Siti Aminah" },
  { id: 3, name: "Andi Wijaya" },
];

const initialSales = [
  {
    id: 1,
    invoice: "INV-001",
    customerId: 1,
    date: "2025-05-10",
    total: 1500000,
    status: "Lunas",
  },
  {
    id: 2,
    invoice: "INV-002",
    customerId: 2,
    date: "2025-05-11",
    total: 250000,
    status: "Belum Lunas",
  },
];

function formatCurrency(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(num);
}

export default function SalesManagement() {
  const [sales, setSales] = useState(initialSales);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    invoice: "",
    customerId: "",
    date: "",
    total: "",
    status: "Belum Lunas",
  });
  const [filterText, setFilterText] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSale = () => {
    if (
      !formData.invoice ||
      !formData.customerId ||
      !formData.date ||
      !formData.total
    ) {
      alert("Semua field wajib diisi!");
      return;
    }
    const newSale = {
      id: sales.length + 1,
      invoice: formData.invoice,
      customerId: Number(formData.customerId),
      date: formData.date,
      total: Number(formData.total),
      status: formData.status,
    };
    setSales([...sales, newSale]);
    setFormData({
      invoice: "",
      customerId: "",
      date: "",
      total: "",
      status: "Belum Lunas",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus penjualan ini?")) {
      setSales(sales.filter((s) => s.id !== id));
    }
  };

  const getCustomerName = (id) => {
    const cust = dummyCustomers.find((c) => c.id === id);
    return cust ? cust.name : "-";
  };

  const filteredSales = sales.filter((s) => {
    const customerName = getCustomerName(s.customerId);
    return (
      s.invoice.toLowerCase().includes(filterText.toLowerCase()) ||
      customerName.toLowerCase().includes(filterText.toLowerCase()) ||
      s.date.toLowerCase().includes(filterText.toLowerCase()) ||
      s.status.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  const columns = [
    {
      name: "Invoice",
      selector: (row) => row.invoice,
      sortable: true,
    },
    {
      name: "Pelanggan",
      selector: (row) => getCustomerName(row.customerId),
      sortable: true,
    },
    {
      name: "Tanggal",
      selector: (row) => row.date,
      sortable: true,
      sortFunction: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      name: "Total",
      selector: (row) => row.total,
      sortable: true,
      right: true,
      cell: (row) => formatCurrency(row.total),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      center: true,
      cell: (row) => {
        if (row.status === "Lunas") {
          return (
            <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Lunas
            </span>
          );
        } else if (row.status === "Belum Lunas") {
          return (
            <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Belum Lunas
            </span>
          );
        } else {
          return (
            <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              Batal
            </span>
          );
        }
      },
    },
    {
      name: "Aksi",
      center: true,
      cell: (row) => (
        <div className="space-x-4">
          <button
            className="text-indigo-600 hover:text-indigo-900 font-semibold"
            onClick={() => alert("Fitur Edit belum tersedia")}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-900 font-semibold"
            onClick={() => handleDelete(row.id)}
          >
            Hapus
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "130px",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header with title and button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Management Penjualan</h1>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            {showForm ? "Batal Tambah Penjualan" : "Tambah Penjualan"}
          </button>
        </div>

        {/* Search input below */}
     {/* Search input below */}
<div className="mb-6">
  <input
    type="text"
    placeholder="Cari invoice, pelanggan, tanggal, status..."
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
    className="w-64 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />
</div>


        {/* Form tambah data */}
        {showForm && (
          <div className="mb-6 p-4 border border-gray-300 rounded shadow-sm bg-gray-50">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Nomor Invoice</label>
                <input
                  type="text"
                  name="invoice"
                  value={formData.invoice}
                  onChange={handleInputChange}
                  placeholder="Misal: INV-003"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Pelanggan</label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">-- Pilih Pelanggan --</option>
                  {dummyCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Tanggal</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Total (Rp)</label>
                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  onChange={handleInputChange}
                  placeholder="Jumlah total penjualan"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  min="0"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Batal">Batal</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddSale}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Simpan
            </button>
          </div>
        )}

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredSales}
          pagination
          highlightOnHover
          pointerOnHover
          noDataComponent="Tidak ada data penjualan"
          responsive
          striped
          dense
        />
      </div>
    </div>
  );
}
