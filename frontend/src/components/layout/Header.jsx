import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  Settings,
  User as UserIcon,
  LogOut,
  Heart,
  Bell,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount, loadNotifications } = useNotifications();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleNotifications = () => {
    if (!showNotifications) {
      loadNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-primary/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg transition-transform group-hover:scale-110" style={{ backgroundColor: '#E07856' }}>
              TB
            </div>
            <span className="text-2xl font-bold font-display" style={{ color: '#2F5233' }}>
              Timebank
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/dashboard"
                className="font-medium text-text-secondary hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/services"
                className="font-medium text-text-secondary hover:text-primary transition-colors"
              >
                Услуги
              </Link>
              <Link
                to="/bookings"
                className="font-medium text-text-secondary hover:text-primary transition-colors"
              >
                Бронирования
              </Link>

              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-surface-dark">
                <Link
                  to="/messages"
                  className="text-text-secondary hover:text-primary transition-colors relative p-2"
                >
                  <MessageSquare size={22} strokeWidth={1.5} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={toggleNotifications}
                    className={`
                      text-text-secondary hover:text-primary transition-all relative p-2 rounded-xl
                      ${showNotifications ? 'bg-primary/5 text-primary' : ''}
                    `}
                  >
                    <Bell size={22} strokeWidth={1.5} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white animate-pulse"></span>
                    )}
                  </button>
                  {showNotifications && (
                    <NotificationDropdown onClose={() => setShowNotifications(false)} />
                  )}
                </div>

                {/* Favorites */}
                <Link
                  to="/favorites"
                  className="relative p-2.5 rounded-2xl bg-warm-cream text-text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <Heart size={20} />
                </Link>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`
                      flex items-center gap-3 p-1 rounded-2xl hover:bg-warm-cream transition-all
                      ${showUserMenu ? 'bg-warm-cream' : ''}
                    `}
                  >
                    {user?.avatar_url ? (
                      <img
                        src={`http://localhost:5001${user.avatar_url}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover shadow-md"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md" style={{ backgroundColor: '#8B9D77' }}>
                        {user?.name?.charAt(0)}
                      </div>
                    )}
                    <ChevronDown size={14} className={`text-text-muted transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-lifted py-3 border border-primary/5 animate-fade-in">
                      <div className="px-4 py-3 border-b border-surface-dark mb-2">
                        <p className="font-bold text-text-primary">{user?.name}</p>
                        <p className="text-xs text-text-muted">{user?.email}</p>
                      </div>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-warm-cream text-text-secondary transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield size={18} />
                          Админ-панель
                        </Link>
                      )}
                      <Link
                        to={`/profile/${user.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-warm-cream text-text-secondary transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserIcon size={18} />
                        Профиль
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-warm-cream text-text-secondary transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={18} />
                        Настройки
                      </Link>
                      <hr className="my-2 border-surface-dark" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-error/5 w-full text-left text-error transition-colors font-medium"
                      >
                        <LogOut size={18} />
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="font-semibold text-text-secondary hover:text-primary transition-colors">
                Вход
              </Link>
              <Link to="/register" className="btn-primary !px-6 !py-2.5 !text-base">
                Регистрация
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <button
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && isAuthenticated && (
          <nav className="md:hidden py-4 border-t">
            <Link
              to="/dashboard"
              className="block py-2 text-gray-700 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/services"
              className="block py-2 text-gray-700 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Услуги
            </Link>
            <Link
              to="/bookings"
              className="block py-2 text-gray-700 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Бронирования
            </Link>
            <Link
              to="/messages"
              className="block py-2 text-gray-700 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Сообщения
            </Link>
            <Link
              to="/favorites"
              className="block py-2 text-gray-700 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Избранное
            </Link>
            <Link
              to={`/profile/${user.id}`}
              className="block py-2 text-gray-700 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Профиль
            </Link>
            <button
              onClick={handleLogout}
              className="block py-2 text-red-600 w-full text-left font-medium mt-2 pt-2 border-t"
            >
              Выйти
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
