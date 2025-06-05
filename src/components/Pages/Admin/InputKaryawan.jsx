// InputKaryawan.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InputKaryawan({ tambahKaryawan }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [posisi, setPosisi] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kirim data ke parent lewat props
    tambahKaryawan({ nama, email, posisi });

    // Reset inputan
    setNama("");
    setEmail("");
    setPosisi("");

    alert("Data karyawan berhasil ditambahkan");

    // Navigasi ke halaman datakaryawan
    navigate("/datakaryawan");
  };

  return (
    <div className="bg-white shadow rounded p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Input Data Karyawan
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Nama</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Masukkan nama karyawan"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Masukkan email karyawan"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Posisi</label>
          <input
            type="text"
            value={posisi}
            onChange={(e) => setPosisi(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Masukkan posisi karyawan"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Tambah Karyawan
        </button>
      </form>
    </div>
  );
}
