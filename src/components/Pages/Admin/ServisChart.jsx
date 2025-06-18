import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ServisChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios
      .get("https://ahm.inspirasienergiprimanusa.com/api/servis-grafik")
      .then((res) => {
        const labels = res.data.map((item) => item.jenis_servis);
        const values = res.data.map((item) => item.jumlah);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Jumlah Servis",
              data: values,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Gagal memuat data grafik:", err);
      });
  }, []);

  if (!chartData) return <p>Memuat grafik...</p>;

  return (
    <div style={{ width: "500px", margin: "auto" }}>
      <h2>Distribusi Jenis Servis</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default ServisChart;
