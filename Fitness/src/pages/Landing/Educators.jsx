import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LandingNavbar from '../../components/layout/LandingNavbar';
import { FiCheckCircle, FiStar, FiHeart, FiWind } from 'react-icons/fi';

const Educators = () => {
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchEducators = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/public/coaches`);
        setEducators(res.data);
      } catch (error) {
        console.error('Error fetching educators:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducators();
  }, []);

  const filteredEducators = educators.filter(c => 
    !filter || (c.specialization && c.specialization.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflowX: 'hidden' }}>
      <LandingNavbar />
      
      {/* SECTION 1: HERO (Mindful/Calm Theme) */}
      <section style={{ paddingTop: '140px', paddingBottom: '100px', background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)', color: '#312e81', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Elevate Your Mind & Body
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ fontSize: '1.25rem', color: '#4338ca', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Connect with world-class niche educators specialized in Yoga, Pilates, and holistic wellness practices. Achieve balance from the comfort of your home.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px', background: '#4f46e5', border: 'none', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)' }}>
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: SPECIALTIES */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Explore Disciplines</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Deep dive into specialized forms of movement.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <FiWind size={32} />, title: 'Vinyasa Flow', color: '#38bdf8', bg: '#e0f2fe' },
              { icon: <FiHeart size={32} />, title: 'Pilates Core', color: '#ec4899', bg: '#fce7f3' },
              { icon: <FiCheckCircle size={32} />, title: 'Meditation', color: '#8b5cf6', bg: '#ede9fe' },
            ].map((spec, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: '#f8fafc', padding: '2.5rem 2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '80px', height: '80px', background: spec.bg, color: spec.color, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', transform: 'rotate(-5deg)' }}>
                  {spec.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{spec.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: EDUCATOR DIRECTORY */}
      <section style={{ padding: '80px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Master Instructors</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => setFilter('')} className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '50px', background: filter === '' ? '#4f46e5' : 'white', borderColor: filter === '' ? '#4f46e5' : '#cbd5e1' }}>All Profiles</button>
              <button onClick={() => setFilter('yoga')} className={`btn ${filter === 'yoga' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '50px', background: filter === 'yoga' ? '#4f46e5' : 'white', borderColor: filter === 'yoga' ? '#4f46e5' : '#cbd5e1' }}>Yoga Instructors</button>
              <button onClick={() => setFilter('pilates')} className={`btn ${filter === 'pilates' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '50px', background: filter === 'pilates' ? '#4f46e5' : 'white', borderColor: filter === 'pilates' ? '#4f46e5' : '#cbd5e1' }}>Pilates Teachers</button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading master instructors...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {filteredEducators.map((educator, index) => (
                <motion.div 
                  key={educator._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid #f1f5f9' }}
                >
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '1.5rem', background: '#e0e7ff', border: '4px solid #ede9fe' }}>
                    {educator.profileImage ? (
                      <img src={educator.profileImage.startsWith('http') ? educator.profileImage : `http://localhost:5000${educator.profileImage}`} alt={educator.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#6366f1', fontWeight: 600 }}>
                        {educator.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>{educator.fullName}</h3>
                  <span style={{ display: 'inline-block', background: '#ede9fe', color: '#5b21b6', padding: '0.35rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    {educator.specialization || 'Niche Educator'}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '2rem', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', width: '100%', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                        {educator.coachStats?.rating || '5.0'} <FiStar fill="#fbbf24" color="#fbbf24" />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Rating</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: BENEFITS */}
      <section style={{ padding: '100px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', lineHeight: 1.2 }}>Why Choose Niche Education?</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.7 }}>
              General fitness plans are great, but true mastery comes from specialization. Our educators have spent decades perfecting their craft so they can pass that exact knowledge to you.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['Hyper-focused curriculum designed for exact results.', 'Prevent injuries with expert form correction.', 'Develop a deeper mind-muscle connection.'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#0f172a', fontWeight: 500 }}>
                  <FiCheckCircle color="#4f46e5" size={20} /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ background: '#e0e7ff', borderRadius: '32px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {/* Placeholder for Image */}
             <div style={{ color: '#4f46e5', fontWeight: 600, fontSize: '1.2rem' }}>Mindful Living</div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: NEWSLETTER / CTA */}
      <section style={{ background: '#0f172a', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Join the Inner Circle</h2>
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '2.5rem' }}>Get exclusive mindfulness tips, early access to retreats, and premium video classes delivered to your inbox.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <input type="email" placeholder="Enter your email" style={{ padding: '1rem 1.5rem', borderRadius: '50px', border: 'none', width: '60%', outline: 'none', fontSize: '1rem' }} />
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '50px', background: '#4f46e5', border: 'none' }}>Subscribe</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Educators;
