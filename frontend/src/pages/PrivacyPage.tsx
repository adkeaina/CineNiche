import React from 'react';
import '../styles/PrivacyPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

// PrivacyPolicy Component
const PrivacyPolicy: React.FC = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #028fa6, #e0e111)',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#fff',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'rgba(0,0,0,0.1)',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        <h1>Privacy & Cookie Policy</h1>
        <p>
          CineNiche is committed to protecting your personal data and respecting
          your privacy. This policy outlines how we collect, use, and protect
          your data in accordance with the General Data Protection Regulation
          (GDPR).
        </p>

        <section>
          <h2>What data do we collect?</h2>
          <ul>
            <li>
              Personal information: name, email, phone, age, gender, location
            </li>
            <li>
              Movie ratings, viewing history, streaming service subscriptions
            </li>
            <li>Browser data and cookies</li>
          </ul>
        </section>

        <section>
          <h2>How do we use your data?</h2>
          <ul>
            <li>
              To personalize movie recommendations and improve your experience
            </li>
            <li>
              To provide access to your account and user-specific features
            </li>
            <li>To ensure site security and prevent misuse</li>
          </ul>
        </section>

        <section>
          <h2>Data retention and security</h2>
          <p>
            Your data is stored securely in Microsoft Azure with encryption and
            role-based access controls. We retain your data for as long as your
            account remains active or as required by law.
          </p>
        </section>

        <section>
          <h2>Your GDPR Rights</h2>
          <ul>
            <li>
              <strong>Access</strong> – Request a copy of your personal data
            </li>
            <li>
              <strong>Rectification</strong> – Request corrections to inaccurate
              data
            </li>
            <li>
              <strong>Erasure</strong> – Request deletion of your data
            </li>
            <li>
              <strong>Restrict Processing</strong> – Ask us to limit how we use
              your data
            </li>
            <li>
              <strong>Object</strong> – Object to our processing of your data
            </li>
            <li>
              <strong>Portability</strong> – Request transfer of your data to
              another provider
            </li>
          </ul>
          <p>
            <strong>
              Email all requests to privacy@cineniche.com. We will respond
              within 30 days.
            </strong>
          </p>
        </section>

        <section>
          <h2>Cookie Usage</h2>
          <p>
            Cookies are small text files used to store information on your
            browser. We use cookies to:
          </p>
          <ul>
            <li>Keep you signed in</li>
            <li>Remember your preferences</li>
            <li>Improve recommendations based on usage patterns</li>
            <li>Analyze how our site is used to improve design and content</li>
          </ul>
          <p>
            We use both first-party and third-party cookies (e.g., for
            analytics). You can disable cookies in your browser settings, though
            some features may not work as intended.
          </p>
        </section>

        <section>
          <h2>More Info</h2>
          <p>
            <strong>Consent</strong>
            <br />
            Upon visiting our site, you will be prompted to accept our use of
            cookies. Your consent is stored in your browser as a cookie named
            cineNicheConsent.
          </p>

          <p>
            <strong>Third Parties</strong>
            <br />
            We do not sell your data. We may share anonymized usage stats with
            trusted providers under strict protection. Your identifiable
            information is never shared without express consent.
          </p>

          <p>
            <strong>Policy Updates</strong>
            <br />
            This policy may be updated to reflect changes in legal or
            operational practices. Last updated: April 7, 2025.
          </p>

          <p>
            <strong>Contact</strong>
            <br />
            For any questions or data requests, contact us at
            privacy@cineniche.com.
          </p>
        </section>

        <section>
          <h2>Supervisory Authority</h2>
          <p>
            If you’re not satisfied with our response, you can lodge a complaint
            with your local data protection authority.
          </p>
        </section>
      </div>
    </div>
  );
};

// PrivacyPage Component
const PrivacyPage: React.FC = () => {
  return (
    <div style={{ color: '#fff' }}>
      <Header onHomePage={false} />
      <PrivacyPolicy />
      <Footer />
    </div>
  );
};

export default PrivacyPage;
