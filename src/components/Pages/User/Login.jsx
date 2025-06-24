import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        'https://ahm.inspirasienergiprimanusa.com/api/login',
        { email, password }
      );

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Login gagal. Data tidak valid.');
      }

      // Simpan token dan user ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Login berhasil!');

      // Arahkan berdasarkan role
      if (user.role === 'admin') {
        navigate('/dashboardAdmin');
      } else {
        navigate('/');
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login gagal. Cek email atau password Anda.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-red-300 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Login AHM</h2>

        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 text-red-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Email"
            className="pl-10 pr-4 py-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-red-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative mb-6">
          <Lock className="absolute left-3 top-3 text-red-400 w-5 h-5" />
          <input
            type="password"
            placeholder="Password"
            className="pl-10 pr-4 py-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-red-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          {isSubmitting ? 'Masuk...' : 'Masuk'}
        </button>

        <p className="text-center text-sm text-red-500 mt-4">
          Belum punya akun?{' '}
          <Link to="/register" className="text-red-600 font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
