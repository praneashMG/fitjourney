import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiShield, FiPlus, FiMinus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import LandingNavbar from '../../components/layout/LandingNavbar';

const Pricing = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const plans = [
    {
      name: "Basic", price: "$19", period: "/mo",
      desc: "Perfect for individuals starting their fitness journey.",
      features: ["Access to standard Workout Library", "Basic progress tracking", "Community support"],
      btnText: "Start Basic", pop: false
    },
    {
      name: "Pro", price: "$49", period: "/mo",
      desc: "For those who want personalized coaching and advanced analytics.",
      features: ["1-on-1 personalized coaching", "Custom diet & workout plans", "Direct messaging with coach", "Advanced progress analytics"],
      btnText: "Start Pro", pop: true
    },
    {
      name: "Coach", price: "$99", period: "/mo",
      desc: "For fitness professionals managing multiple clients.",
      features: ["Manage up to 50 clients", "Create unlimited custom templates", "Client analytics dashboard", "Branded client app experience"],
      btnText: "Join as Coach", pop: false
    }
  ];

  const faqs = [
    { q: 'Can I cancel my subscription at any time?', a: 'Yes, you can cancel your subscription at any time from your account settings. You will retain access until the end of your current billing cycle.' },
    { q: 'How does the 14-day money-back guarantee work?', a: 'If you are not satisfied with your plan within the first 14 days, contact support and we will issue a full refund, no questions asked.' },
    { q: 'Can I upgrade from Pro to Coach later?', a: 'Absolutely. You can upgrade your account to a Coach tier at any time and your billing will be prorated automatically.' }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflowX: 'hidden' }}>
      <LandingNavbar />
      
      {/* SECTION 1: HERO */}
      <section style={{ paddingTop: '160px', paddingBottom: '60px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-1px' }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b' }}>
            Choose the plan that fits your goals. No hidden fees. Cancel anytime.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2: PRICING TIERS */}
      <section style={{ padding: '40px 20px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ 
                background: plan.pop ? '#0f172a' : 'white', 
                color: plan.pop ? 'white' : '#0f172a',
                padding: '3rem 2rem', 
                borderRadius: '24px', 
                boxShadow: plan.pop ? '0 20px 25px -5px rgba(15, 23, 42, 0.4)' : '0 10px 15px -3px rgba(0,0,0,0.05)',
                position: 'relative',
                transform: plan.pop ? 'scale(1.05)' : 'scale(1)',
                zIndex: plan.pop ? 10 : 1,
                border: plan.pop ? 'none' : '1px solid #e2e8f0'
              }}
            >
              {plan.pop && (
                <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: 'white', padding: '0.35rem 1.25rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Most Popular
                </div>
              )}
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1rem' }}>
                <span style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-2px' }}>{plan.price}</span>
                <span style={{ color: plan.pop ? '#cbd5e1' : '#64748b', marginLeft: '0.25rem', fontWeight: 600 }}>{plan.period}</span>
              </div>
              <p style={{ color: plan.pop ? '#94a3b8' : '#64748b', marginBottom: '2rem', minHeight: '48px', lineHeight: 1.6 }}>{plan.desc}</p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ color: plan.pop ? '#3b82f6' : '#10b981', marginTop: '3px' }}><FiCheck size={18} /></div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/register" style={{ 
                display: 'block', 
                textAlign: 'center',
                width: '100%', 
                padding: '1rem', 
                borderRadius: '12px', 
                fontWeight: 700,
                textDecoration: 'none',
                background: plan.pop ? '#3b82f6' : '#f1f5f9',
                color: plan.pop ? 'white' : '#0f172a',
                transition: 'all 0.2s',
                boxShadow: plan.pop ? '0 4px 6px -1px rgba(59, 130, 246, 0.5)' : 'none'
              }}>
                {plan.btnText}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: FEATURE COMPARISON */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: '3rem' }}>Compare Features</h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontSize: '1.1rem' }}>Features</th>
                  <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontSize: '1.1rem', textAlign: 'center' }}>Basic</th>
                  <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0', color: '#3b82f6', fontSize: '1.1rem', textAlign: 'center' }}>Pro</th>
                  <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontSize: '1.1rem', textAlign: 'center' }}>Coach</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Public Workouts', b: true, p: true, c: true },
                  { name: 'Diet Tracking', b: true, p: true, c: true },
                  { name: '1-on-1 Coaching', b: false, p: true, c: true },
                  { name: 'Custom Plans', b: false, p: true, c: true },
                  { name: 'Client Management', b: false, p: false, c: true },
                  { name: 'Analytics Dashboard', b: false, p: false, c: true },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', color: '#475569', fontWeight: 500 }}>{row.name}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>{row.b ? <FiCheck color="#10b981" /> : <FiX color="#cbd5e1" />}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>{row.p ? <FiCheck color="#10b981" /> : <FiX color="#cbd5e1" />}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>{row.c ? <FiCheck color="#10b981" /> : <FiX color="#cbd5e1" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4: GUARANTEE */}
      <section style={{ padding: '80px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', background: 'white', padding: '4rem', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <FiShield size={40} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>14-Day Money Back Guarantee</h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6, maxWidth: '500px' }}>
            We're so confident you'll love FitJourney that we offer a 100% money-back guarantee. If you're not satisfied within 14 days, you get a full refund.
          </p>
        </div>
      </section>

      {/* SECTION 5: FAQ */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: '3rem' }}>Billing FAQ</h2>
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

    </div>
  );
};

export default Pricing;
