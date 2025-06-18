import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FormBookingService() {
  const [formData, setFormData] = useState({
    nama_customer: "",
    nomor_hp: "",
    jenis_servis: "",
    nama_karyawan: "Belum Ditentukan",
    tanggal_booking: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const jenisServisOptions = [
    "Servis Ringan",
    "Servis Berat",
    "Ganti Oli",
    "Tune Up",
    "Perbaikan Elektrik",
  ];

  const validate = () => {
    const errs = {};
    if (!formData.nama_customer.trim()) errs.nama_customer = "Nama wajib diisi";
    if (!formData.nomor_hp.trim()) errs.nomor_hp = "Nomor HP wajib diisi";
    else if (!/^\d{8,15}$/.test(formData.nomor_hp)) errs.nomor_hp = "Nomor HP tidak valid (8-15 digit)";
    if (!formData.jenis_servis) errs.jenis_servis = "Pilih jenis servis";
    if (!formData.tanggal_booking) errs.tanggal_booking = "Pilih tanggal booking";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post("https://ahm.inspirasienergiprimanusa.com/api/bookings", formData);
      setSubmitted(true);
      setSubmitError("");
      setFormData({
        nama_customer: "",
        nomor_hp: "",
        jenis_servis: "",
        nama_karyawan: "Belum Ditentukan",
        tanggal_booking: "",
      });
    } catch (error) {
      console.error("Gagal kirim data:", error);
      setSubmitError("Terjadi kesalahan saat menyimpan data.");
    }
  };

  // Simple auto slide for images
  const images = [
    "https://moladin.com/blog/wp-content/uploads/2019/08/1-6.jpg",
    "https://www.asuransiastra.com/wp-content/uploads/2022/04/Hal-yang-Harus-Diperhatikan-Saat-Melakukan-Service-Motor.jpg",
    "https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark.png,5,5,60)/photo/2023/07/05/whatsapp-image-2023-07-05-at-12-20230705123743.jpeg"
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // ganti gambar tiap 3 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-7xl shadow-xl rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT: Image Slider + Edukasi */}
        <div className="bg-green-600 text-white p-0 flex flex-col justify-between">
          {/* Gambar Slider */}
          <div className="w-full h-64 md:h-80 overflow-hidden relative">
            <img
              src={images[currentImage]}
              alt={`Gambar ${currentImage + 1}`}
              className="object-cover w-full h-full transition-all duration-700"
            />
          </div>

          {/* Edukasi */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Kenapa Servis Rutin Itu Penting?</h2>
            <ul className="space-y-2 text-base list-disc ml-5">
              <li>Menjaga performa motor tetap optimal.</li>
              <li>Mencegah kerusakan lebih besar di kemudian hari.</li>
              <li>Meningkatkan efisiensi bahan bakar.</li>
              <li>Menjaga keamanan berkendara.</li>
            </ul>
          </div>
        </div>

        {/* RIGHT: Form Booking */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Form Booking Servis</h2>

          {submitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
              Booking berhasil dikirim!
            </div>
          )}
          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Nama Customer</label>
              <input
                type="text"
                name="nama_customer"
                value={formData.nama_customer}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded ${errors.nama_customer ? "border-red-500" : "border-gray-300"}`}
                placeholder="Masukkan nama"
              />
              {errors.nama_customer && <p className="text-red-500 text-sm mt-1">{errors.nama_customer}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Nomor HP</label>
              <input
                type="text"
                name="nomor_hp"
                value={formData.nomor_hp}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded ${errors.nomor_hp ? "border-red-500" : "border-gray-300"}`}
                placeholder="Contoh: 081234567890"
              />
              {errors.nomor_hp && <p className="text-red-500 text-sm mt-1">{errors.nomor_hp}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Jenis Servis</label>
              <select
                name="jenis_servis"
                value={formData.jenis_servis}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded ${errors.jenis_servis ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">-- Pilih jenis servis --</option>
                {jenisServisOptions.map((jenis) => (
                  <option key={jenis} value={jenis}>
                    {jenis}
                  </option>
                ))}
              </select>
              {errors.jenis_servis && <p className="text-red-500 text-sm mt-1">{errors.jenis_servis}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Tanggal Booking</label>
              <input
                type="date"
                name="tanggal_booking"
                value={formData.tanggal_booking}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full border px-4 py-2 rounded ${errors.tanggal_booking ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.tanggal_booking && <p className="text-red-500 text-sm mt-1">{errors.tanggal_booking}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
            >
              Booking Sekarang
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
