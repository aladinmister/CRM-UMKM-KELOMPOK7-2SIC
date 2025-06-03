import React, { useState } from "react";
import DataTable from "react-data-table-component";

const initialBookings = [
  {
    id: 1,
    name: "Ahmad",
    service: "Servis Mesin",
    date: "2025-06-03",
    status: "menunggu",
    rejectionReason: "",
  },
  {
    id: 2,
    name: "Rina",
    service: "Ganti Oli",
    date: "2025-06-04",
    status: "menunggu",
    rejectionReason: "",
  },
];

export default function Booking() {
  const [bookings, setBookings] = useState(initialBookings);
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = (id) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "disetujui", rejectionReason: "" } : b
      )
    );
  };

  const handleReject = (id) => {
    setSelectedBookingId(id);
    setRejectionReason("");
    setShowModal(true);
  };

  const confirmReject = () => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBookingId
          ? { ...b, status: "ditolak", rejectionReason }
          : b
      )
    );
    setShowModal(false);
  };

  // Filter data berdasarkan filterText di kolom name, service, date, status
  const filteredBookings = bookings.filter((b) =>
    [b.name, b.service, b.date, b.status]
      .join(" ")
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "Nama",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Layanan",
      selector: (row) => row.service,
      sortable: true,
    },
    {
      name: "Tanggal",
      selector: (row) => row.date,
      sortable: true,
      sortFunction: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        if (row.status === "disetujui") {
          return (
            <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Disetujui
            </span>
          );
        } else if (row.status === "ditolak") {
          return (
            <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              Ditolak
            </span>
          );
        } else {
          return (
            <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Menunggu
            </span>
          );
        }
      },
      center: true,
    },
    {
      name: "Aksi",
      cell: (row) =>
        row.status === "menunggu" ? (
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
        ) : row.status === "ditolak" ? (
          <div className="text-sm text-red-600">Alasan: {row.rejectionReason}</div>
        ) : (
          "-"
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-semibold mb-6">Management Booking</h1>

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
          noHeader
          striped
          responsive
          persistTableHead
          noDataComponent={
            <div className="p-4 text-center text-gray-500">Tidak ada data booking</div>
          }
        />
      </div>

      {/* Modal alasan penolakan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
