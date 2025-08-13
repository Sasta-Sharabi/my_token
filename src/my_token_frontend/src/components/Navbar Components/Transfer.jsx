import React, { useState } from 'react';
import { useAuth } from '../../AuthProvider';
import envelopeIcon from '../../assets/transfer.png'; 

const Transfer = () => {
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { callFunction } = useAuth();

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const result = await callFunction.transfer_to(receiver, amount.toString());
      if (amount === '0') {
        setStatus('⚠️ Amount cannot be zero');
        return;
      }
      if (result === 'Failed') {
        setStatus('❌ You cannot transfer to yourself');
        return;
      }
      setStatus(`✅ Transfer successful: ${amount} tokens sent`);
    } catch (err) {
      console.error("Transfer failed:", err);
      setStatus('❌ Transfer failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Envelope icon */}
        <img src={envelopeIcon} alt="Transfer Icon" style={styles.icon} />

        <h2 style={styles.title}> Transfer Tokens</h2>
        <form onSubmit={handleTransfer} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Receiver Principal:</label>
            <textarea
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              required
              style={styles.principalBox}
              placeholder="Enter receiver principal"
              rows={2}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Amount:</label>
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
              style={styles.amountBox}
              placeholder="Enter amount (u128)"
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '⚡ Transferring...' : '🚀 Transfer'}
          </button>
        </form>
        {status && <p style={styles.status}>{status}</p>}
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
    width: '100px',
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

export default Transfer;
