import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchContentRecs, fetchMovieById } from '../api/CineNicheAPI';
import { Movie } from '../types/Movie';
import '../styles/ProductDetailPage.css';
import Loading from '../components/Loading';
import MovieList from '../components/MovieList';

export default function ProductDetailPage() {
  const { showId } = useParams();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingType, setRatingType] = useState<'average' | 'my'>('average');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recShowIds, setRecShowIds] = useState<number[] | null>(null);


  const Carousel = ({
    title,
    url,
    showIds,
    className,
  }: {
    title: string;
    url?: string;
    showIds?: number[];
    className?: string;
  }) => {
    return (
      <section
        className={`recommendation-section gradient-carousel ${className || ''}`}
      >
        <h2 className="section-title">{title}</h2>
        <div className="movie-row">
          <MovieList url={url} showIds={showIds} isAuthorized />
        </div>
      </section>
    );
  };


  useEffect(() => {
    const fetchData = async () => {
      const [movieResult, recsResult] = await Promise.allSettled([
        fetchMovieById(showId),
        fetchContentRecs(Number(showId))
      ]);
      console.log('recsResult', recsResult);
      if (movieResult.status === 'fulfilled') {
        setMovie(movieResult.value);
      } else {
        console.error('Failed to fetch movie:', movieResult.reason);
      }
  
      if (recsResult.status === 'fulfilled') {
        setRecShowIds(recsResult.value);
      } else {
        console.error('Failed to fetch recommendations:', recsResult.reason);
      }
    };
  
    fetchData();
  }, [showId]);

  if (!movie) return <Loading />;

  const renderStars = () => {
    const stars = [];
    const currentRating =
      ratingType === 'my' && userRating !== null
        ? userRating
        : Number(movie.starRating) || 0;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <div
          key={i}
          className={`star ${i < currentRating ? 'filled' : 'empty'}`}
          onClick={() => handleStarClick(i + 1)}
          title={`Rate ${i + 1} stars`}
        />
      );
    }
    return stars;
  };

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
    setRatingType('my');
  };

  const handleRatingTypeChange = (type: 'average' | 'my') => {
    setRatingType(type);
  };

  return (
    <div className="movie-page">
      <div className="movie-detail-container">
        <div className="movie-detail-content">
          <div className="movie-poster-size">
            <img
              src={`https://movieposters45.blob.core.windows.net/movie-posters/${movie.title}.jpg`}
              alt={movie.title}
            />
          </div>
          <div className="movie-info">
            <h1 className="movie-title">
              {movie.title || 'No Title Available'}
            </h1>
            <div className="movie-meta">
              {movie.releaseYear || 'No Release Year'} |
              {movie.rating || 'No Rating'} | {movie.duration || 'No Duration'}
            </div>

            <div className="rating-toggle">
              <button
                className={`toggle-btn ${ratingType === 'average' ? 'active' : ''}`}
                onClick={() => handleRatingTypeChange('average')}
              >
                Average Rating
              </button>
              <button
                className={`toggle-btn ${ratingType === 'my' ? 'active' : ''}`}
                onClick={() => handleRatingTypeChange('my')}
              >
                My Rating {userRating ? `(${userRating}/5)` : ''}
              </button>
            </div>
            <div className="star-rating">{renderStars()}</div>

            <div className="movie-description">
              {movie.description || 'No Description Available'}
            </div>

            <div className="movie-details">
              <div className="detail-row">
                <div className="detail-label">Director:</div>
                <div className="detail-value">
                  {movie.director || 'No Director'}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Cast:</div>
                <div className="detail-value">
                  {movie.cast || 'No Cast Information'}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Country:</div>
                <div className="detail-value">
                  {movie.country || 'No Country Info'}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Type:</div>
                <div className="detail-value">
                  {movie.type || 'No Type Info'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-header">Genres</div>
      {movie.genres && (
        <div className="movie-genres">
          <div className="genre-grid">
            {movie.genres.map((genre) => (
              <span key={genre} className="genre-pill selected">
                {genre
                  .replace(/TV/g, 'TV ')
                  .replace(/([a-z])([A-Z])/g, '$1 $2')}
              </span>
            ))}
          </div>
        </div>
      )}

      {recShowIds && <Carousel
        title={`MORE LIKE "${movie.title.toUpperCase()}"`}
        showIds={recShowIds}
        className="more-like-this-carousel"
      />}
    </div>
  );
}
