import { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import "../styles/MovieList.css";
import { fetchMovies, fetchMultipleMovies } from "../api/CineNicheAPI";
import MovieCard from "./MovieCard";
import { useNavigate } from "react-router-dom";

interface MovieListProps {
  url?: string;
  shownMovies?: Movie[];
  isAuthorized?: boolean;
  showIds?: number[];
}

export default function MovieList({ url = undefined, shownMovies = undefined, isAuthorized = false, showIds = undefined }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        let data;
        if (url) {
          data = await fetchMovies(url, 10, pageNumber);
          setMovies(data.movies);
          setTotalPages(data.totalPages);
        } else if (showIds) {
          data = await fetchMultipleMovies(showIds);
          setMovies(data);
        } else if (shownMovies) {
        } else throw new Error("No URL or show IDs provided");

      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
  
    loadMovies();
  }, [pageNumber, showIds]);

  useEffect(() => {
    setMovies(shownMovies ?? []);
  }, [shownMovies]);

  if (error) {
    return (
      <div className="movie-error">
        <h2>{error}</h2>
        <button onClick={() => navigate("/LoginPage")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="carousel-wrapper">
      {pageNumber > 1 && !isLoading && (
        <button className="nav-button left" onClick={() => setPageNumber(pageNumber - 1)}>
          &#8249;
        </button>
      )}
  
      <div className="carousel-track">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => <div className="movie-skeleton" key={i} />)
          : movies.map((movie) => (
              <MovieCard key={movie.showId} movie={movie} isAuthorized={isAuthorized} />
            ))}
      </div>
  
      {pageNumber < totalPages && !isLoading && (
        <button className="nav-button right" onClick={() => setPageNumber(pageNumber + 1)}>
          &#8250;
        </button>
      )}
    </div>
  );
}