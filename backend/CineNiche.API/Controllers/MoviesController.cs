using System.Linq.Expressions;
using System.Text;
using System.Text.Json;
using CineNiche.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CineNiche.API.Controllers;

[ApiController]
[Route("[controller]")]
public class MoviesController : ControllerBase
{
    private UpdatedMoviesContext _context;

    private readonly Dictionary<string, List<string>> genreMap = new Dictionary<string, List<string>>
    {
        { "Action & Adventure", new() { "Action", "Adventure", "TVAction", "Thrillers", "InternationalMoviesThrillers", "AnimeSeriesInternationalTVShows" } },
        { "Comedy", new() { "Comedies", "TVComedies", "ComediesInternationalMovies", "ComediesDramasInternationalMovies", "ComediesRomanticMovies", "TalkShowsTVComedies" } },
        { "Drama", new() { "Dramas", "DramasInternationalMovies", "DramasRomanticMovies", "TVDramas", "ComediesDramasInternationalMovies", "InternationalTVShowsRomanticTVShowsTVDramas" } },
        { "Romance", new() { "ComediesRomanticMovies", "DramasRomanticMovies", "InternationalTVShowsRomanticTVShowsTVDramas" } },
        { "Documentary & Reality", new() { "Documentaries", "Docuseries", "BritishTVShowsDocuseriesInternationalTVShows", "CrimeTVShowsDocuseries", "DocumentariesInternationalMovies", "RealityTV", "NatureTV" } },
        { "International", new() { "AnimeSeriesInternationalTVShows", "BritishTVShowsDocuseriesInternationalTVShows", "ComediesInternationalMovies", "DramasInternationalMovies", "DocumentariesInternationalMovies", "InternationalMoviesThrillers", "InternationalTVShowsRomanticTVShowsTVDramas", "LanguageTVShows" } },
        { "Family & Kids", new() { "Children", "FamilyMovies", "KidsTV" } },
        { "Fantasy, Horror & Spiritual", new() { "Fantasy", "HorrorMovies", "Musicals", "Spirituality" } }
    };
    
    private readonly List<string> ratingOptions = new List<string>
    {
        "G",
        "NR",
        "PG",
        "PG-13",
        "R",
        "TV-14",
        "TV-G",
        "TV-MA",
        "TV-PG",
        "TV-Y",
        "TV-Y7",
        "TV-Y7-FV",
        "UR"
    };
    public MoviesController(UpdatedMoviesContext temp)
    {
        _context = temp;
    }

    private int getStarRating(int showId)
    {
        var ratings = _context.MoviesRatings
            .Where(rating => rating.ShowId == showId)
            .Select(rating => rating.Rating);

        if (!ratings.Any())
            return 0; // Or some default value for "no rating"

        int averageRating = (int)Math.Round(ratings.Average().Value);
        return averageRating;
    }
    [Authorize]
    [HttpGet]
    public IActionResult GetMovies(int pageSize = 10, int pageNumber = 1, string? search = null, [FromQuery] List<string>? selectedCategories = null)
    {
        var moviesQuery = _context.MoviesTitles.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            search = search.ToLower();

            moviesQuery = moviesQuery
                .Where(m =>
                    m.Title.ToLower().Contains(search) ||
                    m.Director.ToLower().Contains(search) ||
                    m.Cast.ToLower().Contains(search) ||
                    m.Description.ToLower().Contains(search)
                )
                .OrderByDescending(m => m.Title.ToLower().Contains(search) ? 3 :
                    m.Description.ToLower().Contains(search) ? 2 :
                    (m.Director.ToLower().Contains(search) || m.Cast.ToLower().Contains(search)) ? 1 : 0);
        }
        
        if (selectedCategories != null && selectedCategories.Any())
        {
            // Flatten all genre column names that match the selected categories
            var genreColumns = selectedCategories
                .Where(genreMap.ContainsKey)
                .SelectMany(category => genreMap[category])
                .Distinct()
                .ToList();
            
            // Build expression: movie => movie.Genre1 == 1 || movie.Genre2 == 1 || ...
            var parameter = Expression.Parameter(typeof(MoviesTitle), "movie");
            Expression predicate = null;

            foreach (var genre in genreColumns)
            {
                var property = Expression.PropertyOrField(parameter, genre);
                var one = Expression.Constant(1, typeof(int?));
                var equals = Expression.Equal(property, one);

                predicate = predicate == null ? equals : Expression.OrElse(predicate, equals);
            }

            if (predicate != null)
            {
                var lambda = Expression.Lambda<Func<MoviesTitle, bool>>(predicate, parameter);
                moviesQuery = moviesQuery.Where(lambda);
            }

        }

