import React from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard } from 'react-icons/fi';

const PaymentSummary = ({ user }) => {
  const isPremium = user?.subscription?.status === 'Active';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.6 }}
      className="glass-card"
    >
      <div className="section-header">
        <h2>Payment Summary</h2>
      </div>

      <div style={{ background: isPremium ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', padding: '1.5rem', borderRadius: '12px', color: isPremium ? 'white' : '#0f172a', position: 'relative', overflow: 'hidden' }}>
        <FiCreditCard size={100} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: isPremium ? 0.2 : 0.05 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', opacity: isPremium ? 0.9 : 0.6, marginBottom: '0.25rem' }}>Current Plan</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{isPremium ? 'Premium Membership' : 'Free Plan'}</div>
          
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', opacity: isPremium ? 0.9 : 0.6 }}>Expiry Date</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Dec 31, 2026</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', opacity: isPremium ? 0.9 : 0.6 }}>Remaining</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>176 Days</div>
            </div>
          </div>
        </div>
      </div>

      <button className={isPremium ? "btn-modern-outline" : "btn-modern-primary"} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
        {isPremium ? 'Manage Subscription' : 'Upgrade to Premium'}
      </button>
    </motion.div>
  );
};

export default PaymentSummary;
