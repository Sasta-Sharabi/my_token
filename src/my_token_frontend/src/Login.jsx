import React from 'react';
import { useAuth } from './AuthProvider';
import coreXLogo from './assets/logo.png';
import './Login.css'; 

const Login = () => {
  const { login } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <img src={coreXLogo} alt="CoreX Logo" style={styles.logo} />
        </div>
        <h2 style={styles.title}>
          Welcome to <span style={styles.coinName}>Core</span>
          <span style={styles.coinNameX}>X</span>
        </h2>
        <p style={styles.subtitle}>
          Your secure gateway to decentralized assets.
        </p>
        <button
          onClick={login}
          style={styles.button}
          onMouseEnter={(e) => e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)'}
          onMouseLeave={(e) => e.target.style.boxShadow = styles.button.boxShadow}
        >
          Log in with Internet Identity
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    background: 'radial-gradient(circle at center, #000000 0%, #1a1a1a 100%)',
    minHeight: '100vh',
    fontFamily: `'Inter', sans-serif`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
    padding: '40px 30px',
    textAlign: 'center',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    animation: 'fadeIn 0.6s ease-out',
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  logo: {
    height: '70px',
    width: '70px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.7))',
    animation: 'spinLogo 8s linear infinite', 
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '10px',
    color: '#ffffff',
  },
  coinName: {
    color: '#FFD700',
    fontWeight: 800,
    letterSpacing: '1px',
  },
  coinNameX: {
    color: '#FFD700',
    fontWeight: 800,
    letterSpacing: '1px',
    textShadow: '0 0 8px rgba(255, 215, 0, 0.7)',
  },
  subtitle: {
    fontSize: '16px',
    color: '#d1d5db',
    marginBottom: '30px',
  },
  button: {
    padding: '14px 30px',
    fontSize: '16px',
    background: 'linear-gradient(90deg, #FFD700, #FFB700)',
    color: '#000',
    fontWeight: 700,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
    transition: 'all 0.3s ease',
  },
};

export default Login;
