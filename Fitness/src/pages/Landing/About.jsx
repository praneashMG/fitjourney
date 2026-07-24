import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LandingNavbar from '../../components/layout/LandingNavbar';
import { FiTarget, FiShield, FiZap, FiArrowRight } from 'react-icons/fi';

const About = () => {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflowX: 'hidden' }}>
      <LandingNavbar />
      
      {/* SECTION 1: HERO */}
      <section style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Our Mission</span>
            <h1 style={{ fontSize: '4rem', fontWeight: 800, color: '#0f172a', margin: '1rem 0 1.5rem', lineHeight: 1.1, letterSpacing: '-1px' }}>
              Redefining the relationship between <span style={{ color: '#3b82f6' }}>coach and client.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#64748b', lineHeight: 1.7, maxWidth: '800px', margin: '0 auto' }}>
              We believe that fitness should be accessible, personalized, and data-driven. FitJourney bridges the gap between top-tier coaches and individuals who are ready to transform their lives by removing the friction of outdated tools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: OUR STORY (Timeline) */}
      <section style={{ padding: '100px 20px', background: '#f1f5f9' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a' }}>How It Started</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: '#cbd5e1', transform: 'translateX(-50%)' }}></div>
            
            {[
              { year: '2023', title: 'The Problem', text: 'A group of personal trainers realized they spent more time on spreadsheets and WhatsApp than actually coaching.' },
              { year: '2024', title: 'The Solution', text: 'FitJourney was born. A single, unified platform to handle workouts, diets, messaging, and progress tracking.' },
              { year: '2025', title: 'The Expansion', text: 'Opened the platform to niche educators, yoga instructors, and fitness influencers worldwide.' }
            ].map((event, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end', width: '100%', position: 'relative' }}>
                <div style={{ width: '45%', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', [i % 2 === 0 ? 'right' : 'left']: '-2.5rem', width: '20px', height: '20px', background: '#3b82f6', borderRadius: '50%', transform: 'translateY(-50%)', border: '4px solid #f1f5f9' }}></div>
                  <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '1.2rem' }}>{event.year}</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0.5rem 0' }}>{event.title}</h3>
                  <p style={{ color: '#64748b', lineHeight: 1.6 }}>{event.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE VALUES */}
      <section style={{ padding: '100px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4rem' }}>Our Core Values</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {[
              { icon: <FiTarget size={32} />, title: 'Results Driven', desc: 'Everything we build is designed to help users achieve measurable fitness results.' },
              { icon: <FiShield size={32} />, title: 'Radical Transparency', desc: 'No hidden fees, no fake reviews. Just honest coaching and clear pricing.' },
              { icon: <FiZap size={32} />, title: 'Continuous Innovation', desc: 'We constantly update our tools to give coaches the edge in a competitive market.' }
            ].map((value, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: '#f8fafc', padding: '3rem 2rem', borderRadius: '24px' }}>
                <div style={{ width: '64px', height: '64px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>{value.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{value.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: THE PLATFORM */}
      <section style={{ padding: '100px 20px', background: '#0f172a', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Built for scale.</h2>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem' }}>
              Whether you are a solo personal trainer with 5 clients, or a gym owner managing a roster of 500, our architecture scales with you. Dashboard analytics, mass program assignment, and integrated billing all in one place.
            </p>
            <Link to="/pricing" style={{ color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              View Coach Pricing <FiArrowRight />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ flex: '1 1 400px', background: '#1e293b', borderRadius: '24px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Dashboard Preview</span>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: CAREERS / CTA */}
      <section style={{ padding: '100px 20px', background: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Join the Team</h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '3rem' }}>We are always looking for passionate engineers, designers, and fitness enthusiasts to join our remote team.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '1rem 2.5rem', borderRadius: '50px' }}>View Openings</Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', borderRadius: '50px' }}>Sign Up as User</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
