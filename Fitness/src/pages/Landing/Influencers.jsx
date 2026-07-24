import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LandingNavbar from '../../components/layout/LandingNavbar';
import { FiUsers, FiPlayCircle, FiTrendingUp, FiCheck } from 'react-icons/fi';

const Influencers = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/public/coaches`);
        setInfluencers(res.data);
      } catch (error) {
        console.error('Error fetching influencers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfluencers();
  }, []);

  const filteredInfluencers = influencers.filter(c => 
    !filter || (c.specialization && c.specialization.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', overflowX: 'hidden', color: 'white' }}>
      <LandingNavbar />
      
      {/* SECTION 1: HERO (Dark Mode/Energy Theme) */}
      <section style={{ paddingTop: '160px', paddingBottom: '100px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(15, 23, 42, 0) 70%)', zIndex: 1 }}></div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-2px', textTransform: 'uppercase' }}>
            Train Like an <span style={{ color: '#ec4899' }}>Icon</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Get exclusive access to the exact workout routines and diet plans used by the world's top fitness content creators.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '4px', background: '#ec4899', border: 'none', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>
              Unlock Programs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: TOP INFLUENCERS DIRECTORY */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '-1px' }}>The Roster</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => setFilter('')} style={{ padding: '0.75rem 2rem', background: filter === '' ? '#ec4899' : 'transparent', border: '1px solid #ec4899', color: filter === '' ? 'white' : '#ec4899', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>All Creators</button>
              <button onClick={() => setFilter('ambassador')} style={{ padding: '0.75rem 2rem', background: filter === 'ambassador' ? '#ec4899' : 'transparent', border: '1px solid #ec4899', color: filter === 'ambassador' ? 'white' : '#ec4899', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Ambassadors</button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading creators...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {filteredInfluencers.map((influencer, index) => (
                <motion.div 
                  key={influencer._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ background: '#1e293b', borderRadius: '16px', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', marginBottom: '1.5rem', border: '4px solid #ec4899', padding: '4px' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#0f172a' }}>
                      {influencer.profileImage ? (
                        <img src={influencer.profileImage.startsWith('http') ? influencer.profileImage : `http://localhost:5000${influencer.profileImage}`} alt={influencer.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#ec4899', fontWeight: 800 }}>
                          {influencer.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>{influencer.fullName}</h3>
                  <span style={{ display: 'inline-block', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', padding: '0.35rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                    {influencer.specialization || 'Influencer'}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '2rem', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>{influencer.coachStats?.reviews || '500+'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Subscribers</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: EXCLUSIVE PROGRAMS */}
      <section style={{ padding: '100px 20px', background: '#1e293b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase' }}>Behind The Scenes Access</h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto 0' }}>Stop guessing. Follow the exact blueprints that built their physiques.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {['Shred & Burn 90-Day Challenge', 'Glute Building Masterclass', 'The Aesthetic Blueprint'].map((prog, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: '#0f172a', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <FiPlayCircle size={40} color="#ec4899" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>{prog}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94a3b8', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiCheck color="#10b981" /> Full video breakdowns</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiCheck color="#10b981" /> Exact macro tracking</li>
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: COMMUNITY STATS */}
      <section style={{ padding: '80px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { icon: <FiUsers size={32} />, stat: '2.5M+', label: 'Community Members' },
            { icon: <FiTrendingUp size={32} />, stat: '500K+', label: 'Transformations' },
            { icon: <FiPlayCircle size={32} />, stat: '10,000+', label: 'Hours of Content' }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ textAlign: 'center' }}>
              <div style={{ color: '#ec4899', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>{item.stat}</div>
              <div style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontWeight: 600 }}>{item.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Join The Movement</h2>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '3rem' }}>Get instant access to every influencer program on the platform.</p>
          <Link to="/register" className="btn" style={{ background: 'white', color: '#0f172a', padding: '1.25rem 4rem', fontSize: '1.1rem', borderRadius: '4px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Start Free Trial
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Influencers;
