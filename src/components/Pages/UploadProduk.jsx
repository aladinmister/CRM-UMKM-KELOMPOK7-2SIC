import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadProduk({ tambahProduk }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    supplier: "",
    description: "",
    active: true,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.stock || !form.price) {
      alert("Semua kolom wajib diisi");
      return;
    }
    tambahProduk({
      ...form,
      stock: parseInt(form.stock),
      price: parseFloat(form.price),
    });
    navigate("/produk");
  };

  return (
    <div className="bg-white shadow rounded p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Tambah Produk Baru
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Nama Produk - full width */}
        <div className="col-span-2">
          <label className="block mb-1 font-medium text-gray-700">Nama Produk</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan nama produk"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Kategori</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Masukkan kategori produk"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Supplier */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Supplier (Opsional)</label>
          <input
            type="text"
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
            placeholder="Masukkan nama supplier"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Stok */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Stok</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Masukkan stok produk"
            min="0"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Harga */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Harga</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Masukkan harga produk"
            min="0"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Deskripsi - full width */}
        <div className="col-span-2">
          <label className="block mb-1 font-medium text-gray-700">Deskripsi (Opsional)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Masukkan deskripsi produk"
            rows="3"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Checkbox Aktif - full width */}
        <div className="col-span-2 flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            className="mr-2"
            id="activeCheckbox"
          />
          <label htmlFor="activeCheckbox" className="font-medium text-gray-700">
            Aktif
          </label>
        </div>

        {/* Button submit - full width */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Simpan Produk
          </button>
        </div>
      </form>
    </div>
  );
}
