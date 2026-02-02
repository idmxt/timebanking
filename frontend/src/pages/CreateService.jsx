import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, Clock, MapPin, Globe, ChevronDown,
  Plus, X, Calendar, Check, AlertCircle, Sparkles
} from 'lucide-react';
import api from '../utils/api';

const categories = [
  { id: 'Образование', icon: '🎓' },
  { id: 'IT и технологии', icon: '💻' },
  { id: 'Ремонт и строительство', icon: '🛠️' },
  { id: 'Творчество и дизайн', icon: '🎨' },
  { id: 'Кулинария', icon: '🍳' },
  { id: 'Консультации', icon: '🤝' },
  { id: 'Красота и здоровье', icon: '✨' },
  { id: 'Языки', icon: '🌍' },
  { id: 'Транспорт', icon: '🚗' },
  { id: 'Помощь по дому', icon: '🏠' }
];

const CreateService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: 1,
    location_type: 'online',
    city: '',
    address: '',
    schedule: []
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.category) {
      setError('Пожалуйста, выберите категорию');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'schedule') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      if (image) data.append('image', image);

      await api.post('/services', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard'); // Редирект в дашборд после создания
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-cream pb-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl mb-2">Создать новую <span className="text-primary italic">услугу</span></h1>
          <p className="text-text-secondary text-lg">Поделитесь своими талантами с сообществом</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Info Card */}
          <div className="card p-8 sm:p-10 bg-white">
            <h2 className="text-2xl mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">1</div>
              Основная информация
            </h2>

            <div className="space-y-6">
              {/* Category Selection */}
              <div className="relative">
                <label className="block text-sm font-bold text-text-primary mb-2 ml-1">Категория*</label>
                <button
                  type="button"
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className={`w-full flex items-center justify-between input-field ${!formData.category && 'text-text-muted'}`}
                >
                  <span className="flex items-center gap-2">
                    {formData.category ? (
                      <>
                        <span>{categories.find(c => c.id === formData.category)?.icon}</span>
                        <span className="text-text-primary">{formData.category}</span>
                      </>
                    ) : 'Выберите категорию'}
                  </span>
                  <ChevronDown size={20} className={`transition-transform duration-300 ${showCategoryMenu ? 'rotate-180' : ''}`} />
                </button>

                {showCategoryMenu && (
                  <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-lifted border border-primary/5 py-2 animate-fade-in">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, category: cat.id });
                          setShowCategoryMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-6 py-3 hover:bg-warm-cream transition-colors text-left"
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium text-text-secondary hover:text-primary">{cat.id}</span>
                        {formData.category === cat.id && <Check size={18} className="ml-auto text-success" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2 ml-1">Название услуги*</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Например: Уроки игры на гитаре для начинающих"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2 ml-1">Описание*</label>
                <textarea
                  required
                  rows="5"
                  className="input-field resize-none"
                  placeholder="Расскажите подробнее, что входит в услугу, ваш опыт и какой результат получит человек..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Details & Location Card */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 bg-white">
              <h2 className="text-2xl mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm">2</div>
                Длительность
              </h2>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-4 ml-1">
                  Стоимость (в часах): <span className="text-primary text-xl ml-2">{formData.duration}ч</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.5"
                  className="w-full h-2 bg-surface-dark rounded-lg appearance-none cursor-pointer accent-primary"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                />
                <div className="flex justify-between mt-2 text-xs text-text-muted font-bold">
                  <span>0.5ч</span>
                  <span>4ч</span>
                  <span>8ч</span>
                </div>
              </div>
            </div>

            <div className="card p-8 bg-white">
              <h2 className="text-2xl mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-sm">3</div>
                Формат и локация
              </h2>

              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, location_type: 'online' })}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.location_type === 'online'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-surface-dark text-text-muted hover:border-primary/20'
                    }`}
                >
                  <Globe size={24} />
                  <span className="text-sm font-bold">Онлайн</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, location_type: 'offline' })}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.location_type === 'offline'
                    ? 'border-secondary bg-secondary/5 text-secondary'
                    : 'border-surface-dark text-text-muted hover:border-secondary/20'
                    }`}
                >
                  <MapPin size={24} />
                  <span className="text-sm font-bold">Оффлайн</span>
                </button>
              </div>

              {formData.location_type === 'offline' && (
                <div className="space-y-4 animate-fade-in">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Город"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Адрес (необязательно)"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Media & Schedule Card */}
          <div className="card p-8 sm:p-10 bg-white">
            <h2 className="text-2xl mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">4</div>
              Фото и расписание
            </h2>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-text-primary mb-4 ml-1">Обложка услуги</label>
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`relative group h-64 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${isDragging ? 'border-primary bg-primary/5' : 'border-surface-dark hover:border-primary/30'
                    }`}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImage(null); setPreview(null); }}
                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-error hover:bg-white transition-colors shadow-soft"
                      >
                        <X size={20} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 rounded-2xl bg-warm-cream flex items-center justify-center text-text-muted mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <Camera size={32} />
                      </div>
                      <p className="text-sm font-bold text-text-primary mb-1">Перетащите фото сюда</p>
                      <p className="text-xs text-text-muted">или нажмите для выбора</p>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageSelect}
                        accept="image/*"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-bold text-text-primary mb-4 ml-1">Предпочтительное время</label>
                <div className="space-y-3">
                  {[
                    { id: 'weekdays', label: 'Будние дни', time: '18:00 - 21:00' },
                    { id: 'weekends', label: 'Выходные', time: '10:00 - 18:00' },
                    { id: 'flexible', label: 'Гибкий график', time: 'По договоренности' }
                  ].map((item) => (
                    <label key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-surface-dark hover:border-primary/20 transition-all cursor-pointer group">
                      <div className="w-10 h-10 rounded-xl bg-warm-cream flex items-center justify-center text-text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Calendar size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-text-primary">{item.label}</p>
                        <p className="text-xs text-text-muted">{item.time}</p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-md border-surface-dark text-primary focus:ring-primary"
                        checked={formData.schedule.includes(item.id)}
                        onChange={(e) => {
                          const newSchedule = e.target.checked
                            ? [...formData.schedule, item.id]
                            : formData.schedule.filter(id => id !== item.id);
                          setFormData({ ...formData, schedule: newSchedule });
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm flex items-center gap-3 animate-fade-in">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1 !py-4"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-[2] !py-4 text-xl shadow-lifted"
            >
              {loading ? 'Создание...' : 'Опубликовать услугу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;
