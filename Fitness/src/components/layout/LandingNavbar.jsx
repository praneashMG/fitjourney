import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import './LandingNavbar.css';

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="landing-navbar-container">
        <div className="landing-navbar-left">
          <Link to="/" className="landing-navbar-brand">
            <img src="/logo.png" alt="FitJourney Logo" className="brand-logo-img" />
            FitJourney
          </Link>
          
          <div className="landing-navbar-links">
            <div className="nav-item">
              <span className="nav-link">Fitness Coaches <ChevronDown /></span>
              <div className="dropdown-menu">
                <Link to="/coaches" className="dropdown-item">Personal Trainers</Link>
                <Link to="/coaches" className="dropdown-item">Gym Owners</Link>
              </div>
            </div>
            <div className="nav-item">
              <span className="nav-link">Niche Educators <ChevronDown /></span>
              <div className="dropdown-menu">
                <Link to="/educators" className="dropdown-item">Yoga Instructors</Link>
                <Link to="/educators" className="dropdown-item">Pilates Teachers</Link>
              </div>
            </div>
            <div className="nav-item">
              <span className="nav-link">Influencers <ChevronDown /></span>
              <div className="dropdown-menu">
                <Link to="/influencers" className="dropdown-item">Brand Ambassadors</Link>
                <Link to="/influencers" className="dropdown-item">Content Creators</Link>
              </div>
            </div>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
          </div>
        </div>

        <div className="landing-navbar-actions">
          <button className="icon-btn hide-mobile" aria-label="Language"><GlobeIcon /></button>
          
          {user ? (
            <div className="nav-item user-nav-item hide-mobile">
              <div className="user-profile-badge" onClick={() => navigate('/settings')}>
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName || user.name} className="profile-img-small" />
                ) : (
                  <div className="profile-placeholder-small">
                    <UserIcon />
                  </div>
                )}
                <span className="user-name-text">{user.fullName || user.name || 'User'}</span>
                <ChevronDown />
              </div>
              <div className="dropdown-menu dropdown-menu-right">
                <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                <Link to="/settings" className="dropdown-item">Settings</Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout-btn">Log out</button>
              </div>
            </div>
          ) : (
            <>
              <a href="#contact" className="nav-link-secondary hide-mobile">Contact sales</a>
              <Link to="/login" className="nav-link-secondary hide-mobile">Log in</Link>
              <Link to="/register" className="btn-nav-get-started hide-mobile">Get started</Link>
            </>
          )}

          <button className="mobile-toggle-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <div className="mobile-nav-group">
              <button className="mobile-nav-header-btn" onClick={() => setOpenMobileDropdown(openMobileDropdown === 'coaches' ? null : 'coaches')}>
                Fitness Coaches <ChevronDown />
              </button>
              {openMobileDropdown === 'coaches' && (
                <div className="mobile-dropdown-content">
                  <Link to="/coaches" className="mobile-nav-sublink" onClick={() => setIsMobileMenuOpen(false)}>Personal Trainers</Link>
                  <Link to="/coaches" className="mobile-nav-sublink" onClick={() => setIsMobileMenuOpen(false)}>Gym Owners</Link>
                </div>
              )}
            </div>
            
            <div className="mobile-nav-group">
              <button className="mobile-nav-header-btn" onClick={() => setOpenMobileDropdown(openMobileDropdown === 'educators' ? null : 'educators')}>
                Niche Educators <ChevronDown />
              </button>
              {openMobileDropdown === 'educators' && (
                <div className="mobile-dropdown-content">
                  <Link to="/educators" className="mobile-nav-sublink" onClick={() => setIsMobileMenuOpen(false)}>Yoga Instructors</Link>
                  <Link to="/educators" className="mobile-nav-sublink" onClick={() => setIsMobileMenuOpen(false)}>Pilates Teachers</Link>
                </div>
              )}
            </div>
            
            <div className="mobile-nav-group">
              <button className="mobile-nav-header-btn" onClick={() => setOpenMobileDropdown(openMobileDropdown === 'influencers' ? null : 'influencers')}>
                Influencers <ChevronDown />
              </button>
              {openMobileDropdown === 'influencers' && (
                <div className="mobile-dropdown-content">
                  <Link to="/influencers" className="mobile-nav-sublink" onClick={() => setIsMobileMenuOpen(false)}>Brand Ambassadors</Link>
                  <Link to="/influencers" className="mobile-nav-sublink" onClick={() => setIsMobileMenuOpen(false)}>Content Creators</Link>
                </div>
              )}
            </div>

            <div className="mobile-divider"></div>
            
            <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <Link to="/pricing" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            
            <div className="mobile-divider"></div>
            
            <div className="mobile-auth-buttons">
              {user ? (
                <>
                  <div className="mobile-user-profile">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.fullName} className="profile-img-small" />
                    ) : (
                      <div className="profile-placeholder-small">
                        <UserIcon />
                      </div>
                    )}
                    <span className="mobile-user-name">{user.fullName || user.name || 'User'}</span>
                  </div>
                  <Link to="/dashboard" className="btn btn-primary mobile-btn" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/settings" className="btn btn-secondary mobile-btn" onClick={() => setIsMobileMenuOpen(false)}>Settings</Link>
                  <button className="btn btn-secondary mobile-btn" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary mobile-btn" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                  <Link to="/register" className="btn btn-primary mobile-btn" onClick={() => setIsMobileMenuOpen(false)}>Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
