import { useState } from "react";
import { register } from "../api/CineNicheAPI";
import SignUpConfirmation from "./SignUpConfirmation";
import { useNavigate } from "react-router-dom";

export default function CreateAccountPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await register({ firstName, lastName, email, password });
    
      if (!res.ok) {
        const data = await res.json();
        if (Array.isArray(data.errors)) {
          setError(data.errors.join(" "));
        } else {
          setError(data.message || "Registration failed.");
        }
        return;
      }
    
      setError("");
      setIsSignUpComplete(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  }
    

  if (isSignUpComplete) {
    return <SignUpConfirmation setIsSignUpComplete={setIsSignUpComplete}/>;
  }

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="brand-logo back-button" onClick={() => navigate('/')}>CineNiche</div>
        <div className="welcome-container">
          <div className="welcome-text">
            <h1>Welcome!</h1>
          </div>
        </div>
        <img
          src="/images/camera.png"
          alt="Welcome"
          className="welcome-image"
        />
      </div>
      <div className="right-section">
        <div className="login-form-container">
          <div className="login-header"><h2>Sign up</h2></div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">FIRST NAME</label>
              <div className="input-container">
                <div className="input-icon"></div>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">LAST NAME</label>
              <div className="input-container">
                <div className="input-icon"></div>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">EMAIL</label>
              <div className="input-container">
                <div className="input-icon"></div>
                <input
                  type="email"
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
                  type="password"
                  className="form-input"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">CONFIRM PASSWORD</label>
              <div className="input-container">
                <div className="input-icon"></div>
                <input
                  type="password"
                  className="form-input"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <p className="text-red-600 mb-2 text-sm text-center">{error}</p>
            )}
            <button type="submit" className="login-button">
              Create Account
            </button>
            <div className="divider">
              <div className="divider-line"></div>
              <div className="divider-text">or</div>
              <div className="divider-line"></div>
            </div>
            <button
              type="button"
              className="signup-button"
              onClick={() => navigate("/loginPage")}
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}