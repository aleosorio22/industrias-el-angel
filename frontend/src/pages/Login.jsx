import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import logoIndustrias from '../assets/logo-panaderia.jpg';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await login(formData);
      
      if (response.user.rol === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-cream to-cream-dark p-4 sm:p-6 md:p-8">
      {/* Elemento decorativo superior */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-primary to-secondary"></div>
      
      <div className="w-full max-w-md">
        {/* Logo y encabezado */}
        <div className="mb-8 text-center">
          {/* Reemplazar con el logo real */}
          <div className="mx-auto w-24 h-24 mb-4 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white p-4 rounded-full shadow-medium flex items-center justify-center">
            <img 
              src={logoIndustrias} 
              alt="Industrias El Ángel" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <h1 className="font-display text-heading-3 sm:text-heading-2 md:text-display-2 text-text mb-2 transition-all">
            Industrias El Ángel
          </h1>
          <p className="text-text-light text-base sm:text-lg">
            Sistema de Gestión
          </p>
        </div>
        
        {/* Tarjeta de login */}
        <div className="bg-white rounded-xl shadow-medium transition-all hover:shadow-lg p-6 sm:p-8">
          <h2 className="font-display text-heading-4 text-primary mb-6 text-center">
            Iniciar Sesión
          </h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-text font-medium block mb-2 text-sm sm:text-base">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-text-light" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors bg-cream-light"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="text-text font-medium block mb-2 text-sm sm:text-base">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-text-light" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors bg-cream-light"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-soft hover:shadow-medium flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiLogIn className="text-lg" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
            
            <div className="text-center pt-2">
              <a href="#" className="text-sm text-primary hover:text-primary-dark transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-text-light text-xs sm:text-sm">
          © {new Date().getFullYear()} Industrias El Ángel. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}