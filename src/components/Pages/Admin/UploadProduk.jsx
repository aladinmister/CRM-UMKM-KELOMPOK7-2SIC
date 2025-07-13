import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2

// Komponen Modal Form (untuk Tambah/Edit Produk)
function ProdukFormModal({ isOpen, onClose, form, handleChange, handleSubmit, isEditing, errorMsg }) {
  if (!isOpen) return null;

  // Inline styles for the overlay
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Black with 75% opacity
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Very high z-index
    padding: '16px', // p-4 equivalent
  };

  // Inline styles for the modal content box
  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '8px', // rounded-lg equivalent
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl equivalent
    width: '100%',
    maxWidth: '672px', // max-w-2xl equivalent (32rem * 16px/rem = 512px, 48rem = 768px, 42rem = 672px)
    overflow: 'hidden',
    // Minimal animation, for full animation, use a CSS file and @keyframes
    animation: 'fadeInDown 0.3s ease-out forwards',
  };

  // Inline styles for the form grid
  const formGridStyle = {
    padding: '24px', // p-6 equivalent
    display: 'grid',
    gridTemplateColumns: '1fr', // grid-cols-1
    gap: '16px', // gap-4
    maxHeight: 'calc(90vh - 120px)',
    overflowY: 'auto',
  };

  // Inline styles for table cells and form inputs/labels
  const tableHeaderStyle = {
    padding: '12px 24px', // px-6 py-3
    textAlign: 'left',
    fontSize: '0.75rem', // text-xs
    fontWeight: '500', // font-medium
    color: '#6b7280', // text-gray-500
    textTransform: 'uppercase',
    letterSpacing: '0.05em', // tracking-wider
  };

  const tableCellStyle = {
    padding: '16px 24px', // px-6 py-4
    whiteSpace: 'nowrap',
    fontSize: '0.875rem', // text-sm
    color: '#4b5563', // text-gray-900 (for strong text) or text-gray-500
  };

  const inputStyle = {
    width: '100%',
    border: '1px solid #d1d5db', // border border-gray-300
    padding: '8px', // p-2
    borderRadius: '6px', // rounded-md
    // Focus styles (more complex with vanilla CSS, can be done with :focus in a stylesheet)
  };

  return (
    <div style={overlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' /* bg-gray-50 */ }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' /* text-gray-800 */ }}>
            {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
          </h2>
          <button
            onClick={onClose}
            style={{ fontSize: '2.5rem', fontWeight: '300', lineHeight: '1', color: '#6b7280', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.target.style.color = '#374151'}
            onMouseOut={(e) => e.target.style.color = '#6b7280'}
            aria-label="Tutup"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} style={formGridStyle}>
          {errorMsg && (
            <div style={{ gridColumn: 'span 2 / span 2', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px' }} role="alert">
              <span style={{ display: 'block' }}>{errorMsg}</span>
            </div>
          )}

          {/* Nama Produk */}
          <div style={{ gridColumn: 'span 2 / span 2' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>Nama Produk</label>
            <input
              type="text"
              name="nama_produk"
              value={form.nama_produk}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Kategori */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>Kategori</label>
            <input
              type="text"
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Supplier (Opsional) */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>Supplier (Opsional)</label>
            <input
              type="text"
              name="supplier_produk"
              value={form.supplier_produk || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Stok */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>Stok</label>
            <input
              type="number"
              name="stock_produk"
              value={form.stock_produk}
              onChange={handleChange}
              required
              min="0"
              style={inputStyle}
            />
          </div>

          {/* Harga */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>Harga</label>
            <input
              type="number"
              name="harga_produk"
              value={form.harga_produk}
              onChange={handleChange}
              required
              min="0"
              style={inputStyle}
            />
          </div>

          {/* Harga Promo */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>Harga Promo (Opsional)</label>
            <input
              type="number"
              name="harga_promo"
              value={form.harga_promo || ""}
              onChange={handleChange}
              min="0"
              style={inputStyle}
            />
          </div>

          {/* Berat Produk (gram) */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>Berat Produk (gram)</label>
            <input
              type="number"
              name="berat_produk"
              value={form.berat_produk}
              onChange={handleChange}
              required
              min="1"
              style={inputStyle}
            />
          </div>

          {/* Produk Terjual */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>Terjual</label>
            <input
              type="number"
              name="produk_terjual"
              value={form.produk_terjual || ""}
              onChange={handleChange}
              min="0"
              style={inputStyle}
            />
          </div>

          {/* Rating */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>Rating (0-5)</label>
            <input
              type="number"
              name="rating_produk"
              value={form.rating_produk || ""}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="5"
              style={inputStyle}
            />
          </div>

          {/* Deskripsi Produk */}
          <div style={{ gridColumn: 'span 2 / span 2' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>Deskripsi (Opsional)</label>
            <textarea
              name="deskripsi_produk"
              value={form.deskripsi_produk || ""}
              onChange={handleChange}
              rows="4"
              style={inputStyle}
            ></textarea>
          </div>

          {/* Gambar Produk */}
          <div style={{ gridColumn: 'span 2 / span 2' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>Gambar Produk</label>
            <input
              type="file"
              name="gambar_produk"
              onChange={handleChange}
              accept="image/*"
              style={{ ...inputStyle, /* file-specific styles are harder inline */ }}
            />
            {isEditing && form.id && !form.gambar_produk && (
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>Biarkan kosong untuk mempertahankan gambar lama.</p>
            )}
            {isEditing && form.id && form.gambar_produk && typeof form.gambar_produk === 'string' && (
              <img src={form.gambar_produk} alt="Gambar Lama" style={{ width: '80px', height: '80px', objectFit: 'cover', marginTop: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
            )}
          </div>

         
          {/* Note: The submit button is now outside the <form> tag, but it's linked by its `form` attribute */}
          <button type="submit" form="produk-form" style={{ display: 'none' }}></button> {/* Hidden submit button */}
        </form>
        {/* Tombol Aksi - dipindah ke luar form tapi masih dalam modal content */}
        <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '8px', backgroundColor: '#f9fafb' }}>
            <button
              onClick={handleSubmit} // Bind handleSubmit directly here
              style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.3s' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              {isEditing ? "Update Produk" : "Simpan Produk"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ backgroundColor: '#6b7280', color: 'white', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.3s' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
            >
              Batal
            </button>
          </div>
      </div>
    </div>
  );
}

// Komponen Modal Detail Produk
function ProdukDetailModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '16px',
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    width: '100%',
    maxWidth: '448px', // max-w-md (28rem = 448px)
    overflow: 'hidden',
    animation: 'fadeInDown 0.3s ease-out forwards',
  };

  const detailTextStyle = {
    marginBottom: '8px',
    color: '#374151',
  };

  return (
    <div style={overlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>Detail Produk</h2>
          <button
            onClick={onClose}
            style={{ fontSize: '2.5rem', fontWeight: '300', lineHeight: '1', color: '#6b7280', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.target.style.color = '#374151'}
            onMouseOut={(e) => e.target.style.color = '#6b7280'}
            aria-label="Tutup"
          >
            &times;
          </button>
        </div>
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
          {product.gambar_produk && (
            <img
              src={product.gambar_produk}
              alt={product.nama_produk}
              style={{ width: '100%', height: '192px', objectFit: 'contain', backgroundColor: '#f3f4f6', borderRadius: '6px', marginBottom: '16px', border: '1px solid #e5e7eb' }}
            />
          )}
          <p style={detailTextStyle}><strong style={{ fontWeight: '600', color: '#374151' }}>Nama Produk:</strong> {product.nama_produk}</p>
          <p style={detailTextStyle}><strong style={{ fontWeight: '600', color: '#374151' }}>Kategori:</strong> {product.kategori}</p>
          <p style={detailTextStyle}><strong style={{ fontWeight: '600', color: '#374151' }}>Supplier:</strong> {product.supplier_produk || '-'}</p>
          <p style={detailTextStyle}><strong style={{ fontWeight: '600', color: '#374151' }}>Stok:</strong> {product.stock_produk}</p>
          <p style={detailTextStyle}><strong style={{ fontWeight: '600', color: '#374151' }}>Harga:</strong> Rp{product.harga_produk.toLocaleString('id-ID')}</p>
          <p style={detailTextStyle}><strong style={{ fontWeight: '600', color: '#374151' }}>Harga Promo:</strong> Rp{product.harga_promo ? product.harga_promo.toLocaleString('id-ID') : '-'}</p>
          <p style={detailTextStyle}><strong style={{ fontWeight: '600', color: '#374151' }}>Berat Produk:</strong> {product.berat_produk} gram</p>
          <p style={detailTextStyle}><strong style={{ fontWeight: '600', color: '#374151' }}>Terjual:</strong> {product.produk_terjual}</p>
          <p style={detailTextStyle}><strong style={{ fontWeight: '600', color: '#374151' }}>Rating:</strong> {product.rating_produk}</p>
          <p style={detailTextStyle}><strong style={{ fontWeight: '600', color: '#374151' }}>Deskripsi:</strong> {product.deskripsi_produk || '-'}</p>
         
        </div>
        <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb', textAlign: 'right', backgroundColor: '#f9fafb' }}>
          <button
            onClick={onClose}
            style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.3s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}


// Komponen Utama UploadProduk
export default function UploadProduk() {
  const [produkList, setProdukList] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nama_produk: "",
    kategori: "",
    stock_produk: "",
    harga_produk: "",
    harga_promo: null,
    rating_produk: "",
    produk_terjual: "",
    gambar_produk: null,
    berat_produk: 1,
    deskripsi_produk: "",
    supplier_produk: "",
    is_active: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // State untuk pencarian dan paginasi
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Jumlah item per halaman

  const apiBase = "https://ahm.inspirasienergiprimanusa.com/api/produk";

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiBase);
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setProdukList(data);
    } catch (err) {
      console.error("Gagal fetch:", err.response || err.message);
      setErrorMsg("Gagal mengambil data produk.");
      Swal.fire('Error!', 'Gagal mengambil data produk.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : (type === "checkbox" ? checked : value),
    }));
  };

  const resetForm = () => {
    setForm({
      id: null,
      nama_produk: "",
      kategori: "",
      stock_produk: "",
      harga_produk: "",
      harga_promo: null,
      rating_produk: "",
      produk_terjual: "",
      gambar_produk: null,
      berat_produk: 1,
      deskripsi_produk: "",
      supplier_produk: "",
      is_active: true,
    });
    setIsEditing(false);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Client-side validation
    if (!form.nama_produk || !form.kategori || !form.stock_produk || !form.harga_produk || !form.berat_produk) {
      setErrorMsg("Nama produk, kategori, stok, harga, dan berat produk wajib diisi.");
      return;
    }
    if (parseInt(form.stock_produk) < 0) {
      setErrorMsg("Stok tidak boleh negatif.");
      return;
    }
    if (parseFloat(form.harga_produk) < 0) {
      setErrorMsg("Harga tidak boleh negatif.");
      return;
    }
    if (parseInt(form.berat_produk) <= 0) {
      setErrorMsg("Berat produk harus lebih dari 0 gram.");
      return;
    }

    const data = new FormData();
    data.append("nama_produk", form.nama_produk);
    data.append("kategori", form.kategori);
    data.append("harga_produk", form.harga_produk);
    data.append("stock_produk", form.stock_produk);
    data.append("berat_produk", form.berat_produk);
    data.append("deskripsi_produk", form.deskripsi_produk);
    data.append("supplier_produk", form.supplier_produk);
    data.append("is_active", form.is_active ? 1 : 0);

    if (form.harga_promo !== null && form.harga_promo !== "") {
      data.append("harga_promo", form.harga_promo);
    }
    if (form.rating_produk !== null && form.rating_produk !== "") {
      data.append("rating_produk", form.rating_produk);
    } else {
      data.append("rating_produk", 0);
    }
    if (form.produk_terjual !== null && form.produk_terjual !== "") {
      data.append("produk_terjual", form.produk_terjual);
    } else {
      data.append("produk_terjual", 0);
    }

    if (form.gambar_produk instanceof File) {
      data.append("gambar_produk", form.gambar_produk);
    } else if (isEditing && form.gambar_produk === null) {
      // Jika form.gambar_produk di-reset (user ingin menghapus gambar)
      // Ini akan membuat Laravel menghapus gambar yang ada dan set ke null
      data.append("gambar_produk", '');
    }

    const url = isEditing
      ? `${apiBase}/update/${form.id}`
      : `${apiBase}/store`;

    if (isEditing) {
      data.append("_method", "PUT");
    }

    try {
      await axios.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: 'success',
        title: isEditing ? 'Berhasil Diperbarui!' : 'Berhasil Ditambahkan!',
        text: `Produk "${form.nama_produk}" telah berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      setShowFormModal(false);
      resetForm();
      fetchProduk();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Terjadi kesalahan saat menyimpan produk.";
      setErrorMsg(errorMessage);
      Swal.fire('Error!', errorMessage, 'error');
    }
  };

  const handleAddNewProduk = () => {
    resetForm();
    setShowFormModal(true);
  };

  const handleEdit = (produk) => {
    setForm({
      id: produk.id,
      nama_produk: produk.nama_produk || "",
      kategori: produk.kategori || "",
      stock_produk: produk.stock_produk || "",
      harga_produk: produk.harga_produk || "",
      harga_promo: produk.harga_promo || "",
      rating_produk: produk.rating_produk || "",
      produk_terjual: produk.produk_terjual || "",
      gambar_produk: produk.gambar_produk || null,
      berat_produk: produk.berat_produk || 1,
      deskripsi_produk: produk.deskripsi_produk || "",
      supplier_produk: produk.supplier_produk || "",
      is_active: typeof produk.is_active === 'boolean' ? produk.is_active : (produk.is_active === 1),
    });
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak akan bisa mengembalikan ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiBase}/delete/${id}`);
          Swal.fire(
            'Dihapus!',
            'Produk telah berhasil dihapus.',
            'success'
          );
          fetchProduk();
        } catch (err) {
          console.error("Delete error:", err.response || err.message);
          Swal.fire(
            'Error!',
            'Gagal menghapus produk.',
            'error'
          );
        }
      }
    });
  };

  const handleShowDetail = (produk) => {
    setSelectedProduct(produk);
    setShowDetailModal(true);
  };

  // Logika pencarian
  const filteredProduk = produkList.filter(produk =>
    produk.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produk.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produk.supplier_produk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produk.harga_produk.toString().includes(searchTerm)
  );

  // Logika paginasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProduk.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProduk.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Main container styles
  const mainContainerStyle = {
    maxWidth: '1120px', // max-w-7xl (72rem = 1152px, slightly adjusted for common practice)
    margin: '0 auto', // mx-auto
    padding: '24px', // p-6
    backgroundColor: '#f9fafb', // bg-gray-50
    minHeight: '100vh',
  };

  // Card-like div styles
const cardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.7)',   // semi-transparan putih
  backdropFilter: 'blur(10px)',                 // blur latar belakang
  WebkitBackdropFilter: 'blur(10px)',           // dukungan Safari
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  borderRadius: '12px',                         // rounded-xl
  padding: '24px',
  marginBottom: '32px',
  border: '1px solid rgba(255, 255, 255, 0.3)',  // border tipis agar lebih kontras
};


  // Flex container styles
  const flexBetweenStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px', // mb-6
  };

  // Button styles
  const buttonPrimaryStyle = {
    backgroundColor: '#16a34a', // bg-green-600
    color: 'white',
    padding: '8px 20px', // px-5 py-2
    borderRadius: '6px', // rounded-md
    transition: 'background-color 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  };
  const buttonPrimaryHover = (e) => e.target.style.backgroundColor = '#15803d'; // hover:bg-green-700

  // Input search styles
  const searchInputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    // Focus styles are hard with inline, ideally handled by a stylesheet
  };

  // Loading and error message styles
  const loadingErrorStyle = {
    textAlign: 'center',
    padding: '32px',
    color: '#4b5563',
  };

  // Table styles
  const tableContainerStyle = {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  };

  const tableHeaderStyle = {
    backgroundColor: '#f3f4f6', // bg-gray-100
  };

  const thStyle = {
    padding: '12px 24px',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tdStyle = {
    padding: '16px 24px',
    whiteSpace: 'nowrap',
    fontSize: '0.875rem',
    color: '#4b5563',
  };

  const tdImageStyle = {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  };

  const statusActiveStyle = {
    padding: '4px 8px',
    display: 'inline-flex',
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
    fontWeight: '600',
    borderRadius: '9999px',
    backgroundColor: '#d1fae5', // bg-green-100
    color: '#065f46', // text-green-800
  };

  const statusInactiveStyle = {
    padding: '4px 8px',
    display: 'inline-flex',
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
    fontWeight: '600',
    borderRadius: '9999px',
    backgroundColor: '#fee2e2', // bg-red-100
    color: '#991b1b', // text-red-800
  };

  const actionButtonStyle = {
    padding: '8px',
    borderRadius: '9999px',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
  };

  const blueButtonHover = (e) => e.target.style.backgroundColor = '#2563eb';
  const yellowButtonHover = (e) => e.target.style.backgroundColor = '#ca8a04';
  const redButtonHover = (e) => e.target.style.backgroundColor = '#dc2626';

  const blueButtonStyle = { ...actionButtonStyle, backgroundColor: '#3b82f6', color: 'white' };
  const yellowButtonStyle = { ...actionButtonStyle, backgroundColor: '#eab308', color: 'white' };
  const redButtonStyle = { ...actionButtonStyle, backgroundColor: '#ef4444', color: 'white' };

  // Pagination styles
  const paginationContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '24px',
    gap: '16px',
  };

  const paginationButtonBaseStyle = {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    padding: '4px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const paginationButtonHover = (e) => e.target.style.backgroundColor = '#d1d5db';
  const paginationButtonActiveStyle = { ...paginationButtonBaseStyle, backgroundColor: '#2563eb', color: 'white' };
  const paginationButtonDisabledStyle = { opacity: '0.5', cursor: 'not-allowed' };


  return (
   
     <>
      <div style={cardStyle}>
        <div style={flexBetweenStyle}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>Daftar Produk</h2>
          <button
            onClick={handleAddNewProduk}
            style={buttonPrimaryStyle}
            onMouseOver={buttonPrimaryHover}
            onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '20px', width: '20px', marginRight: '8px' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tambah Produk Baru
          </button>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Cari produk (nama, kategori, supplier, harga)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            style={searchInputStyle}
          />
        </div>

        {loading ? (
          <div style={loadingErrorStyle}>
            <div style={{ animation: 'spin 1s linear infinite', borderRadius: '9999px', height: '48px', width: '48px', borderBottom: '2px solid #1f2937', margin: '0 auto 16px' }}></div>
            <p>Memuat data produk...</p>
          </div>
        ) : errorMsg && !produkList.length ? (
          <p style={{ ...loadingErrorStyle, color: '#ef4444' }}>{errorMsg}</p>
        ) : (
          <>
            <div style={tableContainerStyle}>
              <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                <thead style={tableHeaderStyle}>
                  <tr>
                    <th style={thStyle}>Gambar</th>
                    <th style={thStyle}>Nama Produk</th>
                    <th style={thStyle}>Kategori</th>
                    <th style={thStyle}>Stok</th>
                    <th style={thStyle}>Harga</th>
                    <th style={thStyle}>Berat (g)</th>
                   
                    <th style={{ ...thStyle, textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb' }}>
                  {currentItems.length > 0 ? (
                    currentItems.map((produk) => (
                      <tr key={produk.id} style={{ borderBottom: '1px solid #e5e7eb' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                        <td style={tdStyle}>
                          {produk.gambar_produk ? (
                            <img
                              src={produk.gambar_produk}
                              alt={produk.nama_produk}
                              style={tdImageStyle}
                            />
                          ) : (
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#e5e7eb', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '0.75rem' }}>No Image</div>
                          )}
                        </td>
                        <td style={{ ...tdStyle, fontWeight: '500', color: '#1f2937' }}>{produk.nama_produk}</td>
                        <td style={tdStyle}>{produk.kategori}</td>
                        <td style={tdStyle}>{produk.stock_produk}</td>
                        <td style={tdStyle}>Rp{produk.harga_produk.toLocaleString('id-ID')}</td>
                        <td style={tdStyle}>{produk.berat_produk}</td>
                      
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button
                              onClick={() => handleShowDetail(produk)}
                              style={blueButtonStyle}
                              onMouseOver={blueButtonHover}
                              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                              title="Lihat Detail"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '20px', width: '20px' }} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEdit(produk)}
                              style={yellowButtonStyle}
                              onMouseOver={yellowButtonHover}
                              onMouseOut={(e) => e.target.style.backgroundColor = '#eab308'}
                              title="Edit Produk"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '20px', width: '20px' }} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(produk.id)}
                              style={redButtonStyle}
                              onMouseOver={redButtonHover}
                              onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                              title="Hapus Produk"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '20px', width: '20px' }} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ ...tdStyle, textAlign: 'center', color: '#6b7280' }}>Tidak ada produk ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls (dibawah tabel) */}
            <div style={paginationContainerStyle}>
              <span style={{ color: '#374151', fontSize: '0.875rem' }}>Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProduk.length)} dari {filteredProduk.length} produk</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ ...paginationButtonBaseStyle, ...(currentPage === 1 ? paginationButtonDisabledStyle : {}) }}
                  onMouseOver={(e) => currentPage !== 1 && paginationButtonHover(e)}
                  onMouseOut={(e) => currentPage !== 1 && (e.target.style.backgroundColor = '#e5e7eb')}
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    style={currentPage === page ? paginationButtonActiveStyle : paginationButtonBaseStyle}
                    onMouseOver={(e) => currentPage !== page && paginationButtonHover(e)}
                    onMouseOut={(e) => currentPage !== page && (e.target.style.backgroundColor = '#e5e7eb')}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ ...paginationButtonBaseStyle, ...(currentPage === totalPages ? paginationButtonDisabledStyle : {}) }}
                  onMouseOver={(e) => currentPage !== totalPages && paginationButtonHover(e)}
                  onMouseOut={(e) => currentPage !== totalPages && (e.target.style.backgroundColor = '#e5e7eb')}
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Render the Modals */}
      <ProdukFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          resetForm(); // Reset form when closing modal
        }}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
        errorMsg={errorMsg}
      />

      <ProdukDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        product={selectedProduct}
      />
      </>
   
  );
}