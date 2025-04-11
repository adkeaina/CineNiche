using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CineNiche.API.Models;
public class ContentRecommendation
{
    [Key]
    public long OriginalShowId { get; set; }

    public long? Rec1 { get; set; }
    public long? Rec2 { get; set; }
    public long? Rec3 { get; set; }
    public long? Rec4 { get; set; }
    public long? Rec5 { get; set; }
    public long? Rec6 { get; set; }
    public long? Rec7 { get; set; }
    public long? Rec8 { get; set; }
    public long? Rec9 { get; set; }
    public long? Rec10 { get; set; }
    public long? Rec11 { get; set; }
    public long? Rec12 { get; set; }
    public long? Rec13 { get; set; }
    public long? Rec14 { get; set; }
    public long? Rec15 { get; set; }
    public long? Rec16 { get; set; }
    public long? Rec17 { get; set; }
    public long? Rec18 { get; set; }
    public long? Rec19 { get; set; }
    public long? Rec20 { get; set; }
}