import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../AuthProvider';
import './AllUsers.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { callFunction } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      const userList = await callFunction.get_all_users();
      console.log('Fetched users:', userList);
      setUsers(userList);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [callFunction]);

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, [fetchUsers, refreshTrigger]);

  const manualRefresh = () => {
    setLoading(true);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>👥 All Registered Users</h2>
          <button
            onClick={manualRefresh}
            style={styles.refreshBtn}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.8)'}
            onMouseLeave={(e) => e.target.style.boxShadow = styles.refreshBtn.boxShadow}
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <p style={styles.status}>Loading users...</p>
        ) : users.length === 0 ? (
          <p style={styles.status}>No users found.</p>
        ) : (
          <div style={styles.cardGrid}>
            {users.map(([principal, balance], idx) => (
              <UserCard key={idx} principal={principal} balance={balance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const UserCard = ({ principal, balance }) => {
  return (
    <div style={styles.userCard} className="userCard">
      <p style={styles.userPrincipal}>{principal}</p>
      <p style={styles.userBalance}>💰 {balance}</p>
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
    alignItems: 'flex-start',
  },
  card: {
    width: '100%',
    maxWidth: '1000px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    backdropFilter: 'blur(18px)',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
    padding: '30px 40px',
    animation: 'fadeIn 0.6s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
    paddingBottom: '12px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#FFD700',
    letterSpacing: '1px',
  },
  refreshBtn: {
    padding: '8px 14px',
    fontSize: '14px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #FFD700, #FFB700)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
    transition: 'all 0.3s ease',
  },
  status: {
    fontSize: '17px',
    color: '#d1d5db',
    marginTop: '20px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  userCard: {
    background: 'rgba(26, 26, 26, 0.95)', 
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  userPrincipal: {
    fontSize: '14px',
    color: '#FFD700',
    marginBottom: '10px',
    wordBreak: 'break-all',
  },
  userBalance: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
  },
};

export default AllUsers;
