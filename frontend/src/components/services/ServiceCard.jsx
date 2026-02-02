import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Star, Zap, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const ServiceCard = ({ service, isInitiallyFavorite = false }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/favorites/${service.id}`);
      setIsFavorite(res.data.isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group card bg-white overflow-hidden p-0 h-full border-none relative">
      <Link
        to={`/services/${service.id}`}
        className="block h-full flex flex-col"
      >
        {/* Service Image */}
        {service.image_url ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={`http://localhost:5001${service.image_url}`}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          <div className="relative h-48 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
            <div className="text-6xl opacity-20">
              {service.category === 'Образование' && '🎓'}
              {service.category === 'IT и технологии' && '💻'}
              {service.category === 'Ремонт и строительство' && '🛠️'}
              {service.category === 'Творчество и дизайн' && '🎨'}
              {service.category === 'Кулинария' && '🍳'}
              {service.category === 'Консультации' && '🤝'}
              {service.category === 'Красота и здоровье' && '✨'}
              {service.category === 'Языки' && '🌍'}
              {service.category === 'Транспорт' && '🚗'}
              {service.category === 'Помощь по дому' && '🏠'}
            </div>
          </div>
        )}

        <div className="p-8 flex flex-col flex-1">
          {/* Category & Price */}
          <div className="flex justify-between items-center mb-6">
            <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              {service.category}
            </span>
            <div className="flex items-center gap-1.5 font-display font-bold text-text-primary text-xl">
              <Clock size={18} className="text-primary" />
              {service.duration}ч
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl mb-3 group-hover:text-primary transition-colors leading-tight pr-8">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-text-secondary text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
            {service.description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted">
              <MapPin size={14} className="text-secondary" />
              {service.city || 'Удаленно'}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase tracking-tighter">
              <Zap size={14} className="text-accent" />
              {service.location_type === 'online' ? 'Онлайн' : 'Оффлайн'}
            </div>
          </div>

          {/* Provider Info */}
          <div className="flex items-center gap-3 pt-6 border-t border-surface-dark mt-auto">
            {service.provider_avatar ? (
              <img
                src={`http://localhost:5001${service.provider_avatar}`}
                alt={service.provider_name}
                className="w-10 h-10 rounded-xl object-cover shadow-soft group-hover:scale-105 transition-transform"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-soft group-hover:scale-105 transition-transform"
                style={{ backgroundColor: '#8B9D77' }}
              >
                {service.provider_name?.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-text-primary truncate">{service.provider_name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={12} fill="#D4A574" color="#D4A574" />
                <span className="text-xs font-bold text-text-secondary">{service.provider_rating?.toFixed(1) || '0.0'}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Favorite Toggle */}
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`
          absolute top-8 right-8 p-2 rounded-xl transition-all duration-300
          ${isFavorite
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'bg-warm-cream text-text-muted hover:bg-primary/10 hover:text-primary'}
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
        `}
      >
        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </div>
  );
};

export default ServiceCard;
