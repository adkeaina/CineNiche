import { useEffect, useRef, useState } from "react";
import { Movie } from "../types/Movie";
import { fetchCategories, fetchMovies } from "../api/CineNicheAPI";
import "../styles/SearchPage.css";
import MovieCard from "../components/MovieCard";
import Profile from "../components/Profile";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function SearchPage() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState("");
    const [pages, setPages] = useState(1);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await fetchCategories();
                setCategories(cats);
            } catch (err) {
            }
        }
      
        loadCategories();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const loadMovies = async () => {
                try {
                    setMovies([]);
                    setLoading(true);
                    const data = await fetchMovies("", 24, 1, inputValue, selectedCategories);
                    setPages(1);
                    setMovies(data.movies);
                    setTotalPages(data.totalPages);
                    setLoading(false);
                } catch (err) {
                    console.error("Failed to fetch movies:", err);
                }
            };
    
            if (inputValue.length >= 2 || selectedCategories.length > 0) {
                loadMovies();
            } else {
                setMovies([]);
                setPages(1);
                setTotalPages(0);
            }
        }, 1000); // 1000ms = 1 second
    
        return () => clearTimeout(delayDebounce);
    }, [inputValue, selectedCategories]);
    
    useEffect(() => {
        const loadMoreMovies = async () => {
            try {
                await setLoading(true);
                const data = await fetchMovies("", 24, pages, inputValue);
                setMovies((prevMovies) => [...prevMovies, ...data.movies]);
                setTotalPages(data.totalPages);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch movies:", err);
            }
        }

        loadMoreMovies();
    }, [pages]);

    const handleFilterChange = ( cat : string) => {
        const updatedCategories = selectedCategories.includes(cat) ? selectedCategories.filter(c => c !== cat) : [...selectedCategories, cat];
        setSelectedCategories(updatedCategories);
    }

    return (
        <div className="search-container">
            <div hidden={!showProfile}>
                <Profile onClose={() => setShowProfile(false)} />
            </div>
            <div className="search-header">
                <div className="brand-logo" onClick={() => navigate('/movies')}>CineNiche</div>
                <div className="spacer"></div>
                <div className="user-profile" onClick={() => setShowProfile(!showProfile)}>
                    <div className="user-avatar">
                        <div className="user-icon"></div>
                    </div>
                </div>
            </div>
            <div className="search-content">
                <div className="search-box-container">
                    <div className="search-form">
                        <div className="search-input-wrapper">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search..."
                                className="search-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <div className="search-icon-wrapper" onClick={() => inputRef.current?.focus()}>
                                <div className="search-icon"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Categories Section */}
            {categories && (
                <section className="categories-section">
                    <div className="categories-container">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className="category-btn"
                                onClick={() => handleFilterChange(category)}
                                style={selectedCategories.includes(category) ? {
                                    backgroundColor: "#014956",
                                    boxShadow: "0 0 20px rgba(1, 73, 86, 0.6)"
                                } : {}}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </section>
            )}
            {inputValue.length >= 3 ? (
                <div className="search-results">
                    <h2>Search Results for "{inputValue}"</h2>
                    <div className="results-wrapper">
                        <div className="results">
                            {movies ? movies.map((movie) =>
                                <MovieCard key={movie.showId} movie={movie} isAuthorized />
                            ) : <p>No results found.</p>}
                        </div>
                    </div>
                    {loading ? <Loading /> :
                        <button className="load-more-btn" onClick={() => setPages(pages + 1)} hidden={pages >= totalPages}>Load More</button>
                    }
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <h2>Search Results here:</h2>
                </div>
            )}
        </div>
    );
}