import React, { useState } from 'react';
import { useAuth } from '../../AuthProvider';
import coinIcon from '../../assets/coin-purse.png';

const Balance = () => {
  const [principal, setPrincipal] = useState('');
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { callFunction } = useAuth();

  const handleCheckBalance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setBalance(null);

    try {
      const result = await callFunction.check_balance_of(principal);
      setBalance(result);
      setStatus('✅ Balance fetched successfully.');
    } catch (err) {
      console.error("Error fetching balance:", err);
      setStatus('❌ Failed to fetch balance. Check the Principal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Icon */}
        <img src={coinIcon} alt="Coin Purse Icon" style={styles.icon} />

        <h2 style={styles.title}> Check Balance</h2>
        <form onSubmit={handleCheckBalance} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Principal ID:</label>
            <textarea
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              required
              style={styles.principalBox}
              placeholder="Enter principal ID"
              rows={2}
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '⚡ Checking...' : '💰 Check Balance'}
          </button>
        </form>
        {status && <p style={styles.status}>{status}</p>}
        {balance !== null && (
          <div style={styles.resultBox}>
            <strong>💰 Balance:</strong> {balance}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    background: 'radial-gradient(circle at center, #0f0f0f 0%, #000000 100%)',
    minHeight: '100vh',
    fontFamily: `'Inter', sans-serif`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    background: 'rgba(20, 20, 20, 0.75)',
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
    padding: '30px 40px',
    color: '#f5f5f5',
    textAlign: 'center',
  },
  icon: {
    width: '120px',
    marginBottom: '15px',
    animation: 'float 3s ease-in-out infinite, glow 2s ease-in-out infinite alternate',
  },
  title: {
    fontSize: '26px',
    marginBottom: '25px',
    fontWeight: 700,
    color: '#FFD700',
    borderBottom: '2px solid rgba(255, 215, 0, 0.4)',
    paddingBottom: '10px',
    textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  label: {
    fontSize: '16px',
    color: '#FFD700',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  principalBox: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontFamily: 'monospace',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '8px',
    outline: 'none',
    resize: 'none',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#FFD700',
    boxShadow: '0 0 8px rgba(255, 215, 0, 0.2)',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    background: 'linear-gradient(90deg, #FFD700, #ffcc33)',
    color: '#000',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.4)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  status: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#FFD700',
    textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
  },
  resultBox: {
    marginTop: '15px',
    fontSize: '17px',
    color: '#FFD700',
    background: 'rgba(255, 215, 0, 0.05)',
    padding: '10px 15px',
    borderRadius: '8px',
    wordBreak: 'break-word',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    boxShadow: '0 0 6px rgba(255, 215, 0, 0.2)',
  },
};

const animationStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes glow {
  0% { filter: drop-shadow(0 0 3px gold) drop-shadow(0 0 6px gold); }
  100% { filter: drop-shadow(0 0 8px gold) drop-shadow(0 0 15px gold); }
}
`;
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = animationStyles;
  document.head.appendChild(styleEl);
}

export default Balance;
