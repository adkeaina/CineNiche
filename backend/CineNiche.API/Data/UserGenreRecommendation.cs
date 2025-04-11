using System.ComponentModel.DataAnnotations.Schema;

namespace CineNiche.API.Models
{
    public class UserGenreRecommendation
    {
        [Column("user_id")]
        public long UserId { get; set; }

        [Column("genre")]
        public string Genre { get; set; } = null!;

        [Column("rec1")]
        public long? Rec1 { get; set; }

        [Column("rec2")]
        public long? Rec2 { get; set; }

        [Column("rec3")]
        public long? Rec3 { get; set; }

        [Column("rec4")]
        public long? Rec4 { get; set; }

        [Column("rec5")]
        public long? Rec5 { get; set; }

        [Column("rec6")]
        public long? Rec6 { get; set; }

        [Column("rec7")]
        public long? Rec7 { get; set; }

        [Column("rec8")]
        public long? Rec8 { get; set; }

        [Column("rec9")]
        public long? Rec9 { get; set; }

        [Column("rec10")]
        public long? Rec10 { get; set; }
    }
}