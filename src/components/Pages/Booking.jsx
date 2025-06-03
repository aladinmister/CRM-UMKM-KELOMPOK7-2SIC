import React, { useState } from "react";

const initialBookings = [
  {
    id: 1,
    name: "Ahmad",
    service: "Servis Mesin",
    date: "2025-06-03",
    status: "menunggu", // atau "disetujui", "ditolak"
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Laporan Booking</h1>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Layanan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tanggal
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{b.name}</td>
                <td className="px-6 py-4">{b.service}</td>
                <td className="px-6 py-4">{b.date}</td>
                <td className="px-6 py-4 text-center">
                  {b.status === "disetujui" && (
                    <span className="inline-block px-2 py-1 text-xs text-green-800 bg-green-100 rounded">
                      Disetujui
                    </span>
                  )}
                  {b.status === "ditolak" && (
                    <span className="inline-block px-2 py-1 text-xs text-red-800 bg-red-100 rounded">
                      Ditolak
                    </span>
                  )}
                  {b.status === "menunggu" && (
                    <span className="inline-block px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded">
                      Menunggu
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  {b.status === "menunggu" ? (
                    <>
                      <button
                        className="text-green-600 hover:underline"
                        onClick={() => handleApprove(b.id)}
                      >
                        Setujui
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleReject(b.id)}
                      >
                        Tolak
                      </button>
                    </>
                  ) : (
                    b.status === "ditolak" && (
                      <div className="text-sm text-red-600">
                        Alasan: {b.rejectionReason}
                      </div>
                    )
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Tidak ada data booking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal untuk alasan penolakan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Alasan Penolakan</h2>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows="4"
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
