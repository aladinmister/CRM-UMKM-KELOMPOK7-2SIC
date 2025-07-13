import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const DashboardAdmin = () => {
  const [imageCharts, setImageCharts] = useState({});
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total: 0, income: 0, monthly_income: 0 });

  useEffect(() => {
    axios
      .get("https://ahm.inspirasienergiprimanusa.com/api/servis-grafik")
      .then((res) => {
        const {
          pie_jenis_servis,
          bar_tipe_kendaraan,
          bar_sparepart_top10,
          bar_sparepart_per_kendaraan,
          confusion_matrix,
        } = res.data;

        setImageCharts({
          pie_jenis_servis,
          bar_tipe_kendaraan,
          bar_sparepart_top10,
          bar_sparepart_per_kendaraan,
          confusion_matrix,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat data grafik:", err);
        setLoading(false);
      });

    axios
      .get("https://ahm.inspirasienergiprimanusa.com/api/summary-transaksi")
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => console.error("Gagal memuat summary transaksi:", err));
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Memuat grafik...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 font-sans">
      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-xl shadow-xl hover:scale-105 transition-transform"
        >
          <h3 className="text-lg font-semibold mb-2">Total Transaksi Berhasil</h3>
          <p className="text-3xl font-bold">
            <CountUp end={summary.total} duration={2} separator="," /> transaksi
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-red-500 to-yellow-500 text-white p-6 rounded-xl shadow-xl hover:scale-105 transition-transform"
        >
          <h3 className="text-lg font-semibold mb-2">Total Pendapatan</h3>
          <p className="text-3xl font-bold">
            Rp <CountUp end={summary.income} duration={2} separator="," />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-br from-yellow-600 to-red-500 text-white p-6 rounded-xl shadow-xl hover:scale-105 transition-transform"
        >
          <h3 className="text-lg font-semibold mb-2">Pendapatan Bulan Ini</h3>
          <p className="text-3xl font-bold">
            Rp <CountUp end={summary.monthly_income} duration={2} separator="," />
          </p>
        </motion.div>
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(imageCharts).map(([key, base64], index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 + index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-lg font-semibold text-center text-red-700 mb-3 capitalize">
              📊 {key.replace(/_/g, " ")}
            </h2>
            <div className="flex justify-center">
              <img
                src={`data:image/png;base64,${base64}`}
                alt={`Grafik ${key}`}
                className="rounded-md max-h-72 object-contain"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
