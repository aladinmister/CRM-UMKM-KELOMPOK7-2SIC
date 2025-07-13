import React, { useEffect, useState } from "react";
import axios from "axios";

const ServisChart = () => {
  const [imageCharts, setImageCharts] = useState({});
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500 py-10">Memuat grafik...</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid gap-10">
      {Object.entries(imageCharts).map(([key, base64], index) => (
        <div
          key={index}
          className="bg-white shadow rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold text-center capitalize">
            📊 {key.replace(/_/g, " ")}
          </h2>
          <div className="flex justify-center">
            <img
              src={`data:image/png;base64,${base64}`}
              alt={`Grafik ${key}`}
              className="rounded-xl shadow-md max-w-full h-auto"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServisChart;
