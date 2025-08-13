import { AuthProvider, useAuth } from './AuthProvider';
import Login from './Login';
import MainApp from './MainApp';

function AppContent() {
  const { isAuth, authUser } = useAuth();

  if (!authUser) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.card}>
          <h2 style={styles.loadingText}>🔄 Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <main style={styles.main}>
      {isAuth ? <MainApp /> : <Login />}
    </main>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = {
  main: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #1a1a1a, #0d0d0d)',
    fontFamily: `'Inter', sans-serif`,
  },
  loadingContainer: {
    padding: '40px',
    background: 'radial-gradient(circle at top, #1a1a1a, #0d0d0d)',
    minHeight: '100vh',
    fontFamily: `'Inter', sans-serif`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    maxWidth: '500px',
    width: '100%',
    background: 'rgba(255, 215, 0, 0.05)',
    borderRadius: '16px',
    boxShadow: '0 0 25px rgba(255, 215, 0, 0.2)',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    padding: '30px 40px',
    textAlign: 'center',
    backdropFilter: 'blur(12px)',
  },
  loadingText: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#FFD700',
    textShadow: '0 0 6px rgba(255, 215, 0, 0.6)',
  },
};

export default App;