        var totalItems = moviesQuery.Count();
        int totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

        var moviesData = moviesQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList(); // Executes the query and materializes data in memory

        var movies = moviesData
            .Select(m => new
            {
                m.ShowId,
                m.Type,
                m.Title,
                m.Director,
                m.Cast,
                m.Country,
                m.ReleaseYear,
                m.Rating,
                m.Duration,
                m.Description,
                StarRating = getStarRating(m.ShowId) // now safe to call
            })
            .ToList();
        
        return Ok(new
        {
            movies,
            totalPages
        });
    }

    [Authorize]
    [HttpGet("GetMovieCategories")]
    public IActionResult GetMovieCategories()
    {
        return Ok(new
        {
            categories = genreMap.Keys.ToList()
        });
    }
    
    [Authorize]
    [HttpGet("GetGenres")]
    public IActionResult GetGenres()
    {
        var distinctGenres = genreMap
            .Values
            .SelectMany(g => g)
            .Distinct()
            .ToList();

        return Ok(new
        {
            genres = distinctGenres
        });
    }
    
    [Authorize]
    [HttpGet("GetRatings")]
    public IActionResult GetRatings()
    {
        return Ok(new
        {
            ratings = ratingOptions
        });
    }
    
    [Authorize]
    [HttpGet("movie/{id}")]
    public async Task<IActionResult> GetMovie([FromRoute] int id)
    {
        var movie = await _context.MoviesTitles.FindAsync(id);

        if (movie == null)
        {
            return NotFound();
        }
        
        var genreColumns = genreMap
            .Values
            .SelectMany(g => g)
            .Distinct()
            .ToList();
        
        List<string> genres = new List<string>();

        foreach (var genre in genreColumns)
        {
            var property = typeof(MoviesTitle).GetProperty(genre);
            if (property != null)
            {
                var value = property.GetValue(movie);
                if (value is int intValue && intValue == 1)
                {
                    genres.Add(genre);
                }
            }
        }
        
        return Ok(new
        {
            movie.ShowId,
            movie.Type,
            movie.Title,
            movie.Director,
            movie.Cast,
            movie.Country,
            movie.ReleaseYear,
            movie.Rating,
            movie.Duration,
            movie.Description,
            StarRating = getStarRating(movie.ShowId),
            genres
        });
    }
    
    [Authorize]
    [HttpGet("movies")]
    public async Task<IActionResult> GetMovies([FromQuery] List<int> ids)
    {
        var movies = await _context.MoviesTitles
            .Where(m => ids.Contains(m.ShowId))
            .ToListAsync();

        if (movies.Count == 0)
        {
            return NotFound();
        }

        var genreColumns = genreMap
            .Values
            .SelectMany(g => g)
            .Distinct()
            .ToList();

        var result = movies.Select(movie =>
        {
            return new
            {
                movie.ShowId,
                movie.Type,
                movie.Title,
                movie.Director,
                movie.Cast,
                movie.Country,
                movie.ReleaseYear,
                movie.Rating,
                movie.Duration,
                movie.Description,
                StarRating = getStarRating(movie.ShowId)
            };
        });

        return Ok(result);
    }

    [Authorize]
    [HttpGet("user/{id}")]
    public async Task<IActionResult> GetUser([FromRoute] int id)
    {
        var user = await _context.MoviesUsers.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("AddMovie")]
    public IActionResult AddMovie([FromBody] MoviesTitle movie)
    {
        // Manually get the highest ShowId currently in the table
        var lastId = _context.MoviesTitles
            .OrderByDescending(m => m.ShowId)
            .Select(m => m.ShowId)
            .FirstOrDefault();

        movie.ShowId = lastId + 1;

        _context.MoviesTitles.Add(movie);
        _context.SaveChanges();

        return Ok(movie);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("UpdateMovie")]
    public IActionResult UpdateMovie([FromBody] MoviesTitle movie)
    {
        var movieToUpdate = _context.MoviesTitles.Find(movie.ShowId);
        if (movieToUpdate is null)
        {
            return NotFound();
        }
        movieToUpdate.Title = movie.Title;
        movieToUpdate.Type = movie.Type;
        movieToUpdate.Director = movie.Director;
        movieToUpdate.Cast = movie.Cast;
        movieToUpdate.Country = movie.Country;
        movieToUpdate.ReleaseYear = movie.ReleaseYear;
        movieToUpdate.Rating = movie.Rating;
        movieToUpdate.Duration = movie.Duration;
        movieToUpdate.Description = movie.Description;
        
        _context.MoviesTitles.Update(movieToUpdate);
        _context.SaveChanges();
        
        return Ok(movieToUpdate);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("DeleteMovie/{showId}")]
    public IActionResult DeleteMovie(int showId)
    {
        var movieToDelete = _context.MoviesTitles.Find(showId);
        if (movieToDelete is null)
        {
            return NotFound();
        }
        _context.MoviesTitles.Remove(movieToDelete);
        _context.SaveChanges();
        
        return NoContent();
    }

    [Authorize]
    [HttpGet("GetGenreRecs")]
    public IActionResult GetGenreRecs(int userId)
    {
        var genres = _context.UserGenreRecommendations
            .Where(u => u.UserId == userId)
            .ToList();

        var result = new Dictionary<string, List<object>>();

        foreach (var g in genres)
        {
            var recIds = new List<long?>
                {
                    g.Rec1, g.Rec2, g.Rec3, g.Rec4, g.Rec5,
                    g.Rec6, g.Rec7, g.Rec8, g.Rec9, g.Rec10
                }
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                .ToList();

            var movieLookup = _context.MoviesTitles
                .Where(m => recIds.Contains(m.ShowId))
                .ToDictionary(m => m.ShowId);

            var orderedMovies = recIds
                .Where(id => movieLookup.ContainsKey((int)id))
                .Select(id => (object)new
                {
                    movieLookup[(int)id].ShowId,
                    movieLookup[(int)id].Type,
                    movieLookup[(int)id].Title,
                    movieLookup[(int)id].Director,
                    movieLookup[(int)id].Cast,
                    movieLookup[(int)id].Country,
                    movieLookup[(int)id].ReleaseYear,
                    movieLookup[(int)id].Rating,
                    movieLookup[(int)id].Duration,
                    movieLookup[(int)id].Description,
                    StarRating = getStarRating(movieLookup[(int)id].ShowId)
                })
                .ToList();

            result[g.Genre] = orderedMovies;
        }

        return Ok(result);
    }
    
    [Authorize]
    [HttpGet("GetContentRecs")]
    public IActionResult GetContentRecs(int showId)
    {
        var recs = _context.ContentRecommendations
            .FirstOrDefault(show => show.OriginalShowId == showId);

        if (recs == null)
            return NotFound();

        var recIds = new List<long?>
            {
                recs.Rec1, recs.Rec2, recs.Rec3, recs.Rec4, recs.Rec5,
                recs.Rec6, recs.Rec7, recs.Rec8, recs.Rec9, recs.Rec10,
                recs.Rec11, recs.Rec12, recs.Rec13, recs.Rec14, recs.Rec15,
                recs.Rec16, recs.Rec17, recs.Rec18, recs.Rec19, recs.Rec20
            }
            .Where(id => id.HasValue)
            .Select(id => id.Value)
            .ToList();

        return Ok(recIds);
    }
    
    [Authorize]
    [HttpPost("GetUserRecs")]
    public async Task<IActionResult> GetUserRecs(int userId)
    {
        var url = "http://4392caed-e5b4-4bcb-9887-35031feb3867.eastus2.azurecontainer.io/score";
        var key = "epgWTzgR9Tf4PMjI4ZouvmzHigd67ZQe";
        
        var inputs = _context.MoviesRatings
            .Where(m => m.UserId == userId)
            .Select(m => new { user_id = m.UserId, show_id = m.ShowId })
            .ToArray();

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {key}");

        var payload = new
        {
            Inputs = new
            {
                input1 = inputs
            }
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        try
        {
            var response = await client.PostAsync(url, content);
            response.EnsureSuccessStatusCode();

            var resultString = await response.Content.ReadAsStringAsync();
            var resultJson = JsonSerializer.Deserialize<JsonElement>(resultString);

            var output = resultJson
                .GetProperty("Results")
                .GetProperty("WebServiceOutput0")[0];

            var recommendedIds = new List<string>();

            foreach (var property in output.EnumerateObject())
            {
                if (property.Name != "User")
                {
                    recommendedIds.Add(property.Value.GetString());
                }
            }

            return Ok(recommendedIds);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}