import React, { useState, useMemo } from 'react';
import { Filter, SortAsc, SortDesc, Search, Calendar, LayoutGrid, List as ListIcon } from 'lucide-react';
import BookingCard from './BookingCard';

const BookingList = ({ bookings, user, onAction, onReview, loading }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('list'); // 'list' or 'grid'

  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.service_title.toLowerCase().includes(query) ||
        b.requester_name?.toLowerCase().includes(query) ||
        b.provider_name?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(b => b.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(`${a.booking_date}T${a.booking_time}`);
      const dateB = new Date(`${b.booking_date}T${b.booking_time}`);
      
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'date_asc') return dateA - dateB;
      if (sortBy === 'date_desc') return dateB - dateA;
      return 0;
    });

    return result;
  }, [bookings, filterStatus, sortBy, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Controls Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-[32px] shadow-lifted border border-primary/5 flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Search */}
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Поиск по названию или участнику..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field !pl-12 !py-3 w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-warm-cream/50 p-1.5 rounded-2xl border border-primary/5">
            <button 
              onClick={() => setViewType('list')}
              className={`p-2 rounded-xl transition-all ${viewType === 'list' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-primary'}`}
            >
              <ListIcon size={20} />
            </button>
            <button 
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-xl transition-all ${viewType === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-primary'}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-warm-cream/50 border-none rounded-2xl py-3 px-6 text-sm font-bold text-text-secondary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          >
            <option value="all">Все статусы</option>
            <option value="pending">Ожидают</option>
            <option value="accepted">Приняты</option>
            <option value="completed">Завершены</option>
            <option value="cancelled">Отменены</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-warm-cream/50 border-none rounded-2xl py-3 px-6 text-sm font-bold text-text-secondary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="date_asc">По дате встречи (ближайшие)</option>
            <option value="date_desc">По дате встречи (дальние)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredAndSortedBookings.length === 0 ? (
        <div className="card p-20 text-center bg-white/50 border-dashed border-2 border-primary/10">
          <div className="w-24 h-24 bg-primary/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-primary/30">
            <Filter size={48} />
          </div>
          <h3 className="text-2xl mb-2 font-display">Ничего не найдено</h3>
          <p className="text-text-muted">Попробуйте изменить параметры фильтрации или поиска</p>
        </div>
      ) : (
        <div className={viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
          {filteredAndSortedBookings.map((booking) => (
            <BookingCard 
              key={booking.id}
              booking={booking}
              isProvider={booking.provider_id === user.id}
              onAction={onAction}
              onReview={onReview}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;
