import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import api from '../utils/api';
import ConversationItem from '../components/messages/ConversationItem';
import ChatWindow from '../components/messages/ChatWindow';

const Messages = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);

  const socket = useSocket();

  // Initial load
  useEffect(() => {
    loadConversations();
  }, []);

  // Handle userId from URL
  useEffect(() => {
    if (userId && conversations.length > 0) {
      const existingConv = conversations.find(c => c.other_user.id === parseInt(userId));
      if (existingConv) {
        handleSelectConversation(existingConv);
      } else {
        startNewConversation(userId);
      }
    }
  }, [userId, conversations.length]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      // If message is from/to the selected conversation, add to messages
      if (selectedConversation && (
        message.sender_id === selectedConversation.other_user_id ||
        message.receiver_id === selectedConversation.other_user_id
      )) {
        setMessages(prev => [...prev, message]);
        // Mark as read immediately if we are viewing this chat
        if (message.sender_id === selectedConversation.other_user_id) {
          api.put(`/messages/read/${selectedConversation.other_user_id}`);
        }
      }
      // Reload conversations list to show latest message and unread count
      loadConversations();
    };

    const handleMessagesRead = ({ by_user_id }) => {
      if (selectedConversation && by_user_id === selectedConversation.other_user_id) {
        setMessages(prev => prev.map(m => m.is_read ? m : { ...m, is_read: 1 }));
      }
      loadConversations();
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_sent', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_sent', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [socket, selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data.conversations);
      if (loading) setLoading(false);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const startNewConversation = async (otherUserId) => {
    try {
      setMessagesLoading(true);
      const res = await api.get(`/users/${otherUserId}`);
      const userData = res.data.user;

      setSelectedConversation({
        other_user: {
          id: userData.id,
          name: userData.name,
          avatar_url: userData.avatar_url
        },
        other_user_id: userData.id,
        is_new: true
      });
      setMessages([]);
    } catch (error) {
      console.error('Failed to start new conversation:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const loadMessages = async (otherUserId, showLoading = true) => {
    if (showLoading) setMessagesLoading(true);
    try {
      const res = await api.get(`/messages/${otherUserId}`);
      setMessages(res.data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      if (showLoading) setMessagesLoading(false);
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    loadMessages(conv.other_user.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;
    if (!selectedConversation) return;

    const tempMessage = newMessage.trim();
    const tempFile = selectedFile;
    setNewMessage('');
    setSelectedFile(null);

    try {
      const formData = new FormData();
      formData.append('receiver_id', selectedConversation.other_user.id);
      formData.append('content', tempMessage);
      if (tempFile) {
        formData.append('attachment', tempFile);
      }

      await api.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (selectedConversation.is_new) {
        await loadConversations();
      } else {
        loadMessages(selectedConversation.other_user.id, false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setNewMessage(tempMessage); // Restore on error
      setSelectedFile(tempFile);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-80px)] bg-warm-cream p-4 sm:p-6 lg:p-8 animate-fade-in overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex bg-white rounded-[32px] shadow-lifted border border-primary/5 overflow-hidden">

        {/* Conversations List */}
        <div className={`
          w-full md:w-80 lg:w-96 border-r border-surface-dark flex flex-col bg-white/50 backdrop-blur-sm
          ${selectedConversation ? 'hidden md:flex' : 'flex'}
        `}>
          <div className="p-6 border-b border-surface-dark">
            <h1 className="text-3xl font-display mb-6">Сообщения</h1>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder="Поиск бесед..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-warm-cream/50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar py-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-text-muted">Загрузка...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-10 px-6">
                <p className="text-text-muted">Беседы не найдены</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv.other_user_id}
                  conv={conv}
                  isActive={selectedConversation?.other_user_id === conv.other_user_id}
                  onClick={handleSelectConversation}
                  currentUserId={user.id}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <ChatWindow
          selectedConversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
          messages={messages}
          currentUserId={user.id}
          messagesLoading={messagesLoading}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
          removeSelectedFile={() => setSelectedFile(null)}
        />
      </div>
    </div>
  );
};

export default Messages;
