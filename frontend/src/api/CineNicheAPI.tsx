
import { Movie } from "../types/Movie";
import { ProfileData } from "../types/ProfileData";

interface FetchMoviesResponse {
    movies: Movie[];
    totalPages: number;
}

const apiBaseUrl = 'https://cineniche-backend.azurewebsites.net';
// const apiBaseUrl = 'https://localhost:5000';
const apiBaseUrlMovies = apiBaseUrl+'/Movies';
const apiBaseUrlRoles = apiBaseUrl+'/api/roles';
const apiBaseUrlTwoFactor = apiBaseUrl+'/api/TwoFactor';

export async function fetchMovies(
    url: string,
    pageSize: number,
    pageNumber: number,
    searchInput: string = '',
    selectedCategories: string[] = [],
): Promise<FetchMoviesResponse> {
    try {
        const categoryParams = selectedCategories
            .map((c) => `selectedCategories=${encodeURIComponent(c)}`)
            .join('&');
        const response = await fetch(`${apiBaseUrlMovies}${url}?pageSize=${pageSize}&pageNumber=${pageNumber}${searchInput && `&search=${searchInput}`}${selectedCategories.length > 0 ? `&${categoryParams}` : ''}`,
            {
                credentials: 'include',
            }
        );
        if (response.status === 401) {
            throw new Error('You must be logged in to view this page.');
        } else if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch movies');
    }
}

export async function fetchCategories(): Promise<string[]> {
    try {
        const response = await fetch(`${apiBaseUrlMovies}/GetMovieCategories`, {
                credentials: 'include',
            });
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        return data.categories;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch categories');
    }
}

export async function fetchGenres(): Promise<string[]> {
    try {
        const response = await fetch(`${apiBaseUrlMovies}/GetGenres`, {
                credentials: 'include',
            });
        if (!response.ok) {
            throw new Error('Failed to fetch genres');
        }
        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch genres');
    }
}

export async function fetchMoviesCategories(): Promise<string[]> {
    try {
        const response = await fetch(`${apiBaseUrlMovies}/GetMovieCategories`, {
                credentials: 'include',
            });
        if (!response.ok) {
            throw new Error('Failed to fetch movie categories');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch movie categories');
    }
}

export async function fetchRatings(): Promise<string[]> {
    try {
        const response = await fetch(`${apiBaseUrlMovies}/GetRatings`, {
                credentials: 'include',
            });
        if (!response.ok) {
            throw new Error('Failed to fetch genres');
        }
        const data = await response.json();
        return data.ratings;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch genres');
    }
}

export async function fetchMovieById(showId: string | undefined): Promise<Movie> {
    try {
        const response = await fetch(`${apiBaseUrlMovies}/movie/${showId}`, {
                credentials: 'include',
            });    
        if (!response.ok) {
            throw new Error('Failed to fetch movie');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch movie');
    }    
}    

export async function addMovie(movie: Movie): Promise<Movie> {
    try {
        const { showId, ...movieWithoutId } = movie;

        const response = await fetch(`${apiBaseUrlMovies}/AddMovie`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieWithoutId),
                credentials: 'include',
            });
        if (!response.ok) {
            throw new Error('Failed to add movie');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add movie');
    }
}

export async function updateMovie(movie: Movie): Promise<Movie> {
    try {
        const response = await fetch(`${apiBaseUrlMovies}/UpdateMovie`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movie),
                credentials: 'include',
            });
        if (!response.ok) {
            throw new Error('Failed to update movie; wrong showId or sumn');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Womp womp');
    }
}

export async function deleteMovie(showId: number): Promise<void> {
    try {
        const response = await fetch(`${apiBaseUrlMovies}/DeleteMovie/${showId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
        if (!response.ok) {
            throw new Error('Failed to delete movie');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete movie');
    }
}

export async function pingAuth(): Promise<{ isAuthenticated: boolean; roles: string[] }> {
    try {
        const response = await fetch(`${apiBaseUrlRoles}/pingauth`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to ping auth');
        }

        return await response.json(); // returns { isAuthenticated: true, roles: ['Admin'] }
    } catch (error) {
        console.error(error);
        throw new Error('Failed to ping auth');
    }
}

export async function register({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<Response> {
    return await fetch(`${apiBaseUrl}/custom-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
      credentials: "include",
    });
  }
  

