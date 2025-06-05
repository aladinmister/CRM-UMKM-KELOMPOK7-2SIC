import React from "react";
import { Link } from "react-router-dom";

export default function DataKaryawan({ karyawanList }) {
  return (
    <div className="bg-white shadow rounded p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Daftar Karyawan</h2>
        <Link
          to="/datakaryawan/inputdatakaryawan"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          Tambah Data Karyawan
        </Link>
      </div>

      {(!karyawanList || karyawanList.length === 0) ? (
        <p className="text-gray-600">Belum ada data karyawan.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-gray-300 px-4 py-2">No.</th>
                <th className="border border-gray-300 px-4 py-2">Nama</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Posisi</th>
              </tr>
            </thead>
            <tbody>
              {karyawanList.map((karyawan, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border border-gray-300 px-4 py-2 text-center">{i + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{karyawan.nama}</td>
                  <td className="border border-gray-300 px-4 py-2">{karyawan.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{karyawan.posisi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
