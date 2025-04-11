import { useNavigate } from "react-router-dom";
import { Movie } from "../types/Movie";
import { useState } from "react";
import "../styles/HomePage.css";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import Header from "../components/Header";

const trendingMovies: Movie[] = [
  {
    "showId": 1,
    "type": "Movie",
    "title": "Dick Johnson Is Dead",
    "director": "Kirsten Johnson",
    "cast": "Michael Hilow, Ana Hoffman, Dick Johnson, Kirsten Johnson, Chad Knorr",
    "country": "United States",
    "releaseYear": 2020,
    "rating": "PG-13",
    "duration": "90 min",
    "description": "As her father nears the end of his life filmmaker Kirsten Johnson stages his death in inventive and comical ways to help them both face the inevitable.",
    "starRating": 5
  },
  {
    "showId": 520,
    "type": "TV Show",
    "title": "I AM A KILLER",
    "director": null,
    "cast": "Swaylee Loughnane, Reece Alexander-Putinas, David Galea, Candie Dominguez, Justin Dickens",
    "country": "United Kingdom",
    "releaseYear": 2020,
    "rating": "TV-MA",
    "duration": "2 Seasons",
    "description": "Death row inmates convicted of capital murder give a firsthand account of their crimes in this documentary series.",
    "starRating": 2
  },
  {
    "showId": 682,
    "type": "TV Show",
    "title": "They've Gotta Have Us",
    "director": "Simon Frederick",
    "cast": "Debbie Allen Harry Belafonte John Boyega Diahann Carroll Ernest R. Dickerson Laurence Fishburne Nelson George Whoopi Goldberg Cuba Gooding Jr. LilRel Howery Barry Jenkins Kasi Lemmons David Oyelowo Robert Townsend Jesse Williams",
    "country": "United Kingdom",
    "releaseYear": 2018,
    "rating": "TV-MA",
    "duration": "1 Season",
    "description": "Powered by candid recollections from esteemed African-American entertainers this docuseries traces the history of black cinema.",
    "starRating": 2
  },
  {
    "showId": 867,
    "type": "Movie",
    "title": "Small Town Crime",
    "director": "Eshom Nelms Ian Nelms",
    "cast": "John Hawkes Anthony Anderson Octavia Spencer Robert Forster Clifton Collins Jr. Jeremy Ratchford James Lafferty Michael Vartan Daniel Sunjata Don Harvey Stefanie Scott Caity Lotz Dale Dickey",
    "country": "United States",
    "releaseYear": 2017,
    "rating": "R",
    "duration": "92 min",
    "description": "When a disgraced ex-cop discovers a dying woman he's compelled to track down her killer — an act of self-redemption that takes him down a dark path.",
    "starRating": 2
  },
  {
    "showId": 932,
    "type": "Movie",
    "title": "Fun with Dick & Jane",
    "director": "Dean Parisot",
    "cast": "Jim Carrey Téa Leoni Alec Baldwin Richard Jenkins Angie Harmon John Michael Higgins Richard Burgi Carlos Jacott Aaron Michael Drozin Gloria Garayua",
    "country": "United States",
    "releaseYear": 2005,
    "rating": "PG-13",
    "duration": "91 min",
    "description": "After losing their high-paying corporate jobs an upwardly mobile couple turns to robbing banks to maintain their standard of living.",
    "starRating": 2
  },
  {
    "showId": 1060,
    "type": "TV Show",
    "title": "House of Cards",
    "director": null,
    "cast": "Kevin Spacey Robin Wright Kate Mara Corey Stoll Sakina Jaffrey Kristen Connolly Constance Zimmer Sebastian Arcelus Nathan Darrow Sandrine Holt Michel Gill Elizabeth Norment Mahershala Ali Reg E. Cathey Molly Parker Derek Cecil Elizabeth Marvel Kim Dickens Lars Mikkelsen Michael Kelly Joel Kinnaman Campbell Scott Patricia Clarkson Neve Campbell",
    "country": "United States",
    "releaseYear": 2018,
    "rating": "TV-MA",
    "duration": "6 Seasons",
    "description": "A ruthless politician will stop at nothing to conquer Washington D.C. in this Emmy and Golden Globe-winning political drama.",
    "starRating": 2
  },
  {
    "showId": 1082,
    "type": "TV Show",
    "title": "Nicky Ricky Dicky & Dawn",
    "director": null,
    "cast": "Brian Stepanek Allison Munn Aidan Gallagher Casey Simpson Mace Coronel Lizzy Greene",
    "country": "United States",
    "releaseYear": 2018,
    "rating": "TV-G",
    "duration": "4 Seasons",
    "description": "Just because they're quadruplets that doesn't mean these 10-year-olds always get along. But for all the bickering they're loyal to the last.",
    "starRating": 2
  },
  {
    "showId": 1096,
    "type": "TV Show",
    "title": "This Is a Robbery: The World's Biggest Art Heist",
    "director": null,
    "cast": "Shelley Murphy, Anne Hawley, Dick Ellis, Martin Leppo, Tron Brekke",
    "country": null,
    "releaseYear": 2021,
    "rating": "TV-MA",
    "duration": "1 Season",
    "description": "In 1990 two men dressed as cops con their way into a Boston museum and steal a fortune in art. Take a deep dive into this daring and notorious crime.",
    "starRating": 2
  },
  {
    "showId": 1325,
    "type": "Movie",
    "title": "Middle of Nowhere",
    "director": "Ava DuVernay",
    "cast": "Emayatzy Corinealdi David Oyelowo Omari Hardwick Lorraine Toussaint Edwina Findley Dickerson Sharon Lawrence Nehemiah Sutton Troy Curvey III Maya Gilbert Dondre T. Whitfield",
    "country": "United States",
    "releaseYear": 2012,
    "rating": "R",
    "duration": "102 min",
    "description": "After her husband is sent to prison for eight years medical student Ruby shelves her studies to focus on her partner's welfare as he serves his time.",
    "starRating": 2
  },
  {
    "showId": 1826,
    "type": "Movie",
    "title": "The Kite",
    "director": "Randa Chahal Sabbag",
    "cast": "Flavia Bechara Maher Bsaibes Randa Asmar Renée Dick Julia Kassar Liliane Nemri Ziad Rahbani Nayef Naji Edmond Haddad Alia Nemry",
    "country": "Lebanon France",
    "releaseYear": 2003,
    "rating": "TV-MA",
    "duration": "76 min",
    "description": "In an occupied village a teen girl is set to wed a stranger. But when she crosses over to meet her betrothed her heart gets entangled at the border.",
    "starRating": 2
  }
];

