import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import ServiceCard from '../components/services/ServiceCard';
import FilterBar from '../components/services/FilterBar';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const Services = () => {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, [filters]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await api.get(`/services?${params.toString()}`);
      setServices(response.data.services);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-cream pb-12 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight mb-3 sm:mb-4 text-text-primary leading-[1.1]">
              Найдите своего <span className="text-primary italic">мастера</span> идеального времени
            </h1>
            <p className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed">
              От цифрового дизайна до садоводства — обменивайтесь навыками в нашем уютном сообществе единомышленников.
            </p>
          </div>
          {isAuthenticated && (
            <Link
              to="/services/create"
              className="btn-primary group !py-4 sm:!py-5 !px-6 sm:!px-8 flex items-center justify-center gap-2 sm:gap-3 transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
            >
              <Plus size={20} strokeWidth={2.5} className="sm:hidden" />
              <Plus size={24} strokeWidth={2.5} className="hidden sm:block" />
              <span className="font-bold text-base sm:text-lg">Создать услугу</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="card p-4 sm:p-6 lg:p-8 bg-white lg:sticky lg:top-24">
              <FilterBar filters={filters} onFilterChange={setFilters} />
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="card p-20 text-center bg-white">
                <div className="icon-wrapper bg-surface-dark mb-6">
                  <Search size={40} className="text-text-muted" />
                </div>
                <h3 className="text-2xl mb-2">Ничего не нашли</h3>
                <p className="text-text-muted">Попробуйте изменить параметры поиска или фильтры</p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-text-muted font-bold uppercase tracking-wider text-sm">
                    Найдено: <span className="text-text-primary">{services.length}</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                  {services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
