import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Card, Modal, Button, Input, Upload } from "antd";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { UploadOutlined } from "@ant-design/icons";

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

  const handleSubmit = async () => {
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
      foto_karyawan: null,
    });
    setPreviewFoto(item.foto_karyawan);
    setShowModal(true);
  };

  const columns = [
    { name: "Nama", selector: (row) => row.nama_karyawan, sortable: true },
    { name: "Alamat", selector: (row) => row.alamat_karyawan },
    { name: "Bidang", selector: (row) => row.bidang_keahlian },
    {
      name: "Foto",
      cell: (row) =>
        row.foto_karyawan && (
          <img
            src={row.foto_karyawan}
            alt="Foto"
            className="w-16 h-16 object-cover rounded"
          />
        ),
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            icon={<Eye size={16} />}
            onClick={() => setViewModal(row)}
            type="primary"
            size="small"
          />
          <Button
            icon={<Pencil size={16} />}
            onClick={() => openEdit(row)}
            type="default"
            size="small"
          />
          <Button
            icon={<Trash2 size={16} />}
            onClick={() => handleDelete(row.id)}
            danger
            size="small"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Data Karyawan"
        extra={
          <Button type="primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Tambah Data
          </Button>
        }
      >
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </Card>

      {/* Modal Tambah/Edit */}
      <Modal
        title={editId ? "Edit Karyawan" : "Tambah Karyawan"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText="Simpan"
        cancelText="Batal"
      >
        <Input
          name="nama_karyawan"
          placeholder="Nama"
          value={form.nama_karyawan}
          onChange={handleChange}
          className="mb-2"
        />
        <Input
          name="alamat_karyawan"
          placeholder="Alamat"
          value={form.alamat_karyawan}
          onChange={handleChange}
          className="mb-2"
        />
        <Input
          name="bidang_keahlian"
          placeholder="Bidang"
          value={form.bidang_keahlian}
          onChange={handleChange}
          className="mb-2"
        />
        <input
          type="file"
          name="foto_karyawan"
          onChange={handleChange}
          accept="image/*"
          className="mb-2"
        />
        {previewFoto && (
          <img
            src={previewFoto}
            alt="Preview"
            className="w-24 h-24 object-cover mb-2 border rounded"
          />
        )}
      </Modal>

      {/* Modal View */}
      <Modal
        title="Detail Karyawan"
        open={!!viewModal}
        onCancel={() => setViewModal(null)}
        footer={[
          <Button key="close" onClick={() => setViewModal(null)}>
            Tutup
          </Button>,
        ]}
      >
        {viewModal && (
          <div className="space-y-2">
            <p><strong>Nama:</strong> {viewModal.nama_karyawan}</p>
            <p><strong>Alamat:</strong> {viewModal.alamat_karyawan}</p>
            <p><strong>Bidang:</strong> {viewModal.bidang_keahlian}</p>
            {viewModal.foto_karyawan && (
              <img
                src={viewModal.foto_karyawan}
                alt="Foto"
                className="w-32 object-cover mt-2 rounded"
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
