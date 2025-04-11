import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { deleteMovie, fetchMovieById, fetchMovies, logout } from '../api/CineNicheAPI';
import Pagination from '../components/Pagination';
import NewMovieForm from '../components/NewMovieForm';
import '../styles/ManageMovies.css'; // Applying styles from the second code
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const ManageMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();

  // Fetch movies when page size or number changes
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchMovies('/', pageSize, pageNumber);
        setMovies(data.movies);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [pageSize, pageNumber]);

  // Handle movie deletion
  const handleDeleteMovie = async (showId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this movie?'
    );
    if (!confirmDelete) return;

    try {
      await deleteMovie(showId);
      setMovies(movies.filter((b) => b.showId !== showId));
    } catch (error) {
      alert('Failed to delete movie. Please try again.');
    }
  };

  // Handle editing movie
  const handleEditMovie = async (movie: Movie) => {
    await fetchMovieById(String(movie.showId)).then(setEditingMovie);
    setShowForm(true);
  };

  const handleLogout = async () => {
      try {
        await logout();
        navigate("/LoginPage");
      } catch (err) {
        console.error("Logout failed:", err);
      }
    };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="admin-header">
          <div className="admin-icon">
            <i className="ti ti-user-circle"></i>
          </div>
          <div className="admin-title">
            <span>Admin</span>
          </div>
        </div>
        <div className="sidebar-menu">
          <div className="menu-item">
            <div className="menu-icon">
              <i className="ti ti-home"></i>
            </div>
            <div>
              <span>Home</span>
            </div>
          </div>
          <div className="menu-item active">
            <div className="menu-icon">
              <i className="ti ti-movie"></i>
            </div>
            <div>
              <span>Manage Movies</span>
            </div>
          </div>
          <div className="menu-item">
            <div className="menu-icon">
              <i className="ti ti-logout"></i>
            </div>
            <div onClick={handleLogout}>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <div className="page-title">
            <span>Movies</span>
          </div>
          <div
            className="user-profile add-button"
            onClick={() => setShowForm(true)}
          >
            <div className="profile-icon">
              <i className="ti ti-plus"></i>
            </div>
          </div>
        </div>

        {/* Movie Table */}
        <div className="table-container">
          <table className="movie-table">
            <thead>
              <tr>
                <th />
                <th>#</th>
                <th>TYPE</th>
                <th>TITLE</th>
                <th>DIRECTOR</th>
                <th>CAST</th>
                <th>COUNTRY</th>
                <th>RELEASE YEAR</th>
                <th>RATING</th>
                <th>DURATION</th>
                <th>DESCRIPTION</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.showId}>
                  <td>
                    <MovieCard movie={movie} />
                  </td>
                  <td>{movie.showId}</td>
                  <td>{movie.type}</td>
                  <td>{movie.title}</td>
                  <td>{movie.director}</td>
                  <td>{movie.cast}</td>
                  <td>{movie.country}</td>
                  <td>{movie.releaseYear}</td>
                  <td>{movie.rating}</td>
                  <td>{movie.duration}</td>
                  <td className="description-cell">{movie.description}</td>
                  <td className="action-cell">
                    <button
                      style={{
                        backgroundColor: '#028fa6',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleEditMovie(movie)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteMovie(movie.showId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <Pagination
          totalPages={totalPages}
          pageNumber={pageNumber}
          pageSize={pageSize}
          setPageNumber={setPageNumber}
          setPageSize={setPageSize}
        />
      </div>

      {/* Add/Edit Movie Form */}
      {showForm && (
        <div className="overlay">
          <div className="edit-form-scroll-wrapper">
            <NewMovieForm
              movie={editingMovie}
              onSuccess={() => {
                setEditingMovie(null);
                setShowForm(false);
                fetchMovies('/', pageSize, pageNumber).then((data) => {
                  setMovies(data.movies);
                  setTotalPages(data.totalPages);
                });
              }}
              onCancel={() => {
                setEditingMovie(null);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMovies;
