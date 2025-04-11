import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
    return (
      <>
           {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Start exploring new films today</h2>
            <p className="cta-text">
              Explore indie gems, cult classics, and hidden treasures - your next
              favorite film is just a click away.
            </p>
            <button className="cta-btn" onClick={() => navigate("/Register")}>
              GET STARTED
            </button>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-column-title">Company</h3>
              <div className="footer-link">About</div>
              <div className="footer-link">Press</div>
            </div>
            <div className="footer-column">
              <h3 className="footer-column-title">Contact</h3>
              <div className="footer-link">FAQ</div>
              <div className="footer-link" onClick={() => navigate("/PrivacyPage")}>Privacy Policy</div>
            </div>
            <div className="footer-column">
              <h3 className="footer-column-title">Social</h3>
              <div className="footer-link">Facebook</div>
              <div className="footer-link">Instagram</div>
              <div className="footer-link">Twitter</div>
            </div>
          </div>
        </section>
        <footer className="home-footer">
          <div className="copyright">© CineNiche. All Rights Reserved 2025</div>
        </footer>
      </>
    );
  };
  
  export default Footer;
  