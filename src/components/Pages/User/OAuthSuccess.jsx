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
      navigate(role === 'admin' ? '/dashboardAdmin' : '/');
    } else {
      alert('Login Google gagal!');
      navigate('/login');
    }
  }, [navigate, location]);

  return <div>Memproses login Google...</div>;
};

export default OAuthSuccess;
