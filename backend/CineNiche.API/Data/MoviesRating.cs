using System;
using System.Collections.Generic;

namespace CineNiche.API.Data;

public partial class MoviesRating
{
    public int UserId { get; set; }

    public int ShowId { get; set; }

    public int? Rating { get; set; }
}
