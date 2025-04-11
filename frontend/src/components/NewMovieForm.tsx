import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Movie } from "../types/Movie";
import { addMovie, updateMovie, fetchGenres, fetchRatings } from "../api/CineNicheAPI";
import "../styles/NewMovieForm.css";

interface NewMovieFormProps {
  movie: Movie | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function NewMovieForm({ movie, onSuccess, onCancel }: NewMovieFormProps) {
    const [formData, setFormData] = useState<Movie>(() => {
    if (movie) {
        return {
            ...movie,
            genres: movie.genres ?? [],
        };
    }
    
    return {
        showId: 0,
        type: "",
        title: "",
        director: "",
        cast: "",
        country: "",
        releaseYear: 2025,
        rating: "",
        duration: "",
        description: "",
        starRating: 0,
        genres: [],
    };
    });

    const [availableGenres, setAvailableGenres] = useState<string[]>([]);
    const [ratings, setRatings] = useState<string[]>([]);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const genres = await fetchGenres();
                setAvailableGenres(genres);
            } catch (error) {
                console.error("Failed to load genres:", error);
            }
        };

        const loadRatings = async () => {
            try {
                const demRatings = await fetchRatings();
                setRatings(demRatings);
            } catch (error) {
                console.error("Failed to load genres:", error);
            }
        };
    
        loadGenres();
        loadRatings();
    }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres ? (prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre]) : [genre],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (movie) {
      await updateMovie(formData);
    } else {
      await addMovie({...formData});
    }
    onSuccess();
  };

  const formatLabel = (genre: string) =>
    genre
      .replace(/TV/g, "TV ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim();

  return (
    <>
      <button type="button" className="close-button" onClick={onCancel}>
        &times;
      </button>
      <h2>{movie ? "Update" : "Add New"} Movie</h2>
      <form onSubmit={handleSubmit} className="movie-form">
        {[
          { label: "Type", name: "type" },
          { label: "Title", name: "title" },
          { label: "Director", name: "director" },
          { label: "Cast", name: "cast" },
          { label: "Country", name: "country" },
          { label: "Release Year", name: "releaseYear", type: "number" },
          { label: "Rating", name: "rating" },
          { label: "Duration", name: "duration" },
          { label: "Description", name: "description" },
        ].map(({ label, name, type }) => (
          <div className={`new-form-group ${name == 'description' && 'description-field'}`} key={name}>
            <label htmlFor={name}>{label}</label>
            {(label === "Rating" || label === "Type") ? (
                <select
                    id={name}
                    name={name}
                    value={(formData as any)[name]}
                    onChange={handleChange}
                    required
                    className="rating-select"
                >
                    <option value="" disabled>Select a {name}</option>
                    {label === "Rating" ? ratings.map((r) => (
                    <option key={r} value={r}>{r}</option>
                    )) :
                        ["Movie", "TV Shows"].map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
                ) : label === "Description" ? (
                <textarea
                    id={name}
                    name={name}
                    value={(formData as any)[name] || ""}
                    onChange={handleChange}
                    required
                    className="description-textarea"
                />
                ) : (
                <input
                    type={type || "text"}
                    id={name}
                    name={name}
                    value={(formData as any)[name] || ""}
                    onChange={handleChange}
                    required
                />
            )}
          </div>
        ))}

        <div className="new-form-group">
          <label>Genres</label>
          <div className="genre-grid">
            {availableGenres.map((genre) => (
              <label key={genre} className={`genre-pill ${formData.genres?.includes(genre) ? "selected" : ""}`}>
                <input
                  type="checkbox"
                  checked={formData.genres?.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                />
                {formatLabel(genre)}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {movie ? "Update" : "Add"} Movie
          </button>
        </div>
      </form>
    </>
  );
}