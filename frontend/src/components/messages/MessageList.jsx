import React from 'react';
import { Check, CheckCheck, FileText, Download } from 'lucide-react';

const MessageList = ({ messages, currentUserId, messagesLoading, isTyping, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
      {messagesLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isOwn = msg.sender_id === currentUserId;
          const showDate = index === 0 ||
            new Date(messages[index - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();

          return (
            <React.Fragment key={msg.id}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="px-4 py-1.5 bg-white/50 backdrop-blur-sm rounded-full text-[10px] font-bold text-text-muted uppercase tracking-widest border border-primary/5 shadow-sm">
                    {new Date(msg.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  </span>
                </div>
              )}
              <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[80%] sm:max-w-[70%] group`}>
                  <div className={`
                    px-5 py-3.5 rounded-[24px] shadow-sm relative transition-all duration-300
                    ${isOwn
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white text-text-primary rounded-tl-none border border-primary/5'}
                  `}>
                    {msg.attachment_url && (
                      <div className="mb-3">
                        {msg.attachment_type === 'image' ? (
                          <div className="rounded-2xl overflow-hidden border border-white/20 shadow-sm max-w-[300px]">
                            <img
                              src={`http://localhost:5001${msg.attachment_url}`}
                              alt="attachment"
                              className="w-full h-auto cursor-pointer hover:scale-105 transition-transform duration-500"
                              onClick={() => window.open(`http://localhost:5001${msg.attachment_url}`, '_blank')}
                            />
                          </div>
                        ) : (
                          <a
                            href={`http://localhost:5001${msg.attachment_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isOwn
                                ? 'bg-white/10 border-white/20 hover:bg-white/20'
                                : 'bg-warm-cream/30 border-primary/5 hover:bg-warm-cream/50'
                              }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOwn ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                              <FileText size={20} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-xs font-bold truncate">Файл</p>
                              <p className={`text-[10px] ${isOwn ? 'text-white/70' : 'text-text-muted'}`}>Нажмите, чтобы открыть</p>
                            </div>
                            <Download size={16} className={isOwn ? 'text-white/70' : 'text-text-muted'} />
                          </a>
                        )}
                      </div>
                    )}
                    {msg.content && <p className="text-sm leading-relaxed">{msg.content}</p>}

                    <div className={`
                      flex items-center gap-1.5 mt-2
                      ${isOwn ? 'justify-end' : 'justify-start'}
                    `}>
                      <span className={`text-[10px] font-bold ${isOwn ? 'text-white/70' : 'text-text-muted'}`}>
                        {new Date(msg.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isOwn && (
                        msg.is_read ? <CheckCheck size={12} className="text-white/70" /> : <Check size={12} className="text-white/70" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })
      )}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex justify-start animate-fade-in">
          <div className="bg-white px-5 py-3 rounded-[24px] rounded-tl-none border border-primary/5 shadow-sm flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
