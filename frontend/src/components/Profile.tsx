import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { useEffect, useState } from "react";
import { ProfileData } from "../types/ProfileData";
import { fetchProfileData, logout } from "../api/CineNicheAPI";

const Profile = ({onClose} : {onClose: () => void}) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchProfileData();
        setProfileData(data);
      } catch (error) {
        setProfileData({firstName: "John", lastName: "Doe", email: "johndoe@gmail.com", roles: []});
      }
    };
    
    loadProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/LoginPage");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="profile-dropdown">
      <div className="profile-header">
        <span>
          {profileData?.firstName || profileData?.lastName
            ? `${profileData?.firstName ?? ""} ${profileData?.lastName ?? ""}`.trim()
            : "User"}
        </span>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="profile-avatar-container">
        <img
          src="/images/profile.webp"
          alt="Profile Avatar"
          className="profile-avatar"
        />
      </div>
      <div className="profile-info">
        <div>
          {profileData?.email}
        </div>
      </div>
      {profileData?.roles?.includes('Admin') && <button className="admin-button" onClick={() => navigate('/manageMovies')}>Manage Movies</button>}
      <button className="admin-button" onClick={() => navigate('/enable2fa')}>Manage 2FA</button>
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Profile;
