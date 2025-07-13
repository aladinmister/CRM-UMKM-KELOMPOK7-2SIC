import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const role = searchParams.get('role');

    console.log('DEBUG token:', token);
    console.log('DEBUG role:', role);

    if (token && role) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirect sesuai role
      if (role === 'admin') {
        navigate('/dashboardAdmin');
      } else {
        navigate('/');
      }
    } else {
      alert('Login Google gagal!');
      navigate('/login');
    }
  }, [navigate, location]);

  return (
    <div className="flex justify-center items-center h-screen text-red-700 font-semibold text-lg">
      Memproses login Google...
    </div>
  );
};

export default OAuthSuccess;
