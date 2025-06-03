import React, { useState } from "react";

export default function UploadProduk({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.stock || !formData.price) {
      alert("Semua kolom harus diisi.");
      return;
    }

    const newProduct = {
      ...formData,
      stock: parseInt(formData.stock),
      price: parseFloat(formData.price),
    };

    // Kirim data ke parent / simpan ke database
    if (onSubmit) {
      onSubmit(newProduct);
    }

    // Reset form
    setFormData({ name: "", category: "", stock: "", price: "", active: true });
    alert("Produk berhasil ditambahkan.");
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Form Input Sparepart Bengkel</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Nama Sparepart</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Filter Udara"
            className="w-full px-3 py-2 border rounded focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Kategori</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Contoh: Mesin, Rem, Elektrik"
            className="w-full px-3 py-2 border rounded focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Jumlah Stok</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            placeholder="Masukkan stok"
            className="w-full px-3 py-2 border rounded focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Harga</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            placeholder="Masukkan harga"
            className="w-full px-3 py-2 border rounded focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="mr-2"
            />
            Tampilkan di sistem
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Simpan Sparepart
        </button>
      </form>
    </div>
  );
}
