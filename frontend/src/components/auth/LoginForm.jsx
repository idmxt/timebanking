import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-cream p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="blob w-[400px] h-[400px] bg-primary/10 -top-20 -left-20" />
      <div className="blob w-[300px] h-[300px] bg-accent/10 -bottom-10 -right-10 delay-300" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform group-hover:scale-110">
              TB
            </div>
          </Link>
          <h2 className="hero-title text-4xl mb-3">С возвращением!</h2>
          <p className="text-text-secondary">Продолжайте делиться временем</p>
        </div>

        <div className="card p-10 bg-white/80 backdrop-blur-sm">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-error" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="block text-sm font-bold text-text-primary">
                  Пароль
                </label>
                <Link to="/forgot-password" size="small" className="text-sm font-bold text-secondary hover:underline">
                  Забыли?
                </Link>
              </div>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-xl mt-4"
            >
              {loading ? 'Вход...' : 'Войти в аккаунт'}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-surface-dark">
            <p className="text-text-secondary">
              Нет аккаунта?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-text-muted font-medium bg-surface-dark/50 inline-block px-4 py-2 rounded-full">
            Тестовый вход: <span className="text-text-primary">john@example.com / password123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
