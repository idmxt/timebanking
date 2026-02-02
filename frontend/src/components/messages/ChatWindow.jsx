import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Send,
  User as UserIcon,
  MoreVertical,
  ChevronLeft,
  Smile,
  Paperclip,
  Image as ImageIcon,
  X,
  FileText,
  UserCircle,
  Trash2
} from 'lucide-react';
import MessageList from './MessageList';

const ChatWindow = ({
  selectedConversation,
  onBack,
  messages,
  currentUserId,
  messagesLoading,
  isTyping,
  messagesEndRef,
  newMessage,
  setNewMessage,
  onSendMessage,
  onFileSelect,
  selectedFile,
  removeSelectedFile
}) => {
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMessages = chatSearchQuery.trim()
    ? messages.filter(m => m.content?.toLowerCase().includes(chatSearchQuery.toLowerCase()))
    : messages;

  const handleClearHistory = () => {
    if (window.confirm('Вы уверены, что хотите очистить историю переписки? (Это действие очистит историю только для вас в текущей сессии)')) {
      // For now, this is a local action as we don't have a backend endpoint for deleting entire conversations yet.
      // In a real app, we'd call an API.
      setIsMoreMenuOpen(false);
      alert('История очищена (демо)');
    }
  };

  const commonEmojis = ['😊', '😂', '😍', '👋', '👍', '🙏', '🔥', '✨', '✅', '⏰', '🤝', '🙌'];

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  if (!selectedConversation) {
    return (
      <div className="flex-1 flex flex-col bg-warm-cream/20 items-center justify-center text-center p-10">
        <div className="w-24 h-24 bg-primary/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-primary/40 animate-bounce-slow">
          <Send size={48} />
        </div>
        <h2 className="text-3xl font-display mb-2">Ваш мессенджер</h2>
        <p className="text-text-muted max-w-xs">Выберите собеседника из списка слева, чтобы начать общение.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-warm-cream/20 h-full">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-white border-b border-surface-dark flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 hover:bg-warm-cream rounded-xl transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          {!isSearchOpen ? (
            <>
              <div className="relative">
                {selectedConversation.other_user.avatar_url ? (
                  <img
                    src={`http://localhost:5001${selectedConversation.other_user.avatar_url}`}
                    alt={selectedConversation.other_user.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <UserIcon size={20} />
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-white" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-text-primary m-0 leading-tight truncate">{selectedConversation.other_user.name}</h3>
                <p className="text-xs text-success font-bold uppercase tracking-widest mt-0.5">В сети</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center gap-3 animate-fade-in">
              <Search className="text-primary" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Поиск в переписке..."
                className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm font-medium"
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setChatSearchQuery('');
                }}
                className="p-1 hover:bg-warm-cream rounded-lg text-text-muted"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 hover:bg-warm-cream rounded-xl transition-colors text-text-muted hover:text-primary"
            >
              <Search size={20} />
            </button>
          )}

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`p-2.5 rounded-xl transition-colors ${isMoreMenuOpen ? 'bg-primary/5 text-primary' : 'hover:bg-warm-cream text-text-muted'}`}
            >
              <MoreVertical size={20} />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lifted border border-primary/5 py-2 z-50 animate-fade-in">
                <button
                  onClick={() => {
                    navigate(`/profile/${selectedConversation.other_user_id}`);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-warm-cream text-text-secondary transition-colors text-sm font-medium"
                >
                  <UserCircle size={18} />
                  Профиль пользователя
                </button>
                <div className="h-px bg-surface-dark mx-2 my-1" />
                <button
                  onClick={handleClearHistory}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-error/5 text-error transition-colors text-sm font-medium"
                >
                  <Trash2 size={18} />
                  Очистить историю
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <MessageList
        messages={filteredMessages}
        currentUserId={currentUserId}
        messagesLoading={messagesLoading}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
      />

      {/* Message Input */}
      <div className="p-6 bg-white border-t border-surface-dark">
        {selectedFile && (
          <div className="mb-4 p-3 bg-warm-cream/50 rounded-2xl flex items-center justify-between border border-primary/5 animate-fade-in">
            <div className="flex items-center gap-3">
              {selectedFile.type.startsWith('image/') ? (
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-surface-dark">
                  <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-surface-dark text-primary">
                  <Paperclip size={24} />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-text-primary truncate max-w-[200px]">{selectedFile.name}</p>
                <p className="text-xs text-text-muted">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              onClick={removeSelectedFile}
              className="p-2 hover:bg-error/10 text-error rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <form
          onSubmit={onSendMessage}
          className="flex items-center gap-4 bg-warm-cream/50 p-2 rounded-[24px] border border-primary/5 focus-within:border-primary/20 focus-within:bg-white transition-all shadow-inner relative"
        >
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-4 p-4 bg-white rounded-[24px] shadow-lifted border border-primary/5 grid grid-cols-6 gap-2 animate-fade-in z-20">
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-2xl p-2 hover:bg-warm-cream rounded-xl transition-all hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 px-2 border-r border-surface-dark">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => onFileSelect(e.target.files[0])}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-text-muted hover:text-primary transition-colors"
            >
              <Paperclip size={20} />
            </button>

            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => onFileSelect(e.target.files[0])}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current.click()}
              className="p-2 text-text-muted hover:text-primary transition-colors hidden sm:block"
            >
              <ImageIcon size={20} />
            </button>

            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 transition-colors ${showEmojiPicker ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
            >
              <Smile size={20} />
            </button>
          </div>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 bg-transparent border-none py-3 px-2 focus:ring-0 text-sm"
          />

          <button
            type="submit"
            disabled={!newMessage.trim() && !selectedFile}
            className={`
              w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
              ${(newMessage.trim() || selectedFile)
                ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:scale-105 active:scale-95'
                : 'bg-warm-cream text-text-muted cursor-not-allowed'}
            `}
          >
            <Send size={20} className={(newMessage.trim() || selectedFile) ? 'translate-x-0.5' : ''} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
