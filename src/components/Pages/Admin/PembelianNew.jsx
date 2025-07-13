import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import 'react-data-table-component-extensions/dist/index.css';

const API_BASE_URL = 'https://ahm.inspirasienergiprimanusa.com';

function PembelianNew() {
    const [data, setData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [shippingStatusFilter, setShippingStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    // Format Rupiah
    const formatRupiah = (value) => {
        if (!value) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value).replace(/\s/g, '');
    };

    // Ambil data transaksi
    const fetchTransaksi = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const params = {
                status_pembayaran: statusFilter || undefined,
                status_pengiriman: shippingStatusFilter || undefined,
                search: searchQuery || undefined
            };

            const res = await axios.get(`${API_BASE_URL}/api/transaksi`, { params });

            if (res.data?.status === 'success') {
                setData(res.data.data || []);
                setUnreadCount(res.data.data.filter(t => !t.read_at).length);
                setSuccess('Data transaksi berhasil dimuat');
            } else {
                throw new Error(res.data?.message || 'Gagal mengambil data');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Gagal memuat transaksi');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Tandai sudah dibaca
    const markAsRead = async (orderId) => {
        try {
            await axios.put(`${API_BASE_URL}/api/transaksi/${orderId}/mark-as-read`);
            setData(data.map(item => 
                item.order_id === orderId ? { ...item, read_at: new Date().toISOString() } : item
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Gagal menandai sebagai sudah dibaca:', err);
        }
    };

    // Update status pengiriman
    const updateStatusPengiriman = async (orderId, newStatus) => {
        const statusLabels = {
            'dikirim': 'Dikirim',
            'diterima': 'Diterima',
            'dibatalkan': 'Dibatalkan'
        };

        if (!window.confirm(`Anda yakin ingin mengubah status pengiriman menjadi "${statusLabels[newStatus] || newStatus}"?`)) {
            return;
        }

        try {
            setLoading(true);
            const res = await axios.put(`${API_BASE_URL}/api/transaksi/${orderId}/status-pengiriman`, {
                status_pengiriman: newStatus
            });

            if (res.data?.status === 'success') {
                setData(data.map(item => 
                    item.order_id === orderId
                        ? {
                            ...item,
                            status_pengiriman: newStatus,
                            updated_at: res.data.data.updated_at
                        }
                        : item
                ));

                setSuccess(`Status pengiriman berhasil diubah menjadi "${statusLabels[newStatus] || newStatus}"`);
                fetchTransaksi(); // Refresh data
            } else {
                throw new Error(res.data?.message || 'Gagal memperbarui status');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Gagal memperbarui status');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Warna status
    const getStatusColor = (status) => {
        switch (status) {
            case 'menunggu': return 'bg-gray-100 text-gray-800';
            case 'diproses': return 'bg-blue-100 text-blue-800';
            case 'dikirim': return 'bg-yellow-100 text-yellow-800';
            case 'diterima': return 'bg-green-100 text-green-800';
            case 'dibatalkan': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Warna status pembayaran
    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Label status
    const getStatusLabel = (status) => {
        const labels = {
            'menunggu': 'Menunggu',
            'diproses': 'Diproses',
            'dikirim': 'Dikirim',
            'diterima': 'Diterima',
            'dibatalkan': 'Dibatalkan',
            'pending': 'Menunggu Pembayaran',
            'paid': 'Lunas',
            'failed': 'Gagal'
        };
        return labels[status] || status;
    };

    // Format tanggal
    const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: id });
    };

    // Fetch data on component mount and filter changes
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransaksi();
        }, 500);
        return () => clearTimeout(timer);
    }, [statusFilter, shippingStatusFilter, searchQuery]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Manajemen Transaksi
                    {unreadCount > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {unreadCount} baru
                        </span>
                    )}
                </h1>
                <p className="text-gray-600 mt-1">Kelola semua transaksi pelanggan Anda di sini</p>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Cari ID Pesanan, Nama Pelanggan..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Semua Pembayaran</option>
                            <option value="pending">Menunggu Pembayaran</option>
                            <option value="paid">Lunas</option>
                            <option value="failed">Gagal</option>
                        </select>
                    </div>

                    <div>
                        <select
                            value={shippingStatusFilter}
                            onChange={(e) => setShippingStatusFilter(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Semua Pengiriman</option>
                            <option value="menunggu">Menunggu</option>
                            <option value="diproses">Diproses</option>
                            <option value="dikirim">Dikirim</option>
                            <option value="diterima">Diterima</option>
                            <option value="dibatalkan">Dibatalkan</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Status Messages */}
            <div className="mb-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Order List - Card View */}
            {!loading && data.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada transaksi ditemukan</h3>
                    <p className="mt-1 text-sm text-gray-500">Coba ubah filter pencarian Anda atau muat ulang halaman.</p>
                    <div className="mt-6">
                        <button
                            onClick={fetchTransaksi}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Muat Ulang Data
                        </button>
                    </div>
                </div>
            )}

            {/* Order Cards */}
            {!loading && data.length > 0 && (
                <div className="space-y-4">
                    {data.map((order) => (
                        <div key={order.order_id} className="bg-white rounded-xl shadow-md overflow-hidden">
                            {/* Order Header */}
                            <div className={`p-4 border-b ${!order.read_at ? 'bg-blue-50' : ''}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center mb-2 sm:mb-0">
                                        {!order.read_at && (
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        )}
                                        <h3 className="font-semibold text-gray-800">
                                            Pesanan #{order.order_id}
                                        </h3>
                                        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                            {formatDate(order.created_at)}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.status_pembayaran)}`}>
                                            {getStatusLabel(order.status_pembayaran)}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status_pengiriman)}`}>
                                            {getStatusLabel(order.status_pengiriman)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Content */}
                            <div className="p-4">
                                <div className="flex flex-col md:flex-row">
                                    {/* Customer Info */}
                                    <div className="md:w-1/4 mb-4 md:mb-0">
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Pelanggan</h4>
                                        <p className="font-medium">{order.nama_pembeli}</p>
                                        <p className="text-sm text-gray-500">{order.email_pembeli || '-'}</p>
                                        <p className="text-sm text-gray-500">{order.phone_pembeli || '-'}</p>
                                    </div>

                                    {/* Products */}
                                    <div className="md:w-2/4 mb-4 md:mb-0">
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Produk</h4>
                                        <div className="space-y-2">
                                            {order.items.slice(0, 2).map((item, i) => (
                                                <div key={i} className="flex items-start">
                                                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center mr-3 overflow-hidden">
                                                        {item.gambar_produk ? (
                                                            <img 
                                                                src={item.gambar_produk.startsWith('http') ? item.gambar_produk : `${API_BASE_URL}/storage/${item.gambar_produk}`}
                                                                alt={item.nama_produk}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/images/default-product.png';
                                                                    e.target.className = "w-full h-full object-contain p-2";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{item.nama_produk}</p>
                                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                        <p className="text-sm font-medium text-blue-600">{formatRupiah(item.harga)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-sm text-gray-500">
                                                    +{order.items.length - 2} produk lainnya
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="md:w-1/4">
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Ringkasan</h4>
                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Subtotal:</span>
                                                <span className="text-sm font-medium">{formatRupiah(order.total_price)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Ongkir:</span>
                                                <span className="text-sm font-medium">{formatRupiah(order.shipping_cost)}</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t">
                                                <span className="text-sm font-medium text-gray-900">Total:</span>
                                                <span className="text-sm font-bold text-green-600">{formatRupiah(order.total_pembayaran)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Footer - Actions */}
                            <div className="bg-gray-50 px-4 py-3 border-t">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-sm text-gray-500">
                                            {order.courier} - {order.shipping_service}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(selectedOrder === order.order_id ? null : order.order_id);
                                                if (!order.read_at) markAsRead(order.order_id);
                                            }}
                                            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            {selectedOrder === order.order_id ? 'Tutup Detail' : 'Lihat Detail'}
                                        </button>

                                        {['paid', 'lunas'].includes(order.status_pembayaran?.toLowerCase()) && (
                                            <div className="flex space-x-2">
                                                {order.status_pengiriman === 'diproses' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatusPengiriman(order.order_id, 'dikirim')}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            Kirim Pesanan
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatusPengiriman(order.order_id, 'dibatalkan')}
                                                            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            Batalkan
                                                        </button>
                                                    </>
                                                )}
                                                {order.status_pengiriman === 'dikirim' && (
                                                    <button
                                                        onClick={() => updateStatusPengiriman(order.order_id, 'diterima')}
                                                        className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                    >
                                                        Tandai Diterima
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Details - Expanded View */}
                            {selectedOrder === order.order_id && (
                                <div className="p-4 bg-gray-50 border-t animate-fade-in">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Customer and Shipping Information */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <h3 className="font-medium text-gray-800">Informasi Pelanggan & Pengiriman</h3>
                                            </div>

                                            <div className="p-4 space-y-6">
                                                {/* Customer Information */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center text-sm font-medium text-gray-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        Informasi Pelanggan
                                                    </div>

                                                    <div className="space-y-2 pl-6">
                                                        <div className="flex items-start">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <div>
                                                                <span className="text-sm font-medium text-gray-600">Nama:</span>
                                                                <span className="text-sm ml-2">{order.nama_pembeli}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            <div>
                                                                <span className="text-sm font-medium text-gray-600">Email:</span>
                                                                <span className="text-sm ml-2">{order.email_pembeli || '-'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            <div>
                                                                <span className="text-sm font-medium text-gray-600">Telepon:</span>
                                                                <span className="text-sm ml-2">{order.phone_pembeli || '-'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Shipping Information */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center text-sm font-medium text-gray-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        Alamat Pengiriman
                                                    </div>

                                                    {order.shipping_address ? (
                                                        <div className="space-y-3 pl-6">
                                                            {/* Full Address */}
                                                            <div className="flex items-start">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                </svg>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-600 mb-1">Alamat Lengkap</p>
                                                                    <p className="text-sm bg-gray-50 p-2 rounded">{order.shipping_address.detail_alamat || 'Tidak ada detail alamat'}</p>
                                                                </div>
                                                            </div>

                                                            {/* Location Details */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                <div className="flex items-start">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                                    </svg>
                                                                    <div>
                                                                        <span className="text-sm font-medium text-gray-600">Provinsi:</span>
                                                                        <span className="text-sm ml-2">{order.shipping_address.provinsi || '-'}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-start">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                    </svg>
                                                                    <div>
                                                                        <span className="text-sm font-medium text-gray-600">Kota/Kab:</span>
                                                                        <span className="text-sm ml-2">{order.shipping_address.kota || '-'}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-start">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                    </svg>
                                                                    <div>
                                                                        <span className="text-sm font-medium text-gray-600">Kode Pos:</span>
                                                                        <span className="text-sm ml-2">{order.shipping_address.kode_pos || '-'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Notes */}
                                                            {order.shipping_address.catatan && (
                                                                <div className="flex items-start">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                    </svg>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-gray-600 mb-1">Catatan/Patokan</p>
                                                                        <p className="text-sm bg-yellow-50 p-2 rounded border border-yellow-100">{order.shipping_address.catatan}</p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Courier */}
                                                            <div className="flex items-start">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                </svg>
                                                                <div>
                                                                    <span className="text-sm font-medium text-gray-600">Kurir:</span>
                                                                    <span className="text-sm ml-2">{order.courier} - {order.shipping_service}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4 text-sm text-gray-500">
                                                            Tidak ada informasi alamat pengiriman
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                                <h3 className="font-medium text-gray-800">Detail Pesanan</h3>
                                            </div>

                                            <div className="p-4">
                                                <div className="overflow-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Produk
                                                                </th>
                                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Harga
                                                                </th>
                                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Qty
                                                                </th>
                                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Subtotal
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {order.items?.map((item, i) => (
                                                                <tr key={i} className="hover:bg-gray-50">
                                                                    <td className="px-3 py-3 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center mr-3 overflow-hidden">
                                                                                {item.gambar_produk ? (
                                                                                    <img 
                                                                                        src={item.gambar_produk.startsWith('http') ? item.gambar_produk : `${API_BASE_URL}/storage/${item.gambar_produk}`}
                                                                                        alt={item.nama_produk}
                                                                                        className="w-full h-full object-cover"
                                                                                        onError={(e) => {
                                                                                            e.target.onerror = null;
                                                                                            e.target.src = '/images/default-product.png';
                                                                                            e.target.className = "w-full h-full object-contain p-2";
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                                        </svg>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-sm font-medium text-gray-900">{item.nama_produk}</div>
                                                                                <div className="text-xs text-gray-500">SKU: {item.sku || '-'}</div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                        {formatRupiah(item.harga)}
                                                                    </td>
                                                                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                        {item.quantity}
                                                                    </td>
                                                                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {formatRupiah(item.harga * item.quantity)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Order Summary */}
                                                <div className="mt-6 border-t pt-4 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                            Subtotal:
                                                        </div>
                                                        <span className="text-sm font-medium">{formatRupiah(order.total_price)}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                            Ongkos Kirim:
                                                        </div>
                                                        <span className="text-sm font-medium">{formatRupiah(order.shipping_cost)}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-3 border-t">
                                                        <div className="flex items-center text-base font-semibold text-gray-900">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Total Pembayaran:
                                                        </div>
                                                        <span className="text-base font-semibold text-green-600">{formatRupiah(order.total_pembayaran)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PembelianNew;