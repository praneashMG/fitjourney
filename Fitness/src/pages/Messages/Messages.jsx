import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { FiSend, FiUser } from 'react-icons/fi';
import CoachMessages from './CoachMessages';
import { fetchUserProfile } from '../../redux/slices/authSlice';

const Messages = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  // If assignedCoach is a string (unpopulated), we need to fetch the populated profile
  const coach = typeof user?.assignedCoach === 'object' ? user?.assignedCoach : null;

  useEffect(() => {
    if (user?.assignedCoach && typeof user.assignedCoach === 'string') {
      dispatch(fetchUserProfile());
    }
  }, [user?.assignedCoach, dispatch]);
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!coach) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/messages/${coach._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
      // Simple polling for real-time feel (every 5 seconds)
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [token, coach]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !coach) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/messages`, 
        { receiverId: coach._id, text: inputText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setMessages([...messages, response.data.data]);
        setInputText('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (user?.role === 'Coach') {
    return <CoachMessages />;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {coach?.profileImage ? (
              <img src={coach.profileImage} alt="Coach" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <FiUser size={24} />
            )}
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
              {coach ? coach.fullName : 'No Coach Assigned'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              {coach ? 'Assigned Coach' : 'Please contact admin'}
            </p>
          </div>
        </div>
        
        {/* Chat Area */}
        <div style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Loading messages...
            </div>
          ) : !coach ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              You don't have a coach assigned yet.
            </div>
          ) : messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.25rem' }}>No messages yet</h3>
              <p style={{ fontSize: '0.9rem' }}>Send a message to {coach.fullName} to get started!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.sender === user?._id;
              return (
                <div key={msg._id || index} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    background: isMine ? 'var(--primary-blue)' : 'white',
                    color: isMine ? 'white' : '#0f172a',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '16px',
                    borderBottomRightRadius: isMine ? '4px' : '16px',
                    borderBottomLeftRadius: !isMine ? '4px' : '16px',
                    maxWidth: '70%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    border: isMine ? 'none' : '1px solid #e2e8f0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.4' }}>{msg.text}</p>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: isMine ? 'rgba(255,255,255,0.7)' : '#94a3b8', marginTop: '0.25rem', textAlign: isMine ? 'right' : 'left' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.25rem 2rem', background: 'white', borderTop: '1px solid #e2e8f0' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={coach ? `Message ${coach.fullName}...` : "You cannot send messages"}
              disabled={!coach}
              style={{ flex: 1, padding: '0.85rem 1.25rem', borderRadius: '24px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: '0.95rem' }}
            />
            <button 
              type="submit" 
              disabled={!coach || !inputText.trim()}
              className="btn-modern-primary" 
              style={{ borderRadius: '50%', width: '46px', height: '46px', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: (!coach || !inputText.trim()) ? 0.5 : 1 }}
            >
              <FiSend size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Messages;
