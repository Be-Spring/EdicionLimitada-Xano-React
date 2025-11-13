import './CierreSesion.css'

function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/'; // o usa navigate('/')
  };
  return <button onClick={handleLogout} className="btn btn-outline-light">Cerrar sesión</button>;
}