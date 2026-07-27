import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FiSend, FiUser, FiSearch } from 'react-icons/fi';

const CoachMessages = () => {
  const { user, token } = useSelector((state) => state.auth);
  
  const [clients, setClients] = useState([]);
  const [activeClient, setActiveClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch all assigned clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/clients/my-clients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setClients(response.data.data);
          // Auto-select first client if available
          if (response.data.data.length > 0) {
            setActiveClient(response.data.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoadingClients(false);
      }
    };
    if (token) fetchClients();
  }, [token]);

  const handleClientSelect = async (client) => {
    setActiveClient(client);
    
    // If the client has unread messages, mark them as read
    if (client.unreadCount > 0) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/messages/mark-read/${client._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Clear locally
        setClients(prev => prev.map(c => 
          c._id === client._id ? { ...c, unreadCount: 0 } : c
        ));
      } catch (error) {
        console.error('Error marking messages read:', error);
      }
    }
  };

  // Fetch messages for active client
  const fetchMessages = async () => {
    if (!activeClient) return;
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/messages/${activeClient._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (token && activeClient) {
      setLoadingMessages(true);
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [token, activeClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeClient) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/messages`, 
        { receiverId: activeClient._id, text: inputText },
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

  return (
    <div className="coach-messages-container">
      
      {/* Sidebar: Client List */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card"
        style={{ width: '350px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 1rem 0' }}>Your Clients</h2>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search clients..." 
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
            />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingClients ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading clients...</div>
          ) : clients.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No clients assigned yet.</div>
          ) : (
            clients.map(client => (
              <div 
                key={client._id}
                onClick={() => handleClientSelect(client)}
                style={{ 
                  padding: '1rem 1.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: '1rem', 
                  cursor: 'pointer',
                  background: activeClient?._id === client._id ? '#f1f5f9' : 'white',
                  borderLeft: activeClient?._id === client._id ? '4px solid var(--primary-blue)' : '4px solid transparent',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    {client.profileImage ? <img src={client.profileImage} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="" /> : <FiUser color="#94a3b8" />}
                  </div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                    <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1rem' }}>{client.fullName}</h4>
                    <p style={{ margin: 0, color: client.unreadCount > 0 ? '#3b82f6' : '#64748b', fontSize: '0.8rem', fontWeight: client.unreadCount > 0 ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {client.latestMessageText ? client.latestMessageText : 'No messages yet'}
                    </p>
                  </div>
                </div>
                
                {client.unreadCount > 0 && (
                  <div style={{
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {client.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        {activeClient ? (
          <>
            {/* Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {activeClient.profileImage ? (
                  <img src={activeClient.profileImage} alt="Client" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <FiUser size={24} />
                )}
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>{activeClient.fullName}</h1>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                  {activeClient.fitnessGoal ? `Goal: ${activeClient.fitnessGoal}` : 'Client'}
                </p>
              </div>
            </div>
            
            {/* Chat Area */}
            <div style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {loadingMessages ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Loading messages...</div>
              ) : messages.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
                  <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.25rem' }}>No messages yet</h3>
                  <p style={{ fontSize: '0.9rem' }}>Send a message to {activeClient.fullName} to start the conversation.</p>
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
                  placeholder={`Message ${activeClient.fullName}...`}
                  style={{ flex: 1, padding: '0.85rem 1.25rem', borderRadius: '24px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: '0.95rem' }}
                />
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="btn-modern-primary" 
                  style={{ borderRadius: '50%', width: '46px', height: '46px', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: !inputText.trim() ? 0.5 : 1 }}
                >
                  <FiSend size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            <FiUser size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>Select a client</h3>
            <p>Choose a client from the sidebar to view your conversation.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CoachMessages;
