
import React, { useEffect, useState } from "react";
import "../styles/MoviePage.css";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile"; // Corrected import statement
import MovieList from "../components/MovieList";
import { fetchGenreRecs, fetchUserId, fetchUserRecs } from "../api/CineNicheAPI";
import { Movie } from "../types/Movie";

const MoviePage: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [genreRecs, setGenreRecs] = useState<Record<string, Movie[]>>({});
  const [userShowIds, setUserShowIds] = useState<number[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const daId = await fetchUserId();
        setUserId(daId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    loadUserId();
  }, []);

  useEffect(() => {
    const loadGenreRecs = async () => {
      try {
        if (userId !== null) {
          const data = await fetchGenreRecs(userId);
          setGenreRecs(data);
        }
      } catch (error) {
        console.error("Error fetching genre recommendations:", error);
      }
    };

    const loadUserRecs = async () => {
      try {
        if (userId !== null) {
          const data = await fetchUserRecs(userId);
          setUserShowIds(data);
        }
      } catch (error) {
        console.error("Error fetching user recommendations:", error);
      }
    }
    loadUserRecs();
    loadGenreRecs();
  }, [userId]);

  return (
    <div className="home-view-container">
      <div>
        {showProfile && (
          <Profile onClose={() => setShowProfile(false)}
          />
        )}
      </div>

      {/* Header */}
      <header className="home-view-header">
        <div className="brand-logo">CineNiche</div>
        <div className="header-icons">
          <div className="header-icon search-icon" onClick={() => navigate('/search')}></div>
          <div
            className="header-icon user-icon"
            onClick={() => setShowProfile((prev) => !prev)}
          ></div>
        </div>
      </header>
      <div className="home-view-content">
        {/* Featured Show Section */}
        <section className="featured-show">
          <div className="featured-content">
            <h2 className="featured-title">SHOWING OF THE WEEK: JAWS</h2>
            <button className="view-movie-btn" onClick={() => navigate(`/movie/42`)}>View Details</button>
          </div>
        </section>

        {userShowIds && <Carousel title="RECOMMENDED FOR YOU" showIds={userShowIds} />}

        <section className="recommendation-section">
          <h2 className="section-title biggah">YOUR TOP GENRES:</h2>
        </section>

        {Object.entries(genreRecs).map(([genre, movies]) => (
          <Carousel key={genre} title={`${genre.replace(/_/g, ' ').toUpperCase()}`} movies={movies} />
        ))}
        <Carousel title="WATCH AGAIN" url="/" />
      </div>
    </div>
  );
};

export default MoviePage;

export function Carousel ({title, url, movies, showIds} : {title : string, url? : string, movies? : Movie[], showIds? : number[]}) {
  return (
    <section className="recommendation-section">
      <h2 className="section-title">{title}</h2>
      <div className="movie-row">
          <MovieList url={url} shownMovies={movies} isAuthorized showIds={showIds} />
      </div>
    </section>
  );
};