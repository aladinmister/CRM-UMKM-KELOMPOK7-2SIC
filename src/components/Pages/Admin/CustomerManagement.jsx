import React, { useState } from "react";
import DataTable from "react-data-table-component";

const initialCustomers = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@mail.com",
    phone: "081234567890",
    active: true,
  },
  {
    id: 2,
    name: "Siti Aminah",
    email: "siti@mail.com",
    phone: "089876543210",
    active: false,
  },
  {
    id: 3,
    name: "Andi Wijaya",
    email: "andi@mail.com",
    phone: "081299988877",
    active: true,
  },
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    active: true,
  });
  const [filterText, setFilterText] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddCustomer = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Semua field wajib diisi!");
      return;
    }
    const newCustomer = {
      id: customers.length + 1,
      ...formData,
    };
    setCustomers([...customers, newCustomer]);
    setFormData({ name: "", email: "", phone: "", active: true });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus pelanggan ini?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  // Filter data berdasarkan filterText di kolom name/email/phone
  const filteredCustomers = customers.filter(
    (cust) =>
      cust.name.toLowerCase().includes(filterText.toLowerCase()) ||
      cust.email.toLowerCase().includes(filterText.toLowerCase()) ||
      cust.phone.includes(filterText)
  );

  // Definisi kolom untuk DataTable
  const columns = [
    {
      name: "Nama",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Telepon",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.active ? "Aktif" : "Tidak Aktif"),
      sortable: true,
      cell: (row) =>
        row.active ? (
          <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Aktif
          </span>
        ) : (
          <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Tidak Aktif
          </span>
        ),
      center: true,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="space-x-2">
          <button
            className="text-blue-600 hover:text-blue-900 font-semibold"
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
      center: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-semibold mb-6">Management Pelanggan</h1>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {showForm ? "Batal Tambah Pelanggan" : "Tambah Pelanggan"}
        </button>

        {showForm && (
          <div className="mb-6 p-4 border border-gray-300 rounded shadow-sm bg-gray-50">
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Nama pelanggan"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Email pelanggan"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Telepon</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Nomor telepon"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  id="activeCheckbox"
                  className="mr-2"
                />
                <label htmlFor="activeCheckbox" className="font-medium">
                  Aktif
                </label>
              </div>
            </div>
            <button
              onClick={handleAddCustomer}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Simpan
            </button>
          </div>
        )}

        <div className="bg-white rounded shadow">
          <div className="mb-4 px-4 pt-4">
            <input
              type="text"
              placeholder="Cari nama, email, atau telepon..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <DataTable
            columns={columns}
            data={filteredCustomers}
            pagination
            highlightOnHover
            noHeader
            striped
            responsive
            persistTableHead
            noDataComponent={<div className="p-4 text-center text-gray-500">Tidak ada data pelanggan</div>}
          />
        </div>
      </div>
    </div>
  );
}
