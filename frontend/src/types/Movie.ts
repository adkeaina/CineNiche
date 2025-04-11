export interface Movie {
    showId: number;
    type: string | null;
    title: string;
    director: string | null;
    cast: string | null;
    country: string | null;
    releaseYear: number;
    rating: string | null;
    duration: string | null;
    description: string | null;
    starRating?: number;
    genres?: string[] | null;
}