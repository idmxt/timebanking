import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const ConversationItem = ({ conv, isActive, onClick, currentUserId }) => {
  return (
    <button
      onClick={() => onClick(conv)}
      className={`
        w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 relative group
        ${isActive ? 'bg-primary/5' : 'hover:bg-warm-cream/30'}
      `}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-r-full" />
      )}
      
      <div className="relative flex-shrink-0">
        {conv.other_user.avatar_url ? (
          <img 
            src={`http://localhost:5001${conv.other_user.avatar_url}`} 
            alt={conv.other_user.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
            <UserIcon size={24} />
          </div>
        )}
        {conv.unread_count > 0 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {conv.unread_count}
          </div>
        )}
      </div>

      <div className="flex-1 text-left overflow-hidden">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-bold text-text-primary truncate">{conv.other_user.name}</h3>
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
            {conv.last_message ? formatDistanceToNow(new Date(conv.last_message.created_at), { addSuffix: false, locale: ru }) : ''}
          </span>
        </div>
        <p className={`text-sm truncate ${conv.unread_count > 0 ? 'text-text-primary font-bold' : 'text-text-muted'}`}>
          {conv.last_message?.sender_id === currentUserId ? 'Вы: ' : ''}
          {conv.last_message?.content || 'Нет сообщений'}
        </p>
      </div>
    </button>
  );
};

export default ConversationItem;
