import { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // Dummy login - bisa diganti dengan API call
    if (email === 'admin@example.com' && password === 'admin123') {
      localStorage.setItem('role', 'admin')
      navigate('/dashboardAdmin')
    } else if (email === 'user@example.com' && password === 'user123') {
      localStorage.setItem('role', 'user')
      navigate('/')
    } else {
      alert('Email atau password salah.\n\nAdmin:\nadmin@example.com / admin123\nUser:\nuser@example.com / user123')
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'https://ahm.inspirasienergiprimanusa.com/api/login/google'
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Email"
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative mb-6">
          <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="password"
            placeholder="Password"
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
          Sign In
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Login dengan Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-600 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
