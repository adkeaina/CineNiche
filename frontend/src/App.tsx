import './App.css'
import Privacy from './pages/PrivacyPage';
import CookieConsent from 'react-cookie-consent';
import Home from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MoviePage from './pages/MoviePage';
import LoginPage from './pages/LoginPage';
import ManageMovies from './pages/ManageMovies';
import CreateAccountPage from './pages/CreateAccountPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AuthorizedView from './components/AuthorizedView';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import Enable2FA from './pages/Enable2FA';


function App() {
  return (
    <div className='App'>
      <Router>
              <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Movies" element={
            <AuthorizedView>
              <MoviePage />
            </AuthorizedView>
          } />
          <Route path="/PrivacyPage" element={<Privacy />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/ManageMovies" element={
            <AuthorizedView requiredRoles={["Admin"]}>
              <ManageMovies />
            </AuthorizedView>
          } />
          <Route path="/Register" element={<CreateAccountPage />} />
          <Route path="/movie/:showId" element={
            <AuthorizedView>
              <ProductDetailPage />
            </AuthorizedView>
          } />
          <Route path="/search" element={
            <AuthorizedView>
              <SearchPage />
            </AuthorizedView>
          } />
          <Route path="/*" element={<Navigate to="/Movies" replace />} />
          <Route path="/Enable2FA" element={<Enable2FA />} />
        </Routes>



          {/* Cookie Consent Banner*/}
          <CookieConsent
            location="bottom"
            buttonText="Accept"
            cookieName="cineNicheConsent"
            style={{ background: "#2B373B" }}
            buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          >
            We use cookies to improve your experience and personalize recommendations.{" "}
            <a href="/privacypage" className="underline">Learn more</a>.
          </CookieConsent>
      </Router>
    </div>
  );
}



export default App;
