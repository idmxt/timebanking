import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    city: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-cream p-4 py-20 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="blob w-[500px] h-[500px] bg-secondary/10 top-0 right-0" />
      <div className="blob w-[400px] h-[400px] bg-primary/10 bottom-0 left-0 delay-500" />

      <div className="w-full max-w-xl animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform group-hover:scale-110">
              TB
            </div>
          </Link>
          <h2 className="hero-title text-4xl mb-3">Присоединяйтесь!</h2>
          <p className="text-text-secondary leading-relaxed">Начните менять свои навыки на время прямо сейчас</p>
        </div>

        <div className="card p-10 bg-white/80 backdrop-blur-sm">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-error" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-text-primary mb-2 ml-1">Имя*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Иван Иванов"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2 ml-1">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2 ml-1">Пароль* (6+ симв.)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-text-primary mb-2 ml-1">Город</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input-field"
                placeholder="Алматы"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-text-primary mb-2 ml-1">О себе</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="input-field resize-none"
                placeholder="Расскажите немного о своих талантах..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary md:col-span-2 py-5 text-xl mt-4"
            >
              {loading ? 'Регистрация...' : 'Создать аккаунт'}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-surface-dark">
            <p className="text-text-secondary">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="font-bold text-primary hover:underline">
                Войти в систему
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
