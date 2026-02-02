import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import api from '../../utils/api';

const FilterBar = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [categoriesRes, citiesRes] = await Promise.all([
        api.get('/services/categories'),
        api.get('/services/cities')
      ]);

      setCategories(categoriesRes.data.categories);
      setCities(citiesRes.data.cities);
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-bold font-display" style={{ color: '#E07856' }}>
        <SlidersHorizontal size={20} />
        <span>Фильтры</span>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-2">Поиск</label>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Название услуги..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium mb-2 text-text-secondary">Сортировка</label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-olive focus:border-transparent transition-all"
        >
          <option value="newest">Сначала новые</option>
          <option value="rating_desc">Высокий рейтинг</option>
          <option value="duration_desc">Длинные сессии</option>
          <option value="duration_asc">Короткие сессии</option>
          <option value="oldest">Сначала старые</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2 text-text-secondary">Категория</label>
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-olive focus:border-transparent transition-all"
        >
          <option value="">Все категории</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2 text-text-secondary">Минимальный рейтинг</label>
        <div className="flex flex-wrap gap-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => onFilterChange({ ...filters, min_rating: rating || '' })}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-bold transition-all border
                ${(filters.min_rating == rating || (!filters.min_rating && rating === 0))
                  ? 'bg-olive text-white border-olive shadow-md'
                  : 'bg-white text-text-muted border-gray-100 hover:border-olive/30 hover:bg-olive/5'}
              `}
            >
              {rating === 0 ? 'Все' : `${rating}+ ⭐`}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium mb-2 text-text-secondary">Город</label>
        <select
          value={filters.city || ''}
          onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-olive focus:border-transparent transition-all text-sm"
        >
          <option value="">Все города</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Location Type */}
      <div>
        <label className="block text-sm font-medium mb-2 text-text-secondary">Формат</label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: '', label: 'Все форматы' },
            { id: 'online', label: '🌐 Онлайн' },
            { id: 'offline', label: '📍 Оффлайн' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => onFilterChange({ ...filters, location_type: type.id })}
              className={`
                px-4 py-2 rounded-xl text-sm text-left transition-all border
                ${(filters.location_type === type.id)
                  ? 'bg-warm-cream/50 text-olive border-olive/30 font-bold'
                  : 'bg-white text-text-muted border-gray-100 hover:bg-warm-cream/20'}
              `}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {Object.keys(filters).some(key => filters[key] && key !== 'sort') && (
        <button
          onClick={() => onFilterChange({ sort: filters.sort })}
          className="w-full py-3 text-sm font-bold text-terracotta bg-terracotta/5 border border-terracotta/10 rounded-xl hover:bg-terracotta/10 transition-all mt-4"
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );
};

export default FilterBar;
