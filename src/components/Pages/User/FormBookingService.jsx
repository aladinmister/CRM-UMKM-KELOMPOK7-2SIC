import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function FormBookingService() {
  const navigate = useNavigate();

  // Cek apakah user sudah login
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!role); // true jika ada role
  }, []);

  const [formData, setFormData] = useState({
    nama_customer: "",
    nomor_hp: "",
    jenis_servis: "",
    tanggal_booking: "",
    jam_booking: "",
    tipe_kendaraan: "",
    sparepart: "",
    status_booking: "menunggu",
    alasan_penolakan: null,
  });

  const [errors, setErrors] = useState({});

  const jenisServisOptions = [
    "Servis Ringan",
    "Servis Berat",
    "Ganti Oli",
    "Tune Up",
    "Perbaikan Elektrik",
  ];

  const tipeKendaraanOptions = [
    "Motor Bebek",
    "Motor Matic",
    "Motor Sport",
    "Motor Listrik",
  ];

  const validate = () => {
    const errs = {};
    if (!formData.nama_customer.trim()) errs.nama_customer = "Nama wajib diisi";
    if (!formData.nomor_hp.trim()) errs.nomor_hp = "Nomor HP wajib diisi";
    else if (!/^\d{8,15}$/.test(formData.nomor_hp)) errs.nomor_hp = "Nomor HP tidak valid (8-15 digit)";
    if (!formData.jenis_servis) errs.jenis_servis = "Pilih jenis servis";
    if (!formData.tanggal_booking) errs.tanggal_booking = "Pilih tanggal booking";
    if (!formData.jam_booking) errs.jam_booking = "Pilih jam booking";
    if (!formData.tipe_kendaraan) errs.tipe_kendaraan = "Pilih tipe kendaraan";
    return errs;
  };

  const handleChange = (e) => {
    if (!isLoggedIn) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Login Diperlukan",
        text: "Harap login terlebih dahulu sebelum booking.",
      });
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post("https://ahm.inspirasienergiprimanusa.com/api/bookings", formData);
      Swal.fire({
        icon: "success",
        title: "Booking berhasil!",
        text: "Data berhasil dikirim.",
        timer: 3000,
        showConfirmButton: false,
      });
      setFormData({
        nama_customer: "",
        nomor_hp: "",
        jenis_servis: "",
        tanggal_booking: "",
        jam_booking: "",
        tipe_kendaraan: "",
        sparepart: "",
        status_booking: "menunggu",
        alasan_penolakan: null,
      });
    } catch (error) {
      console.error("Gagal kirim data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal mengirim!",
        text: "Terjadi kesalahan saat menyimpan data.",
      });
    }
  };

  const images = [
    "https://moladin.com/blog/wp-content/uploads/2019/08/1-6.jpg",
    "https://www.asuransiastra.com/wp-content/uploads/2022/04/Hal-yang-Harus-Diperhatikan-Saat-Melakukan-Service-Motor.jpg",
    "https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark.png,5,5,60)/photo/2023/07/05/whatsapp-image-2023-07-05-at-12-20230705123743.jpeg",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-7xl shadow-xl rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT IMAGE */}
        <div className="bg-green-600 text-white flex flex-col justify-between">
          <div className="w-full h-64 md:h-80 overflow-hidden">
            <img
              src={images[currentImage]}
              alt={`Gambar ${currentImage + 1}`}
              className="object-cover w-full h-full transition-all duration-700"
            />
          </div>
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

        {/* FORM */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Form Booking Servis</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              ["Nama Customer", "nama_customer", "text"],
              ["Nomor HP", "nomor_hp", "text"],
              ["Tanggal Booking", "tanggal_booking", "date"],
              ["Jam Booking", "jam_booking", "time"],
            
            ].map(([label, name, type]) => (
              <div key={name}>
                <label className="block mb-1 font-medium">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  disabled={!isLoggedIn}
                  className={`w-full border px-4 py-2 rounded bg-white ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  } ${!isLoggedIn && "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                />
                {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
              </div>
            ))}

            <div>
              <label className="block mb-1 font-medium">Jenis Servis</label>
              <select
                name="jenis_servis"
                value={formData.jenis_servis}
                onChange={handleChange}
                disabled={!isLoggedIn}
                className={`w-full border px-4 py-2 rounded ${
                  errors.jenis_servis ? "border-red-500" : "border-gray-300"
                } ${!isLoggedIn && "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
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
              <label className="block mb-1 font-medium">Tipe Kendaraan</label>
              <select
                name="tipe_kendaraan"
                value={formData.tipe_kendaraan}
                onChange={handleChange}
                disabled={!isLoggedIn}
                className={`w-full border px-4 py-2 rounded ${
                  errors.tipe_kendaraan ? "border-red-500" : "border-gray-300"
                } ${!isLoggedIn && "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
              >
                <option value="">-- Pilih tipe kendaraan --</option>
                {tipeKendaraanOptions.map((tipe) => (
                  <option key={tipe} value={tipe}>
                    {tipe}
                  </option>
                ))}
              </select>
              {errors.tipe_kendaraan && <p className="text-red-500 text-sm mt-1">{errors.tipe_kendaraan}</p>}
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
