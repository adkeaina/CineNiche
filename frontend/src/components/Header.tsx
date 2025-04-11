import { useNavigate } from "react-router-dom";

export default function Header({ onHomePage }: { onHomePage: boolean }) {
    const navigate = useNavigate();
    return (
        <header className="home-header">
          <div className="brand-logo">CineNiche</div>
          <nav className="nav-links">
            <div
                className={`nav-item ${onHomePage && 'active'}`}
                onClick={() => {!onHomePage && navigate("/")}}
            >HOME</div>
            <div className="nav-item" onClick={() => navigate("/loginpage")}>
              LOGIN
            </div>
          </nav>
        </header>
    )
}