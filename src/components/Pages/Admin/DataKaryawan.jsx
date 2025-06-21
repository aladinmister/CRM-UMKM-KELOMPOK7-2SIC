import { useEffect, useState } from "react";
import axios from "axios";

export default function KaryawanPage() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    nama_karyawan: "",
    alamat_karyawan: "",
    bidang_keahlian: "",
    foto_karyawan: null,
  });

  const [previewFoto, setPreviewFoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://ahm.inspirasienergiprimanusa.com";

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/karyawan`);
      setData(res.data);
    } catch (err) {
      console.error("Gagal ambil data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setPreviewFoto(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null) formData.append(key, val);
    });

    try {
      if (editId) {
        await axios.post(`${BASE_URL}/api/karyawan/${editId}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${BASE_URL}/api/karyawan/store`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchData();
      resetForm();
    } catch (err) {
      console.error("Gagal simpan data", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      nama_karyawan: "",
      alamat_karyawan: "",
      bidang_keahlian: "",
      foto_karyawan: null,
    });
    setPreviewFoto(null);
    setShowModal(false);
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus data ini?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/karyawan/${id}`);
      fetchData();
    } catch (err) {
      console.error("Gagal hapus data", err);
    }
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      nama_karyawan: item.nama_karyawan,
      alamat_karyawan: item.alamat_karyawan,
      bidang_keahlian: item.bidang_keahlian,
      foto_karyawan: null, // akan ditimpa kalau upload baru
    });
    setPreviewFoto(`${BASE_URL}/storage/foto_karyawan/${item.foto_karyawan}`);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Data Karyawan</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Tambah Data
        </button>
      </div>

      <table className="min-w-full border text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Nama</th>
            <th className="border px-3 py-2">Alamat</th>
            <th className="border px-3 py-2">Bidang</th>
            <th className="border px-3 py-2">Foto</th>
            <th className="border px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="border px-3 py-2">{item.nama_karyawan}</td>
              <td className="border px-3 py-2">{item.alamat_karyawan}</td>
              <td className="border px-3 py-2">{item.bidang_keahlian}</td>
              <td className="border px-3 py-2">
                    {item.foto_karyawan && (
                <img
                  src={item.foto_karyawan}
                  alt={item.foto_karyawan}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              </td>
              <td className="border px-3 py-2 flex gap-2">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={() => setViewModal(item)}
                >
                  Show
                </button>
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => openEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(item.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            className="bg-white p-6 rounded-md w-full max-w-md"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <h3 className="text-xl font-semibold mb-4">
              {editId ? "Edit Karyawan" : "Tambah Karyawan"}
            </h3>

            <input
              type="text"
              name="nama_karyawan"
              placeholder="Nama"
              value={form.nama_karyawan}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
              required
            />

            <input
              type="text"
              name="alamat_karyawan"
              placeholder="Alamat"
              value={form.alamat_karyawan}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
            />

            <input
              type="text"
              name="bidang_keahlian"
              placeholder="Bidang Keahlian"
              value={form.bidang_keahlian}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
            />

            <input
              type="file"
              name="foto_karyawan"
              onChange={handleChange}
              className="w-full mb-2"
              accept="image/*"
            />

            {previewFoto && (
              <img
                src={previewFoto}
                alt="Preview"
                className="w-24 h-24 object-cover mb-4 border rounded"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Detail Karyawan</h3>
            <p><strong>Nama:</strong> {viewModal.nama_karyawan}</p>
            <p><strong>Alamat:</strong> {viewModal.alamat_karyawan}</p>
            <p><strong>Bidang:</strong> {viewModal.bidang_keahlian}</p>
            {viewModal.foto_karyawan && (
              <img
                src={`${BASE_URL}/storage/foto_karyawan/${viewModal.foto_karyawan}`}
                alt="Foto"
                className="w-32 mt-4 object-cover rounded"
              />
            )}
            <button
              onClick={() => setViewModal(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
