import React, { useState } from 'react';
import { Star, MessageSquare, X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const ReviewForm = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [canReview, setCanReview] = useState({ canReview: true });
  const [error, setError] = useState(null);

  React.useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await api.get(`/reviews/can-review/${booking.id}`);
      setCanReview(res.data);
      if (!res.data.canReview && res.data.reason === 'Review already submitted') {
        // We could potentially fetch the actual review here if we wanted
      }
    } catch (err) {
      console.error('Failed to check review status:', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Пожалуйста, выберите оценку');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/reviews', {
        booking_id: booking.id,
        rating,
        comment
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Не удалось отправить отзыв');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-lifted overflow-hidden animate-fade-in border border-primary/5">
        {/* Header */}
        <div className="p-8 bg-gradient-to-br from-secondary to-secondary-dark text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Star size={20} className="text-white fill-white" />
            </div>
            <h2 className="text-2xl font-display font-bold">Оцените встречу</h2>
          </div>
          <p className="text-white/80 text-sm italic font-medium">Ваш отзыв поможет другим участникам сообщества</p>
        </div>

        <div className="p-8">
          {checkingStatus ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-text-muted font-medium italic">Проверяем статус...</p>
            </div>
          ) : !canReview.canReview ? (
            <div className="text-center py-10 animate-fade-in">
              <div className="w-20 h-20 bg-success/10 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-success">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Отзыв уже оставлен</h3>
              <p className="text-text-muted mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                Вы уже поделились своим впечатлением об этой встрече. Спасибо за помощь сообществу!
              </p>
              <button onClick={onClose} className="btn-primary w-full max-w-[200px]">
                Понятно
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm flex items-center gap-3 animate-shake">
                  <AlertCircle size={20} />
                  <span className="font-bold">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Star Rating */}
                <div className="text-center">
                  <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Ваша оценка</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="p-1 transition-all duration-300 hover:scale-125 focus:outline-none"
                      >
                        <Star
                          size={48}
                          className={`
                        transition-all duration-300 
                        ${(hover || rating) >= star ? 'text-accent fill-accent' : 'text-surface-dark fill-surface-dark'}
                        ${rating >= star ? 'scale-110 drop-shadow-md' : ''}
                      `}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-accent font-bold h-6">
                    {rating === 1 && 'Ужасно'}
                    {rating === 2 && 'Плохо'}
                    {rating === 3 && 'Нормально'}
                    {rating === 4 && 'Хорошо'}
                    {rating === 5 && 'Отлично!'}
                  </p>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
                    Ваш комментарий
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-text-muted" size={18} />
                    <textarea
                      className="input-field !pl-12 resize-none h-32"
                      placeholder="Поделитесь вашими впечатлениями о мастере и услуге..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary flex-1"
                  >
                    Позже
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 btn-primary !py-4 shadow-lifted flex items-center justify-center gap-2 ${loading ? 'opacity-50 grayscale' : ''
                      }`}
                  >
                    {loading ? 'Отправка...' : (
                      <>
                        <Send size={20} />
                        Отправить отзыв
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
