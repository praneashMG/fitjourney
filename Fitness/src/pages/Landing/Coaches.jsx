import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LandingNavbar from '../../components/layout/LandingNavbar';
import { FiCheckCircle, FiStar, FiUser, FiArrowRight } from 'react-icons/fi';

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`}/public/coaches`);
        setCoaches(res.data);
      } catch (error) {
        console.error('Error fetching coaches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  const filteredCoaches = coaches.filter(c => 
    !filter || (c.specialization && c.specialization.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflowX: 'hidden' }}>
      <LandingNavbar />
      
      {/* SECTION 1: HERO */}
      <section style={{ paddingTop: '120px', paddingBottom: '80px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Find Your Perfect <span style={{ color: '#3b82f6' }}>Fitness Coach</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Browse our directory of elite personal trainers and gym owners. Get customized workout plans, diet tracking, and 1-on-1 support to crush your fitness goals.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px', background: '#3b82f6', border: 'none' }}>
              Get Matched Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: COACH DIRECTORY */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Our Elite Roster</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => setFilter('')} className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '50px' }}>All</button>
            <button onClick={() => setFilter('trainer')} className={`btn ${filter === 'trainer' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '50px' }}>Personal Trainers</button>
            <button onClick={() => setFilter('owner')} className={`btn ${filter === 'owner' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '50px' }}>Gym Owners</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading elite coaches...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {filteredCoaches.map((coach, index) => (
              <motion.div 
                key={coach._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid #f1f5f9' }}
              >
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '1.5rem', background: '#f8fafc', border: '4px solid #f1f5f9' }}>
                  {coach.profileImage ? (
                    <img src={coach.profileImage.startsWith('http') ? coach.profileImage : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${coach.profileImage}`} alt={coach.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#94a3b8', fontWeight: 600 }}>
                      {coach.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>{coach.fullName}</h3>
                <span style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '0.35rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                  {coach.specialization || 'Fitness Coach'}
                </span>
                
                <div style={{ display: 'flex', gap: '2rem', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', width: '100%', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                      {coach.coachStats?.rating || '4.9'} <FiStar fill="#fbbf24" color="#fbbf24" />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Rating</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>{coach.experienceLevel || 'Expert'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Level</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section style={{ background: 'white', padding: '100px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>How FitJourney Works</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Your path to peak fitness is just three simple steps away.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {[
              { title: "1. Take the Assessment", desc: "Fill out a quick questionnaire about your goals, body type, and current fitness level." },
              { title: "2. Get Matched", desc: "Our algorithm pairs you with the perfect coach based on your unique profile." },
              { title: "3. Start Training", desc: "Access custom workouts, diet plans, and chat directly with your coach via the dashboard." }
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} style={{ background: '#f8fafc', padding: '3rem 2rem', borderRadius: '24px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: '#3b82f6', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 1.5rem' }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{step.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: TESTIMONIALS */}
      <section style={{ padding: '100px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4rem' }}>Success Stories</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: "Sarah J.", role: "Lost 20 lbs", text: "Finding my coach on FitJourney changed everything. The customized plans were exactly what I needed." },
              { name: "Mike T.", role: "Muscle Gain", text: "The app interface is incredible. My coach tracks my reps and diet in real-time. Highly recommend!" }
            ].map((test, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
                  {[1,2,3,4,5].map(star => <FiStar key={star} fill="#fbbf24" color="#fbbf24" />)}
                </div>
                <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem', fontStyle: 'italic' }}>"{test.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiUser color="#94a3b8" /></div>
                  <div>
                    <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 600 }}>{test.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{test.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section style={{ background: '#3b82f6', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Ready to Transform Your Life?</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '3rem' }}>Join thousands of others who have reached their fitness goals with FitJourney.</p>
          <Link to="/register" className="btn" style={{ background: 'white', color: '#3b82f6', padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '50px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Get Started Now <FiArrowRight />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Coaches;
