import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('Pesan berhasil dikirim!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white text-red-700 font-sans">
      {/* Header */}
      <section className="bg-red-600 text-white py-16 text-center shadow-md">
        <h1 className="text-4xl font-bold mb-2">Hubungi Kami</h1>
        <p className="text-lg">Kami siap membantu Anda seputar produk dan layanan AHM.</p>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Informasi Kontak</h2>
          <p><strong>📍 Alamat:</strong> Jl. AHM Raya No.123, Jakarta</p>
          <p><strong>📞 Telepon:</strong> (021) 1234 5678</p>
          <p><strong>✉️ Email:</strong> cs@ahm.co.id</p>
          <p><strong>🕒 Jam Operasional:</strong> Senin - Sabtu, 08.00 - 17.00</p>

          {/* Google Maps Embed */}
          <iframe
            title="Lokasi AHM"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.9201453251993!2d106.82715341603799!3d-6.175392062145153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3efde42cb0f%3A0x9d98c514d1f5fffd!2sMonas%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1616581830021!5m2!1sen!2sid"
            width="100%"
            height="300"
            className="rounded-lg border-2 border-red-500 shadow"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white text-red-700 border border-red-300 p-6 rounded-lg shadow space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4">Kirim Pesan</h2>

          <div>
            <label className="block text-sm font-semibold mb-1">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-red-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-red-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Pesan</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
              className="w-full border border-red-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition font-semibold"
          >
            Kirim Pesan
          </button>
        </form>
      </section>

      {/* Footer */}
      
    </div>
  );
};

export default Contact;
