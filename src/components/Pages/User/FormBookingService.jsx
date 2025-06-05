import React, { useState } from "react";

export default function EdukasiAndBooking() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    hp: "",
    jenisServis: "",
    tanggalBooking: "",
    lokasiPenjemputan: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const jenisServisOptions = [
    "Servis Ringan",
    "Servis Berat",
    "Ganti Oli",
    "Tune Up",
    "Perbaikan Elektrik",
  ];

  const validate = () => {
    const errs = {};
    if (!formData.nama.trim()) errs.nama = "Nama wajib diisi";
    if (!formData.email.trim()) errs.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Email tidak valid";
    if (!formData.hp.trim()) errs.hp = "Nomor HP wajib diisi";
    else if (!/^\d{8,15}$/.test(formData.hp)) errs.hp = "Nomor HP tidak valid (8-15 digit)";
    if (!formData.jenisServis) errs.jenisServis = "Pilih jenis servis";
    if (!formData.tanggalBooking) errs.tanggalBooking = "Pilih tanggal booking";
    if (!formData.lokasiPenjemputan) errs.lokasiPenjemputan = "Pilih lokasi penjemputan";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* LEFT: Edukasi Servis (60%) */}
      <div className="w-3/5 p-16 bg-white flex flex-col overflow-y-auto space-y-8 shadow-inner">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Edukasi Servis Motor</h1>
        <article className="prose prose-green max-w-none">
          <h2>Kenapa Servis Rutin Penting?</h2>
          <p>
            Servis rutin pada motor sangat penting untuk menjaga performa kendaraan Anda.
            Dengan melakukan servis secara berkala, berbagai komponen vital motor dapat
            dicek dan diperbaiki sebelum mengalami kerusakan parah yang dapat mengganggu
            kenyamanan berkendara.
          </p>
          <h2>Jenis-jenis Servis Motor</h2>
          <ul>
            <li><b>Servis Ringan:</b> Ganti oli, pengecekan rem, penggantian busi, dan pembersihan filter udara.</li>
            <li><b>Servis Berat:</b> Pemeriksaan dan perbaikan bagian mesin, sistem kelistrikan, dan transmisi.</li>
            <li><b>Ganti Oli:</b> Penggantian oli mesin untuk menjaga pelumasan optimal.</li>
            <li><b>Tune Up:</b> Penyetelan ulang komponen untuk meningkatkan efisiensi mesin.</li>
            <li><b>Perbaikan Elektrik:</b> Perbaikan sistem kelistrikan seperti aki, lampu, dan starter motor.</li>
          </ul>
          <h2>Tanda Motor Butuh Servis</h2>
          <p>
            Beberapa tanda motor perlu diservis antara lain suara mesin tidak normal, 
            rem kurang responsif, konsumsi bahan bakar meningkat, atau lampu indikator menyala.
          </p>
          <h2>Manfaat Servis Motor Berkala</h2>
          <p>
            Selain menjaga keamanan dan kenyamanan, servis berkala juga memperpanjang usia 
            motor dan menghemat biaya perbaikan di masa depan.
          </p>
          <h2>Tips Merawat Motor</h2>
          <ol>
            <li>Lakukan pengecekan rutin oli dan rem.</li>
            <li>Bersihkan motor secara teratur.</li>
            <li>Gunakan suku cadang asli.</li>
            <li>Jangan menunda servis meski terlihat baik-baik saja.</li>
          </ol>
        </article>
      </div>

      {/* RIGHT: Booking Form Card (40%) langsung beradu dengan kiri */}
      <div className="w-2/5 bg-white p-12 shadow-lg flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            Booking Servis Motor
          </h2>

          {submitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-5 py-3 rounded mb-6 text-center text-lg">
              Terima kasih, booking service Anda telah diterima.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {[
              { id: "nama", label: "Nama Lengkap", type: "text", placeholder: "Masukkan nama lengkap" },
              { id: "email", label: "Email", type: "email", placeholder: "contoh@mail.com" },
              { id: "hp", label: "Nomor HP", type: "tel", placeholder: "081234567890" },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} className="mb-6">
                <label htmlFor={id} className="block text-gray-700 text-lg font-medium mb-2">
                  {label} <span className="text-red-600">*</span>
                </label>
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`w-full px-5 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                    errors[id]
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                />
                {errors[id] && (
                  <p className="text-red-600 mt-1 text-sm">{errors[id]}</p>
                )}
              </div>
            ))}

            <div className="mb-6">
              <label
                htmlFor="jenisServis"
                className="block text-gray-700 text-lg font-medium mb-2"
              >
                Jenis Servis <span className="text-red-600">*</span>
              </label>
              <select
                id="jenisServis"
                name="jenisServis"
                value={formData.jenisServis}
                onChange={handleChange}
                className={`w-full px-5 py-3 border rounded-lg bg-white text-base focus:outline-none focus:ring-2 ${
                  errors.jenisServis
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              >
                <option value="">-- Pilih jenis servis --</option>
                {jenisServisOptions.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.jenisServis && (
                <p className="text-red-600 mt-1 text-sm">{errors.jenisServis}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="tanggalBooking"
                className="block text-gray-700 text-lg font-medium mb-2"
              >
                Tanggal Booking <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="tanggalBooking"
                name="tanggalBooking"
                value={formData.tanggalBooking}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-5 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                  errors.tanggalBooking
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
              {errors.tanggalBooking && (
                <p className="text-red-600 mt-1 text-sm">{errors.tanggalBooking}</p>
              )}
            </div>

            <div className="mb-8">
              <p className="text-gray-700 text-lg font-medium mb-3">
                Lokasi Penjemputan <span className="text-red-600">*</span>
              </p>
              <div className="flex space-x-10 text-base">
                {["Bengkel", "Rumah"].map((lokasi) => (
                  <label
                    key={lokasi}
                    className="inline-flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="lokasiPenjemputan"
                      value={lokasi}
                      checked={formData.lokasiPenjemputan === lokasi}
                      onChange={handleChange}
                      className="form-radio text-green-600"
                    />
                    <span className="ml-3">{lokasi}</span>
                  </label>
                ))}
              </div>
              {errors.lokasiPenjemputan && (
                <p className="text-red-600 mt-1 text-sm">{errors.lokasiPenjemputan}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition-colors duration-300"
            >
              Booking Sekarang
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
