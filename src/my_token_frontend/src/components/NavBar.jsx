import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css'; 

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        {links.map((link) => (
          <li key={link.path} style={styles.navItem}>
            <NavLink to={link.path} end={link.end} style={getLinkStyle}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const links = [
  { path: '/', label: 'All Users', end: true },
  { path: '/transfer', label: 'Transfer' },
  { path: '/mint', label: 'Mint' },
  { path: '/faucet', label: 'Faucets' },
  { path: '/balance', label: 'Balance' },
  { path: '/profile', label: 'Profile' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/metadata', label: 'Token Details' },
  { path: '/docs', label: 'Documentation' },

];

const getLinkStyle = ({ isActive }) => ({
  color: isActive ? '#FFD700' : '#e5e5e5',
  background: isActive
    ? 'rgba(255, 215, 0, 0.12)'
    : 'transparent',
  borderRadius: '12px',
  padding: '10px 18px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  boxShadow: isActive
    ? '0 0 10px rgba(255, 215, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.5)'
    : 'none',
  backdropFilter: isActive ? 'blur(10px)' : 'none',
  transform: isActive ? 'scale(1.05)' : 'scale(1)',
});

const styles = {
  navbar: {
    width: '100%',
    padding: '14px 0',
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    justifyContent: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '30px',
    margin: 0,
    padding: 0,
  },
  navItem: {
    position: 'relative',
  },
};

export default Navbar;