export async function login(email: string, password: string, twoFactorCode?: string): Promise<void> {
    const body: any = { email, password };
    if (twoFactorCode) {
      body.twoFactorCode = twoFactorCode;
    }
  
    const response = await fetch(`${apiBaseUrl}/login?useCookies=true&useSessionCookies=false`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
  
    if (!response.ok) {
      const errorBody = await response.json();
      const detail = errorBody?.detail || "Unknown error";
      throw new Error(detail);
    }
  }
  

export async function logout(): Promise<void> {
    try {
        const response = await fetch(`${apiBaseUrl}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        if (!response.ok) {
            throw new Error('Failed to logout');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Failed to logout');
    }
}

export async function fetchProfileData(): Promise<ProfileData> {
    try {
        const response = await fetch(`${apiBaseUrlRoles}/userinfo`, {
                method: 'GET',
                credentials: 'include',
            });
        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch profile data');
    }
}

export async function fetchUserId(): Promise<number | null> {
    try {
        const response = await fetch(`${apiBaseUrlRoles}/userId`, {
                method: 'GET',
                credentials: 'include',
            });
        if (!response.ok) {
            throw new Error('Failed to fetch user ID');
        }
        const data = await response.json();
        return data.userId ?? null; // Assuming the API returns userId in the response
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user ID');
    }
}

export async function check2FAStatus(): Promise<boolean> {
    try {
      const res = await fetch(`${apiBaseUrlTwoFactor}/status`, {
        credentials: "include",
      });
  
      if (!res.ok) throw new Error("Could not check 2FA status");
  
      const data = await res.json();
      return data.isEnabled === true;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to check 2FA status. Please sign in first.");
    }
  }
  

export async function fetchSetup(): Promise<{sharedKey: string; qrCodeUri: string}> {
    try {
        const res = await fetch(`${apiBaseUrlTwoFactor}/setup`, {
            credentials: "include",
        });

        if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg);
        }

        return await res.json();
    } catch (err) {
        throw new Error("Failed to load 2FA setup.");
    }
}

export async function verify2FACode(code: string): Promise<void> {
    try {
        const res = await fetch(`${apiBaseUrlTwoFactor}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code }),
        });

        if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg);
        }
    } catch (err) {
        throw err;
    }
}

export async function disable2FA(): Promise<void> {
    try {
        const res = await fetch(`${apiBaseUrlTwoFactor}/disable`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg);
        }
    } catch (err) {
        throw err;
    }
}

export async function fetchGenreRecs(userId: number): Promise<Record<string, Movie[]>> {
    try {
        const response = await fetch(`${apiBaseUrlMovies}/GetGenreRecs?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch genre recommendations');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch genre recommendations');
    }
}

export async function fetchContentRecs(showId: number): Promise<number[]> {
    try {
        const response = await fetch(`${apiBaseUrlMovies}/GetContentRecs?showId=${showId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch content recommendations');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch content recommendations');
    }
}

export async function fetchUserRecs(userId: number): Promise<number[]> {
    try {
        const response = await fetch(`${apiBaseUrlMovies}/GetUserRecs?userId=${userId}`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user recommendations');
        }
        const data = await response.json();
        return data.map((id: string) => parseInt(id));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user recommendations');
    }
}

export async function fetchMultipleMovies(showIds: number[]): Promise<Movie[]> {
    try {
        if (showIds.length === 0) {
            return [];
        }
        const queryString = showIds.map(id => `ids=${id}`).join('&');

        const response = await fetch(`${apiBaseUrlMovies}/movies?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch multiple movies');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch multiple movies');
    }
}