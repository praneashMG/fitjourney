import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import LandingNavbar from '../../components/layout/LandingNavbar';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiInstagram, FiLinkedin, FiPlus, FiMinus } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`}/public/contact`, formData);
      toast.success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const faqs = [
    { q: 'How long does it take to hear back?', a: 'Our support team typically responds within 24 hours during business days.' },
    { q: 'Do you offer custom enterprise pricing?', a: 'Yes, if you manage a gym with over 50 trainers, please contact us for a custom quote.' },
    { q: 'I am having technical issues with the app.', a: 'Please select "Technical Support" as your subject line so we can route it to our engineers immediately.' }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflowX: 'hidden' }}>
      <LandingNavbar />
      
      {/* SECTION 1: HERO */}
      <section style={{ paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-1px' }}>
            We'd love to hear from you.
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2: CONTACT FORM & SECTION 3: DIRECT CHANNELS */}
      <section style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
          
          {/* Direct Channels (Left) */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '2rem' }}>Get in touch</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FiMail size={24} /></div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>Chat with Sales</h3>
                  <p style={{ color: '#64748b', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Speak to our friendly team.</p>
                  <a href="mailto:sales@fitjourney.com" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>sales@fitjourney.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', background: '#dcfce7', color: '#16a34a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FiPhone size={24} /></div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>Call Us</h3>
                  <p style={{ color: '#64748b', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Mon-Fri from 8am to 5pm.</p>
                  <a href="tel:+11234567890" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>+1 (123) 456-7890</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', background: '#fee2e2', color: '#dc2626', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FiMapPin size={24} /></div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>Visit Us</h3>
                  <p style={{ color: '#64748b', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Visit our HQ in person.</p>
                  <span style={{ color: '#dc2626', fontWeight: 600 }}>100 Fitness Way, NY 10001</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form (Right) */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>First Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Subject</label>
                <input required type="text" name="subject" value={formData.subject} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Message</label>
                <textarea required name="message" value={formData.message} onChange={handleChange} rows="4" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', resize: 'vertical' }}></textarea>
              </div>

              <button type="submit" disabled={loading} style={{ padding: '1rem', background: '#0f172a', color: 'white', fontWeight: 600, borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: FAQ */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: activeFaq === i ? '#f8fafc' : 'white', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '1.1rem' }}>{faq.q}</span>
                  {activeFaq === i ? <FiMinus color="#64748b" /> : <FiPlus color="#64748b" />}
                </button>
                {activeFaq === i && (
                  <div style={{ padding: '0 1.5rem 1.5rem', background: '#f8fafc', color: '#475569', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: SOCIALS & FOOTER CTA */}
      <section style={{ padding: '60px 20px', background: '#0f172a', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Follow Our Journey</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
            <a href="#" style={{ color: 'white', opacity: 0.8 }}><FiTwitter size={32} /></a>
            <a href="#" style={{ color: 'white', opacity: 0.8 }}><FiInstagram size={32} /></a>
            <a href="#" style={{ color: 'white', opacity: 0.8 }}><FiLinkedin size={32} /></a>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>© 2026 FitJourney Inc. All rights reserved.</p>
        </div>
      </section>

    </div>
  );
};

export default Contact;