const topRatedMovies: Movie[] = trendingMovies;

const Home = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (openFaqIndex == null) {
      setOpenFaqIndex(index);
    } else if (openFaqIndex === index) {
      setOpenFaqIndex(null); // close it
    } else {
      setOpenFaqIndex(null); // close the currently open one
      setTimeout(() => {
        setOpenFaqIndex(index); // open the new one after 300ms
      }, 300);
    }
  };


  return (
    <div className="home-container">
      <Header onHomePage={true}/>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">CineNiche</h1>
          <h2 className="hero-subtitle">Cinema Off the Beaten Path</h2>
          <button className="get-started-btn" onClick={() => navigate("/Register")}>
            GET STARTED
          </button>
        </div>
        <img src="/images/chair.png" className="round-image" width="500" />
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-container">
          <div className="info-content">
            <h2 className="info-title">
              Movies don't have to be mainstream to be meaningful.
            </h2>
            <p className="info-text">
              CineNiche is here to help you discover and appreciate films on
              their own merit, not just based on their box office success.
            </p>
            <button className="learn-more-btn">LEARN MORE</button>
          </div>
          <img src="/images/arrow.png" width="500" />
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <div className="section-header">
          <h2 className="section-title">TRENDING NOW</h2>
        </div>
        <div className="movie-grid">
          {trendingMovies.map((movie) => (
            <MovieCard key={movie.showId} movie={movie} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="header-and-image">
          <h2 className="features-title">Reasons to Join</h2>
          <img
            src="/images/filmCamera.png"
            alt="Descriptive Alt Text"
            className="features-image"
          />
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-card-title">Personalized Recommendations</h3>
            <p className="feature-card-text">
              Get hand-picked suggestions based on your unique taste—not what's
              trending. Say goodbye to algorithm-based content.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">
              Learn the Stories Behind the Stories
            </h3>
            <p className="feature-card-text">
              Unlock in-depth insights, director's cuts, and behind-the-scenes
              features to deepen your appreciation of every film.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Leave Reviews & Ratings</h3>
            <p className="feature-card-text">
              Let your voice be heard and help others find their next favorite.
            </p>
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="top-rated-section">
        <div className="section-header">
          <h2 className="section-title">TOP RATED</h2>
        </div>
        <div className="movie-grid">
          {topRatedMovies.map((movie) => (
            <MovieCard key={movie.showId} movie={movie} />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          <div className={`faq-item ${openFaqIndex === 0 ? "active" : ""}`}>
            <div className="faq-question" onClick={() => toggleFaq(0)}>
              <div>
                What makes your movie selection different from other streaming
                services?
              </div>
              <div className="faq-toggle"></div>
            </div>
            <div className="faq-answer">
              <p>
                Unlike mainstream platforms that prioritize blockbusters and
                trending content, CineNiche focuses on curating quality films
                across all genres, eras, and countries. We highlight independent
                productions, festival favorites, and critically acclaimed works
                that might not receive attention on commercial platforms.
              </p>
            </div>
          </div>
          <div className={`faq-item ${openFaqIndex === 1 ? "active" : ""}`}>
            <div className="faq-question" onClick={() => toggleFaq(1)}>
              <div>Is it free to use the site?</div>
              <div className="faq-toggle"></div>
            </div>
            <div className="faq-answer">
              <p>
                Yes, basic browsing and discovery features are completely free.
                We offer a premium tier that provides additional benefits like
                personalized recommendations, exclusive content, and ad-free
                browsing for a small monthly subscription.
              </p>
            </div>
          </div>
          <div className={`faq-item ${openFaqIndex === 2 ? "active" : ""}`}>
            <div className="faq-question" onClick={() => toggleFaq(2)}>
              <div>How do you choose which movies to feature?</div>
              <div className="faq-toggle"></div>
            </div>
            <div className="faq-answer">
              <p>
                Our curation team consists of film critics, historians, and
                passionate cinephiles who select films based on artistic merit,
                cultural significance, and unique storytelling. We also consider
                user ratings and feedback to ensure we're featuring films that
                resonate with our community.
              </p>
            </div>
          </div>
          <div className={`faq-item ${openFaqIndex === 3 ? "active" : ""}`}>
            <div className="faq-question" onClick={() => toggleFaq(3)}>
              <div>Can I suggest a movie to be added?</div>
              <div className="faq-toggle"></div>
            </div>
            <div className="faq-answer">
              <p>
                Absolutely! We welcome suggestions from our community. You can
                submit film recommendations through your profile once you've
                created an account. Our team reviews all suggestions and
                frequently adds user-recommended films to our catalog.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
  
  export default Home;
  