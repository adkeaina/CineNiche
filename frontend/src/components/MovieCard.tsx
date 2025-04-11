import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/Movie';
import '../styles/MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  isAuthorized?: boolean;
  setClicked?: () => void;
}

export default function MovieCard({ movie, isAuthorized, setClicked }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = `https://movieposters45.blob.core.windows.net/movie-posters/${movie.title}.jpg`;
  const navigate = useNavigate();
  movie.starRating = movie.starRating || 0;

  const handleClick = () => {
    if (isAuthorized) {
      navigate(`/movie/${movie.showId}`);
    } else {
      setClicked && setClicked();
    }
  };

  return (
    <div
      className="movie-card"
      onClick={handleClick}
    >
      {!imgError ? (
        <img
          src={imageUrl}
          alt={movie.title}
          onError={() => setImgError(true)}
          className="movie-image"
        />
      ) : (
        <div className="fallback-title">{movie.title}</div>
      )}
      <div className="movie-overlay">
        <h3 className="movie-title-card">{movie.title}</h3>
        <p className="movie-meta">
          {movie.releaseYear} • {movie.rating || 'NR'}
        </p>
        <div className="movie-stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <i
              key={i}
              className={`bi ${
                movie.starRating !== null && i <= Math.round(movie.starRating || 0)
                  ? 'bi-star-fill filled'
                  : 'bi-star'
              }`}
            ></i>
          ))}
        </div>
      </div>
    </div>
  );
}
