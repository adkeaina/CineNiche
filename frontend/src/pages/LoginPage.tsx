import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; // Import your CSS file
import { login } from '../api/CineNicheAPI';
import Loading from '../components/Loading';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState(''); // NEW
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, twoFactorCode); 
      navigate('/movies');
    } catch (err: any) {
      if (err.message?.includes('RequiresTwoFactor')) {
        setTwoFactorRequired(true);
        setError('Enter your 6-digit code.');
      } else {
        setError('Invalid input.');
      }
      console.error('Login error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="brand-logo back-button" onClick={() => navigate('/')}>
          CineNiche
        </div>
        <div className="welcome-container">
          <div className="welcome-text">
            <h1>Welcome Back!</h1>
          </div>
        </div>
        <div className="image-container">
          <img
            src="/images/popcorn.png"
            alt="Welcome"
            className="welcome-image"
          />
        </div>
      </div>

      <div className="right-section">
        <div className="login-form-container">
          <div className="login-header">
            <h2>Log in</h2>
          </div>
          <form onSubmit={handleSubmit}>
            {!twoFactorRequired ? (
              <>
                <div className="form-group">
                  <label className="form-label">EMAIL</label>
                  <div className="input-container">
                    <div className="input-icon"></div>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">PASSWORD</label>
                  <div className="input-container">
                    <div className="input-icon"></div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <i className="fas fa-eye"></i>
                      ) : (
                        <i className="fas fa-eye-slash"></i>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-base mb-4 text-left font-semibold text-gray-700">
                  Two-Factor Authentication Required
                </p>
                <div className="form-group mb-6 text-left">
                  <label className="form-label text-gray-600 text-lg font-medium mb-2">
                    6-DIGIT CODE
                  </label>
                  <input
                    type="text"
                    className="form-input text-center tracking-wider p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-300"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="_ _ _ _ _ _"
                    required
                  />
                </div>
              </>
            )}

            {error && 
              <p style={{ color: "#fe3130" }}>
                {error}
              </p>
            }

            <button type="submit" className="login-button">
              {loading ? <Loading /> :(twoFactorRequired ? 'Verify Code' : 'Log In')}
            </button>
            {!twoFactorRequired && (
              <>
                <div className="divider">
                  <span>or</span>
                </div>
                <button
                  type="button"
                  className="signup-button"
                  onClick={() => navigate('/register')}
                >
                  Sign up
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
