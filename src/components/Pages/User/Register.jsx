import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Registrasi berhasil (simulasi saja). Silakan login.');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-red-300 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Register AHM</h2>

        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 text-red-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Email"
            className="pl-10 pr-4 py-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-red-700"
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
            className="pl-10 pr-4 py-2 w-full border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-red-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          Daftar
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
