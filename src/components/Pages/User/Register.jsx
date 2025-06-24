import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('https://ahm.inspirasienergiprimanusa.com/api/register', form);
      toast.success('Registrasi berhasil. Silakan login.');
      navigate('/login');
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        error.response?.data?.errors?.password?.[0] ||
        'Registrasi gagal. Periksa kembali input Anda.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-red-300 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Register AHM</h2>

        <div className="relative mb-4">
          <User className="absolute left-3 top-3 text-red-400 w-5 h-5" />
          <input
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            className="pl-10 pr-4 py-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-red-700"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 text-red-400 w-5 h-5" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="pl-10 pr-4 py-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-red-700"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative mb-4">
          <Lock className="absolute left-3 top-3 text-red-400 w-5 h-5" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="pl-10 pr-4 py-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-red-700"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative mb-6">
          <Lock className="absolute left-3 top-3 text-red-400 w-5 h-5" />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Konfirmasi Password"
            className="pl-10 pr-4 py-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-red-700"
            value={form.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          {isSubmitting ? 'Mendaftar...' : 'Daftar'}
        </button>

        <p className="text-center text-sm text-red-500 mt-4">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-red-600 font-semibold hover:underline">
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
