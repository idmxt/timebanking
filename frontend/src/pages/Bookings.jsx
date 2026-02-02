import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { AlertCircle } from 'lucide-react';
import BookingList from '../components/bookings/BookingList';
import ReviewForm from '../components/reviews/ReviewForm';

const Bookings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReviewBooking, setSelectedReviewBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/bookings');
      setBookings(res.data.bookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError('Не удалось загрузить бронирования');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      setError(null);
      let endpoint = `/bookings/${id}/${action}`;
      if (action === 'confirm') endpoint = `/bookings/${id}/confirm`;
      
      await api.put(endpoint);
      loadBookings();
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      setError('Ошибка при обновлении статуса');
    }
  };

  const tabs = [
    { id: 'incoming', label: 'Входящие запросы', role: 'provider', statuses: ['pending', 'accepted'] },
    { id: 'outgoing', label: 'Мои запросы', role: 'requester', statuses: ['pending', 'accepted'] },
    { id: 'completed', label: 'Завершенные', statuses: ['completed'] },
    { id: 'cancelled', label: 'Отмененные', statuses: ['cancelled', 'declined'] }
  ];

  const filteredBookings = bookings.filter(booking => {
    const tab = tabs.find(t => t.id === activeTab);
    
    // Filter by status
    if (!tab.statuses.includes(booking.status)) return false;

    // Additional filtering for active tabs
    if (activeTab === 'incoming') {
      return booking.provider_id === user.id;
    }
    if (activeTab === 'outgoing') {
      return booking.requester_id === user.id;
    }
    if (activeTab === 'completed') {
      return booking.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return ['cancelled', 'declined'].includes(booking.status);
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-warm-cream pb-20 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <h1 className="text-4xl sm:text-5xl font-display mb-4">
          Управление <span className="text-primary italic">бронированиями</span>
        </h1>
        <p className="text-text-secondary text-lg">Следите за вашими обменами временем и запросами</p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm flex items-center gap-3 animate-fade-in">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
        {/* Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105' 
                  : 'bg-white text-text-muted hover:bg-white/80'}
              `}
            >
              {tab.label}
              {bookings.filter(b => {
                if (!tab.statuses.includes(b.status)) return false;
                if (tab.id === 'incoming') return b.provider_id === user.id;
                if (tab.id === 'outgoing') return b.requester_id === user.id;
                return true;
              }).length > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-lg text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                  {bookings.filter(b => {
                    if (!tab.statuses.includes(b.status)) return false;
                    if (tab.id === 'incoming') return b.provider_id === user.id;
                    if (tab.id === 'outgoing') return b.requester_id === user.id;
                    return true;
                  }).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <BookingList 
          bookings={filteredBookings}
          user={user}
          onAction={handleAction}
          onReview={(booking) => setSelectedReviewBooking(booking)}
          loading={loading}
        />
      </div>

      {selectedReviewBooking && (
        <ReviewForm 
          booking={selectedReviewBooking}
          onClose={() => setSelectedReviewBooking(null)}
          onSuccess={() => {
            setSelectedReviewBooking(null);
            loadBookings();
          }}
        />
      )}
    </div>
  );
};

export default Bookings;
