using System;
using System.Collections.Generic;
using CineNiche.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CineNiche.API.Data;

public partial class UpdatedMoviesContext : DbContext
{
    public UpdatedMoviesContext()
    {
    }

    public UpdatedMoviesContext(DbContextOptions<UpdatedMoviesContext> options)
        : base(options)
    {
    }

    public virtual DbSet<MoviesRating> MoviesRatings { get; set; }

    public virtual DbSet<MoviesTitle> MoviesTitles { get; set; }

    public virtual DbSet<MoviesUser> MoviesUsers { get; set; }
    
    public virtual DbSet<UserGenreRecommendation> UserGenreRecommendations { get; set; }
    
    public virtual DbSet<ContentRecommendation> ContentRecommendations { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MoviesRating>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.ShowId });

            entity.ToTable("movies_ratings");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.ShowId).HasColumnName("show_id");
            entity.Property(e => e.Rating).HasColumnName("rating");
        });

        modelBuilder.Entity<MoviesTitle>(entity =>
        {
            entity.HasKey(e => e.ShowId);

            entity.ToTable("movies_titles");

            entity.Property(e => e.ShowId)
                .ValueGeneratedNever()
                .HasColumnName("show_id");
            entity.Property(e => e.AnimeSeriesInternationalTvShows).HasColumnName("Anime_Series_International_TV_Shows");
            entity.Property(e => e.BritishTvShowsDocuseriesInternationalTvShows).HasColumnName("British_TV_Shows_Docuseries_International_TV_Shows");
            entity.Property(e => e.Cast).HasColumnName("cast");
            entity.Property(e => e.ComediesDramasInternationalMovies).HasColumnName("Comedies_Dramas_International_Movies");
            entity.Property(e => e.ComediesInternationalMovies).HasColumnName("Comedies_International_Movies");
            entity.Property(e => e.ComediesRomanticMovies).HasColumnName("Comedies_Romantic_Movies");
            entity.Property(e => e.Country).HasColumnName("country");
            entity.Property(e => e.CrimeTvShowsDocuseries).HasColumnName("Crime_TV_Shows_Docuseries");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Director).HasColumnName("director");
            entity.Property(e => e.DocumentariesInternationalMovies).HasColumnName("Documentaries_International_Movies");
            entity.Property(e => e.DramasInternationalMovies).HasColumnName("Dramas_International_Movies");
            entity.Property(e => e.DramasRomanticMovies).HasColumnName("Dramas_Romantic_Movies");
            entity.Property(e => e.Duration).HasColumnName("duration");
            entity.Property(e => e.FamilyMovies).HasColumnName("Family_Movies");
            entity.Property(e => e.HorrorMovies).HasColumnName("Horror_Movies");
            entity.Property(e => e.InternationalMoviesThrillers).HasColumnName("International_Movies_Thrillers");
            entity.Property(e => e.InternationalTvShowsRomanticTvShowsTvDramas).HasColumnName("International_TV_Shows_Romantic_TV_Shows_TV_Dramas");
            entity.Property(e => e.KidsTv).HasColumnName("Kids_TV");
            entity.Property(e => e.LanguageTvShows).HasColumnName("Language_TV_Shows");
            entity.Property(e => e.NatureTv).HasColumnName("Nature_TV");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.RealityTv).HasColumnName("Reality_TV");
            entity.Property(e => e.ReleaseYear).HasColumnName("release_year");
            entity.Property(e => e.TalkShowsTvComedies).HasColumnName("Talk_Shows_TV_Comedies");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.TvAction).HasColumnName("TV_Action");
            entity.Property(e => e.TvComedies).HasColumnName("TV_Comedies");
            entity.Property(e => e.TvDramas).HasColumnName("TV_Dramas");
            entity.Property(e => e.Type).HasColumnName("type");
        });

        modelBuilder.Entity<MoviesUser>(entity =>
        {
            entity.HasKey(e => e.UserId);

            entity.ToTable("movies_users");

            entity.Property(e => e.UserId)
                .ValueGeneratedNever()
                .HasColumnName("user_id");
            entity.Property(e => e.Age).HasColumnName("age");
            entity.Property(e => e.AmazonPrime).HasColumnName("Amazon_Prime");
            entity.Property(e => e.AppleTvPlus).HasColumnName("Apple_TV_plus");
            entity.Property(e => e.City).HasColumnName("city");
            entity.Property(e => e.DisneyPlus).HasColumnName("Disney_plus");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Gender).HasColumnName("gender");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.ParamountPlus).HasColumnName("Paramount_plus");
            entity.Property(e => e.Phone).HasColumnName("phone");
            entity.Property(e => e.State).HasColumnName("state");
            entity.Property(e => e.Zip).HasColumnName("zip");
        });
        
        modelBuilder.Entity<UserGenreRecommendation>(entity =>
        {
            entity.ToTable("user_genre_recommendations");

            entity.HasKey(e => new { e.UserId, e.Genre });

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Genre).HasColumnName("genre");

            entity.Property(e => e.Rec1).HasColumnName("rec1");
            entity.Property(e => e.Rec2).HasColumnName("rec2");
            entity.Property(e => e.Rec3).HasColumnName("rec3");
            entity.Property(e => e.Rec4).HasColumnName("rec4");
            entity.Property(e => e.Rec5).HasColumnName("rec5");
            entity.Property(e => e.Rec6).HasColumnName("rec6");
            entity.Property(e => e.Rec7).HasColumnName("rec7");
            entity.Property(e => e.Rec8).HasColumnName("rec8");
            entity.Property(e => e.Rec9).HasColumnName("rec9");
            entity.Property(e => e.Rec10).HasColumnName("rec10");
        });
        
        modelBuilder.Entity<ContentRecommendation>(entity =>
        {
            entity.HasKey(e => e.OriginalShowId);

            entity.ToTable("content_recommendations");

            entity.Property(e => e.OriginalShowId).HasColumnName("original_show_id");

            entity.Property(e => e.Rec1).HasColumnName("rec_1");
            entity.Property(e => e.Rec2).HasColumnName("rec_2");
            entity.Property(e => e.Rec3).HasColumnName("rec_3");
            entity.Property(e => e.Rec4).HasColumnName("rec_4");
            entity.Property(e => e.Rec5).HasColumnName("rec_5");
            entity.Property(e => e.Rec6).HasColumnName("rec_6");
            entity.Property(e => e.Rec7).HasColumnName("rec_7");
            entity.Property(e => e.Rec8).HasColumnName("rec_8");
            entity.Property(e => e.Rec9).HasColumnName("rec_9");
            entity.Property(e => e.Rec10).HasColumnName("rec_10");
            entity.Property(e => e.Rec11).HasColumnName("rec_11");
            entity.Property(e => e.Rec12).HasColumnName("rec_12");
            entity.Property(e => e.Rec13).HasColumnName("rec_13");
            entity.Property(e => e.Rec14).HasColumnName("rec_14");
            entity.Property(e => e.Rec15).HasColumnName("rec_15");
            entity.Property(e => e.Rec16).HasColumnName("rec_16");
            entity.Property(e => e.Rec17).HasColumnName("rec_17");
            entity.Property(e => e.Rec18).HasColumnName("rec_18");
            entity.Property(e => e.Rec19).HasColumnName("rec_19");
            entity.Property(e => e.Rec20).HasColumnName("rec_20");
        });
        
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
