import React, { useState } from 'react';
import { useAuth } from '../../AuthProvider';
import bankIcon from '../../assets/mint.png'; 

import './Mint.css'; 

const Mint = () => {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { callFunction } = useAuth();

  const handleMint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const result = await callFunction.mint_tokens(amount.toString());
      if (amount === '0') {
        setStatus('⚠️ 0 tokens not allowed');
        return;
      }
      if (result === 'Failed') {
        setStatus('❌ You are not the owner.');
        return;
      }
      setStatus(`✅ Mint successful: ${amount} tokens minted`);
    } catch (err) {
      console.error("Mint failed:", err);
      setStatus('❌ Mint failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="mint-card">
        <img src={bankIcon} alt="Mint Icon" className="mint-icon" />
        <h2 style={styles.title}> Mint Tokens</h2>
        <form onSubmit={handleMint} style={styles.form}>
          {/* <div style={styles.formGroup}>
            <label style={styles.label}>Principal ID:</label>
            <textarea
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              required
              placeholder="Enter Principal ID"
              style={styles.principalBox}
              className="mint-input"
              rows={2}
            />
          </div> */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Amount to Mint:</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) setAmount(val);
              }}
              required
              placeholder="Enter amount (u128)"
              style={styles.amountBox}
              className="mint-input"
            />
          </div>
          <button type="submit" style={styles.button} className="mint-button" disabled={loading}>
            {loading ? '⚡ Minting...' : '🪙 Mint'}
          </button>
        </form>
        {status && <p style={styles.status} className="status-gold">{status}</p>}
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
  amountBox: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontFamily: 'monospace',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '8px',
    outline: 'none',
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
    whiteSpace: 'pre-wrap',
    textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
  },
};

export default Mint;
