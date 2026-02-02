import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock, MapPin, Star, User, Calendar,
  MessageSquare, Shield, ChevronLeft, Share2, Heart,
  Zap, Info, CheckCircle, X, MessageCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import BookingForm from '../components/bookings/BookingForm';
import MessageModal from '../components/messages/MessageModal';
import Loading from '../components/ui/Loading';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [similarServices, setSimilarServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [favoriteSuccess, setFavoriteSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    loadServiceData();
  }, [id]);

  const loadServiceData = async () => {
    setLoading(true);
    try {
      const [serviceRes, similarRes, reviewsRes] = await Promise.all([
        api.get(`/services/${id}`),
        api.get('/services', { params: { limit: 3 } }), // Simplified similar logic
        api.get(`/reviews/service/${id}`)
      ]);
      setService(serviceRes.data.service);
      setIsFavorited(!!serviceRes.data.service.is_favorited);
      setSimilarServices(similarRes.data.services.filter(s => s.id !== parseInt(id)));
      setReviews(reviewsRes.data.reviews);
    } catch (error) {
      console.error('Failed to load service:', error);
    } finally {
      setLoading(false);
      setReviewsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/favorites/${id}`);
      setIsFavorited(res.data.is_favorited);
      if (res.data.is_favorited) {
        setFavoriteSuccess(true);
        setTimeout(() => setFavoriteSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: service.title,
      text: `Посмотрите эту услугу в TimeBank: ${service.title}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  if (loading) return <Loading />;
  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Услуга не найдена</h2>
      <Link to="/services" className="btn-primary">Вернуться в каталог</Link>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-warm-cream pb-20">
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center animate-fade-in">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-secondary hover:text-primary font-bold transition-colors"
          >
            <ChevronLeft size={20} />
            Назад
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="p-3 bg-white rounded-2xl shadow-soft hover:shadow-lifted transition-all text-text-muted hover:text-primary relative group"
              title="Поделиться"
            >
              <Share2 size={20} />
              {shareSuccess && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-text-primary text-white text-[10px] py-1 px-2 rounded-lg whitespace-nowrap animate-bounce-slow">
                  Ссылка скопирована!
                </span>
              )}
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`
              p-3 rounded-2xl shadow-soft hover:shadow-lifted transition-all
              ${isFavorited
                  ? 'bg-primary/5 text-primary border-2 border-primary/20'
                  : 'bg-white text-text-muted hover:text-error'}
            `}
              title={isFavorited ? "Удалить из избранного" : "В избранное"}
            >
              <Heart size={20} className={isFavorited ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">

          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">

            {/* Hero Image */}
            {service.image_url ? (
              <div className="relative h-96 rounded-[32px] overflow-hidden shadow-lifted">
                <img
                  src={`http://localhost:5001${service.image_url}`}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="relative h-96 rounded-[32px] overflow-hidden shadow-lifted bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                <div className="text-9xl opacity-30">
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

            {/* Main Card */}
            <div className="card p-10 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
                    {service.category}
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-bold uppercase tracking-wider">
                    {service.location_type === 'online' ? '🌐 Онлайн' : '📍 Оффлайн'}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl mb-6">{service.title}</h1>

                <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-surface-dark">
                  <div className="flex items-center gap-3">
                    <div className="icon-wrapper !p-2 bg-primary">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Длительность</p>
                      <p className="font-bold text-text-primary">{service.duration} часа</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="icon-wrapper !p-2 bg-secondary">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Локация</p>
                      <p className="font-bold text-text-primary">{service.city || 'Удаленно'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="icon-wrapper !p-2 bg-accent">
                      <Zap size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Сложность</p>
                      <p className="font-bold text-text-primary">Стандартная</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl flex items-center gap-2">
                    <Info size={24} className="text-primary" />
                    Описание услуги
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-wrap">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Availability/Requirements */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-8 bg-white">
                <h4 className="text-xl mb-4 flex items-center gap-2 text-secondary font-bold">
                  <Calendar size={20} />
                  Доступность
                </h4>
                <ul className="space-y-3">
                  {['Будни: 18:00 - 21:00', 'Выходные: По договоренности'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-8 bg-white">
                <h4 className="text-xl mb-4 flex items-center gap-2 text-primary font-bold">
                  <CheckCircle size={20} />
                  Что требуется от вас
                </h4>
                <ul className="space-y-3">
                  {['Хорошее настроение', 'Доступ в интернет', 'Готовность учиться'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Provider & Action */}
          <div className="space-y-8 animate-fade-in delay-200">

            {/* Action Card */}
            <div className="card p-8 bg-white sticky top-24">
              <div className="mb-8">
                <p className="text-sm text-text-muted font-bold uppercase tracking-widest mb-2">Стоимость обмена</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-display font-bold text-primary">{service.duration}ч</span>
                  <span className="text-text-secondary font-medium">временных кредита</span>
                </div>
              </div>

              {user?.id === service.provider_id ? (
                <Link to="/profile/edit" className="btn-secondary w-full text-center block !py-4">
                  Редактировать услугу
                </Link>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => isAuthenticated ? setShowBookingModal(true) : navigate('/login')}
                    className="btn-primary w-full text-xl !py-5 shadow-lifted"
                  >
                    Забронировать
                  </button>
                  <button
                    onClick={() => isAuthenticated ? setShowMessageModal(true) : navigate('/login')}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={20} />
                    Написать мастеру
                  </button>
                </div>
              )}

            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-[40px] p-8 sm:p-10 shadow-soft border border-primary/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-display font-bold flex items-center gap-3">
                  <Star className="text-accent fill-accent" size={24} />
                  Отзывы
                  <span className="text-sm font-bold text-text-muted bg-warm-cream px-3 py-1 rounded-full">
                    {reviews.length}
                  </span>
                </h3>
              </div>

              {reviewsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div key={review.id} className="group pb-8 border-b border-surface-dark last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={review.reviewer_avatar ? `http://localhost:5001${review.reviewer_avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name)}&background=random`}
                            alt={review.reviewer_name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/5"
                          />
                          <div>
                            <h4 className="font-bold text-text-primary">{review.reviewer_name}</h4>
                            <p className="text-xs text-text-muted">
                              {new Date(review.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-xl">
                          <Star size={14} className="text-accent fill-accent" />
                          <span className="text-sm font-bold text-accent">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-text-secondary leading-relaxed bg-warm-cream/30 p-4 rounded-2xl border border-primary/5 italic">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-warm-cream/20 rounded-[32px] border-2 border-dashed border-primary/10">
                  <MessageCircle size={48} className="mx-auto mb-4 text-primary/20" />
                  <p className="text-text-muted font-medium">Пока нет отзывов об этой услуге</p>
                  <p className="text-xs text-text-muted/60 mt-1">Оставьте отзыв первым после завершения бронирования!</p>
                </div>
              )}
            </div>
          </div>

          {/* Provider Card */}
          <Link
            to={`/profile/${service.provider_id}`}
            className="card p-8 bg-white block hover:border-secondary/20 transition-all group"
          >
            <h4 className="text-xs text-text-muted font-bold uppercase tracking-widest mb-6">Мастер</h4>
            <div className="flex items-center gap-4">
              {service.provider_avatar ? (
                <img
                  src={`http://localhost:5001${service.provider_avatar}`}
                  alt={service.provider_name}
                  className="w-20 h-20 rounded-3xl object-cover shadow-lifted group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lifted group-hover:scale-105 transition-transform">
                  {service.provider_name?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xl font-bold text-text-primary group-hover:text-secondary transition-colors">{service.provider_name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star size={16} className="fill-accent text-accent" />
                  <span className="font-bold text-text-primary">{(service.provider_rating || 0).toFixed(1)}</span>
                  <span className="text-text-muted">({service.provider_total_reviews || 0})</span>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-warm-cream/50 rounded-2xl text-sm text-text-secondary leading-relaxed line-clamp-3">
              {service.provider_bio || 'Пользователь пока не добавил описание своего опыта.'}
            </div>
          </Link>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20 animate-fade-in delay-300">
        <h2 className="text-3xl mb-10 flex items-center gap-4">
          Похожие <span className="text-secondary italic">услуги</span>
          <div className="flex-1 h-px bg-surface-dark" />
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {similarServices.map(item => (
            <Link
              key={item.id}
              to={`/services/${item.id}`}
              className="card p-6 bg-white group hover:-translate-y-2 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-primary uppercase">{item.category}</span>
                <span className="font-bold text-text-primary">{item.duration}ч</span>
              </div>
              <h4 className="text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Star size={14} className="fill-accent text-accent" />
                <span>{item.provider_rating.toFixed(1)}</span>
                <span>•</span>
                <span>{item.provider_name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showBookingModal && (
        <BookingForm
          service={service}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            setBookingSuccess(true);
            setTimeout(() => setBookingSuccess(false), 5000);
          }}
        />
      )}

      {showMessageModal && (
        <MessageModal
          service={service}
          onClose={() => setShowMessageModal(false)}
          onSuccess={() => {
            setShowMessageModal(false);
            setMessageSuccess(true);
            setTimeout(() => setMessageSuccess(false), 5000);
          }}
        />
      )}

      {/* Success Toasts */}
      {bookingSuccess && (
        <div className="fixed bottom-10 right-10 z-[110] animate-fade-in group">
          <div className="bg-success text-white px-8 py-4 rounded-2xl shadow-lifted flex items-center gap-4 font-bold border-4 border-white/20">
            <CheckCircle size={28} className="animate-bounce" />
            <div>
              <p>Запрос на бронирование отправлен!</p>
              <p className="text-xs text-white/80 font-medium">Мастер скоро свяжется с вами</p>
            </div>
          </div>
        </div>
      )}

      {favoriteSuccess && (
        <div className="fixed bottom-10 right-10 z-[110] animate-fade-in">
          <div className="bg-primary text-white px-8 py-4 rounded-2xl shadow-lifted flex items-center gap-4 font-bold border-4 border-white/20">
            <Heart size={28} className="animate-pulse fill-current" />
            <p>Услуга добавлена в избранное!</p>
          </div>
        </div>
      )}

      {messageSuccess && (
        <div className="fixed bottom-10 right-10 z-[110] animate-fade-in group">
          <div className="bg-secondary text-white px-8 py-4 rounded-2xl shadow-lifted flex items-center gap-4 font-bold border-4 border-white/20">
            <MessageSquare size={28} className="animate-bounce" />
            <div className="flex-1">
              <p>Сообщение успешно отправлено!</p>
              <button
                onClick={() => navigate('/messages')}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg mt-2 transition-colors inline-block"
              >
                Перейти в диалог
              </button>
            </div>
            <button onClick={() => setMessageSuccess(false)} className="p-1 hover:bg-white/20 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ServiceDetail;
