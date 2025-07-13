// 📦 REACT BOOKING PAGE
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
axios.defaults.baseURL = "https://ahm.inspirasienergiprimanusa.com/api";

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showSparepartModal, setShowSparepartModal] = useState(false);
  const [sparepartText, setSparepartText] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const handleApprove = async (id) => {
    const result = await MySwal.fire({
      title: "Yakin ingin menyetujui?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`/bookings/${id}/status`, {
          status_booking: "disetujui",
        });
        fetchBookings();
        MySwal.fire("Berhasil!", "Booking disetujui", "success");
      } catch (error) {
        MySwal.fire("Gagal", "Tidak bisa menyetujui booking", "error");
      }
    }
  };

  const handleReject = (id) => {
    setSelectedBookingId(id);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      MySwal.fire("Alasan wajib diisi", "", "warning");
      return;
    }

    try {
      await axios.put(`/bookings/${selectedBookingId}/status`, {
        status_booking: "ditolak",
        alasan_penolakan: rejectionReason,
      });
      setShowRejectModal(false);
      fetchBookings();
      MySwal.fire("Berhasil!", "Booking ditolak", "success");
    } catch (error) {
      MySwal.fire("Gagal", "Tidak bisa menolak booking", "error");
    }
  };

  const handleComplete = (id) => {
    setSelectedBookingId(id);
    setSparepartText("");
    setShowSparepartModal(true);
  };

  const confirmComplete = async () => {
    try {
      await axios.put(`/bookings/${selectedBookingId}`, {
        status_booking: "selesai",
        sparepart: sparepartText,
      });
      setShowSparepartModal(false);
      fetchBookings();
      MySwal.fire("Selesai!", "Booking telah diselesaikan", "success");
    } catch (error) {
      MySwal.fire("Gagal", "Tidak bisa menyelesaikan booking", "error");
    }
  };

  const filteredBookings = bookings.filter((b) =>
    [
      b.nama_customer,
      b.nomor_hp,
      b.jenis_servis,
      b.nama_karyawan,
      b.tanggal_booking,
      b.tipe_kendaraan,
      b.status_booking,
    ]
      .join(" ")
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const columns = [
    { name: "No", cell: (row, index) => index + 1, width: "60px" },
    { name: "Nama", selector: (row) => row.nama_customer, sortable: true },
    { name: "Nomor HP", selector: (row) => row.nomor_hp },
    { name: "Layanan", selector: (row) => row.jenis_servis },
    { name: "Karyawan", selector: (row) => row.nama_karyawan },
    { name: "Tanggal", selector: (row) => row.tanggal_booking },
    { name: "Tipe", selector: (row) => row.tipe_kendaraan },
    {
      name: "Status",
      cell: (row) => {
        const styleMap = {
          disetujui: "bg-green-100 text-green-800",
          ditolak: "bg-red-100 text-red-800",
          "sedang diproses": "bg-yellow-100 text-yellow-800",
          menunggu: "bg-yellow-100 text-yellow-800",
          selesai: "bg-blue-100 text-blue-800",
        };
        return (
          <span
            className={`inline-flex px-2 text-xs font-semibold rounded-full ${
              styleMap[row.status_booking] || "bg-gray-200 text-gray-800"
            }`}
          >
            {row.status_booking}
          </span>
        );
      },
    },
    {
      name: "Sparepart",
      selector: (row) => row.sparepart || "-",
    },
    {
      name: "Alasan Penolakan",
      selector: (row) =>
        row.status_booking === "ditolak" ? row.alasan_penolakan || "-" : "-",
    },
    {
      name: "Aksi",
      cell: (row) => {
        if (row.status_booking === "sedang diproses" || row.status_booking === "menunggu") {
          return (
            <div className="space-x-2">
              <button
                className="text-green-600 hover:text-green-900 font-semibold"
                onClick={() => handleApprove(row.id)}
              >
                Setujui
              </button>
              <button
                className="text-red-600 hover:text-red-900 font-semibold"
                onClick={() => handleReject(row.id)}
              >
                Tolak
              </button>
            </div>
          );
        } else if (row.status_booking === "disetujui") {
          return (
            <button
              className="text-blue-600 hover:text-blue-900 font-semibold"
              onClick={() => handleComplete(row.id)}
            >
              Tandai Selesai
            </button>
          );
        } else {
          return "-";
        }
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-semibold mb-6">Manajemen Booking</h1>

        <div className="mb-4 px-4">
          <input
            type="text"
            placeholder="Cari nama, layanan, tanggal, status..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredBookings}
          pagination
          highlightOnHover
          striped
          responsive
          persistTableHead
        />
      </div>

      {/* Modal Penolakan */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Alasan Penolakan</h2>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowRejectModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmReject}
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Selesai */}
      {showSparepartModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Sparepart yang Diganti</h2>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows={4}
              value={sparepartText}
              onChange={(e) => setSparepartText(e.target.value)}
              placeholder="Contoh: Oli Mesin, Kampas Rem"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowSparepartModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={confirmComplete}
              >
                Tandai Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}