import React, { useState } from "react";

const Spreperat = () => {
  // Data user dummy (readonly)
  const namaUser = "Budi Santoso";
  const jenisMotor = "Honda Vario 160";
  const jenisServis = "Ganti Oli";

  const [spareparts, setSpareparts] = useState([""]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSparepartChange = (index, value) => {
    const updated = [...spareparts];
    updated[index] = value;
    setSpareparts(updated);
  };

  const addSparepartField = () => {
    setSpareparts([...spareparts, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataDummy = {
      nama_user: namaUser,
      jenis_motor: jenisMotor,
      jenis_servis: jenisServis,
      spareparts: spareparts.filter((item) => item.trim() !== ""),
    };

    console.log("📦 Data Dummy:", dataDummy);
    setSuccessMessage("✅ Data servis berhasil disimpan (dummy)!");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 shadow rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Form Input Sparepart oleh Mekanik</h2>

      {successMessage && (
        <div className="mb-4 text-green-600 font-semibold text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama User */}
        <div>
          <label className="block font-medium mb-1">Nama User</label>
          <input
            type="text"
            value={namaUser}
            readOnly
            className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Jenis Motor */}
        <div>
          <label className="block font-medium mb-1">Jenis Motor</label>
          <input
            type="text"
            value={jenisMotor}
            readOnly
            className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Jenis Servis */}
        <div>
          <label className="block font-medium mb-1">Jenis Servis</label>
          <input
            type="text"
            value={jenisServis}
            readOnly
            className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Spareparts */}
        <div>
          <label className="block font-medium mb-1">Sparepart yang Diganti</label>
          {spareparts.map((value, index) => (
            <input
              key={index}
              type="text"
              value={value}
              onChange={(e) => handleSparepartChange(index, e.target.value)}
              placeholder={`Sparepart ${index + 1}`}
              className="w-full border rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring"
              required
            />
          ))}
          <button
            type="button"
            onClick={addSparepartField}
            className="text-sm text-blue-600 hover:underline"
          >
            + Tambah Sparepart
          </button>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Simpan Data (Dummy)
          </button>
        </div>
      </form>
    </div>
  );
};

export default Spreperat;
