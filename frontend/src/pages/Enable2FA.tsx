import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  check2FAStatus,
  disable2FA,
  fetchSetup,
  verify2FACode,
} from '../api/CineNicheAPI';
import '../styles/Enable2FA.css';

const Enable2FA: React.FC = () => {
  const [qrCodeUri, setQrCodeUri] = useState('');
  const [sharedKey, setSharedKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const is2FAActive =
    message.includes('already enabled') || message.includes('enabled successfully');

  // Step 1: Check 2FA status
  useEffect(() => {
    const check2faStatus = async () => {
      try {
        const isTwoFactorEnabled = await check2FAStatus();
        if (isTwoFactorEnabled) {
          setMessage('✅ Two-Factor Authentication is already enabled.');
          return;
        }
        await loadSetup(); // Only run if NOT enabled
      } catch (err) {
        setMessage('Failed to check 2FA status.');
      }
    };
    check2faStatus();
  }, []);
  

  // Step 2: Fetch QR code and shared key
  const loadSetup = async () => {
    try {
      const data = await fetchSetup();
      setQrCodeUri(
        `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          data.qrCodeUri
        )}&size=200x200`
      );
      setSharedKey(data.sharedKey);
      setMessage('Scan the QR code and enter the code from your app.');
    } catch (err: any) {
      const msg =
        typeof err === 'string' ? err : err.message || err.toString();
      if (msg.includes('2FA is already enabled')) {
        setMessage('✅ Two-Factor Authentication is already enabled.');
      } else {
        setMessage('❌ Failed to load 2FA setup: ' + msg);
      }
      console.error(err);
    }
  };

  // Step 3: Handle verification code change
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    if (error) setError('');
  };

  // Step 4: Verify 2FA code
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }
    setIsVerifying(true);

    try {
      setMessage('Verifying...');
      await verify2FACode(verificationCode);
      setMessage('✅ Two-Factor Authentication enabled successfully!');
      setQrCodeUri('');
      setSharedKey('');
      setVerificationCode('');
    } catch (err) {
      setMessage(`❌ ${err}`);
    } finally {
      setIsVerifying(false);
    }
  };

  // Step 5: Cancel and go back to movies
  const handleCancel = () => {
    navigate('/movies');
  };

  // Step 6: Disable 2FA
  const handleDisable2FA = async () => {
    try {
      setMessage('Disabling Two-Factor Authentication...');
      await disable2FA();
      alert('Two-Factor Authentication has been disabled.');
      setQrCodeUri('');
      setSharedKey('');
      setVerificationCode('');
      setMessage('2FA disabled.');
    } catch (err) {
      alert('Something went wrong while disabling 2FA.');
    }
  };

  return (
    <div className="tfa-container">
      <div className="logo-auth" onClick={() => navigate('/movies')}>
        CineNiche
      </div>
      <div className="tfa-background"></div>
      <div className="tfa-content">
        <div className="tfa-card">
          <h1 className="tfa-title">Two-Factor Authentication</h1>

          {qrCodeUri && !is2FAActive && (
            <>
              <div className="tfa-qr-container">
                <img
                  src={qrCodeUri}
                  alt="Scan this QR code"
                  className="tfa-qr-code"
                />
              </div>
              <p className="tfa-instructions">
                Or enter this key manually:{' '}
                <code className="shared-key">{sharedKey}</code>
              </p>
              <form onSubmit={handleVerify} className="tfa-form">
                <div className="tfa-input-group">
                  <label htmlFor="verification-code" className="tfa-label">
                    Verification Code
                  </label>
                  <input
                    id="verification-code"
                    type="text"
                    className="tfa-input"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    maxLength={6}
                  />
                  {error && <div className="tfa-error">{error}</div>}
                </div>
                <div className="tfa-button-group">
                  <button
                    type="button"
                    className="tfa-cancel-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="tfa-verify-button"
                    disabled={isVerifying}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify and Enable'}
                  </button>
                </div>
              </form>
            </>
          )}

          {is2FAActive && (
            <button onClick={handleDisable2FA} className="tfa-verify-button">
              Disable Two-Factor Authentication
            </button>
          )}

          {message && (
            <>
              <p className="mt-4 text-sm">{message}</p>
              <button
                type="button"
                className="tfa-cancel-button"
                onClick={handleCancel}
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Enable2FA;
