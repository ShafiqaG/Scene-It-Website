const movieCategories =[
  {title: "Popular",  endpoint: "/movie/popular", params: {} },
  {title: "Trending", endpoint: "/trending/movie/week", params: {} },
  {title: "Action", endpoint: "/discover/movie", params: {with_genres: 28, sort_by: "popularity.desc"}},
  {title: "Adventure", endpoint: "/discover/movie", params: {with_genres: 12, sort_by: "popularity.desc"}},
  {title: "Animation", endpoint: "/discover/movie", params: {with_genres: 16, sort_by: "popularity.desc"}},
  {title: "Comedy", endpoint: "/discover/movie", params: {with_genres: 35, sort_by: "popularity.desc"}},
  {title: "Crime", endpoint: "/discover/movie", params: {with_genres: 80, sort_by: "popularity.desc"}},
  {title: "Documentary", endpoint: "/discover/movie", params: {with_genres: 99, sort_by: "popularity.desc"}},
  {title: "Drama", endpoint: "/discover/movie", params: {with_genres: 18, sort_by: "popularity.desc"}},
  {title: "Fantasy", endpoint: "/discover/movie", params: {with_genres: 14, sort_by: "popularity.desc"}},
  {title: "Horror", endpoint: "/discover/movie", params: {with_genres: 27, sort_by: "popularity.desc"}},
  {title: "Mystery", endpoint: "/discover/movie", params: {with_genres: 9648, sort_by: "popularity.desc"}},
  {title: "Romance", endpoint: "/discover/movie", params: {with_genres: 10749, sort_by: "popularity.desc"}},
  {title: "Sci-fi", endpoint: "/discover/movie", params: {with_genres: 878, sort_by: "popularity.desc"}},
  {title: "Thriller", endpoint: "/discover/movie", params: {with_genres: 53, sort_by: "popularity.desc"}},
];

gsap.registerPlugin(ScrollTrigger);

function introAnimation(){
  const topStrip = document.querySelector(".strip-top");
  const bottomStrip = document.querySelector(".strip-bottom");

  gsap.set(topStrip, { x: "-100vw" });
  gsap.set(bottomStrip, { x: "100vw" });

  gsap.to([topStrip, bottomStrip], {
    x: 0,
    duration: 10,
    ease: "power3.out"
  });

}

function introScrollAnimation() {
  const topStrip = document.querySelector(".strip-top");
  const bottomStrip = document.querySelector(".strip-bottom");

  gsap.to(topStrip,{
    x: "100vw",
    scrollTrigger:{
      trigger: ".movie-show-page-intro",
      start: "top top",
      end: "bottom top",
      scrub: 1
    }
  });

  gsap.to(bottomStrip,{
    x: "-100vw",
    scrollTrigger:{
      trigger: ".movie-show-page-intro",
      start: "top top",
      end: "bottom top",
      scrub: 1
    }
  });
}

introAnimation();
introScrollAnimation();

  
function animateFilmstrip(filmstrip, index){

  const fromRight = index % 2 === 0;

  const heading = filmstrip
  .closest(".category")
  .querySelector(".category-title");

  gsap.fromTo(filmstrip,
    {
      x: fromRight ? "100vw" : "-100vw",
      opacity: 0,
      scale:0.45
    },
    {
      x: 0,
      opacity: 1,
      scale:1,
      duration: 3,
      ease: "power3.out",

      scrollTrigger:{
        trigger: filmstrip,
        start: "top 85%",
        end: "top 45%",
        scrub: 2.5
      }
    }
  );

   gsap.fromTo(heading,
    {
      x: fromRight ? "-100vw" : "100vw",
      opacity: 0
    },
    {
      x: 0,
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: filmstrip,
        start: "top 85%",
        end: "top 45%",
        scrub: 1
      }
    }
  );
}

function makeMovieCard(movie){
  const card = document.createElement("a");
  card.className = "moviecard";
  card.href = `profiles.html?type=movie&id=${movie.id}`;

  const img = document.createElement("img");
  img.src = movie.poster_path
    ? imageUrl(movie.poster_path, "w342")
    : "../assets/movienotfoundthumbnail.svg";

  img.alt = `Poster for ${movie.title}`;

  const title = document.createElement("h3");
  title.textContent = movie.title;

  card.append(img, title);

  return card;
}

function createRow(category){
  const section = document.createElement("section");
  section.className = "category";

  const heading = document.createElement("h2");
  heading.className = "category-title";
  heading.textContent = category.title;

  const wrap = document.createElement("div");
  wrap.className = "rowwrap";

  const filmstrip = document.createElement("div");
  filmstrip.className = "filmstrip";

  const grid = document.createElement("div");
  grid.className = "moviegrid";

  filmstrip.append(grid);

  wrap.append(makeArrow("previous", grid), filmstrip, makeArrow("next", grid));
  section.append(heading, wrap);
  document.querySelector("#rows").append(section);

  return grid;
}

function displayMovies(movies, container){
  container.innerHTML = "";

  movies.forEach(movie => {
   const frame = document.createElement("div");
    frame.className = "filmframe";

    const card = makeMovieCard(movie);

    frame.appendChild(card);
    container.appendChild(frame);
  });
}

async function fetchMovies(category){
  const row = createRow(category);

  async function load(){
    row.innerHTML = "";
    row.append(makeStateBox("loading", "Loading movies..."));

    try {
      const data = await tmdbFetch(category.endpoint, category.params);

      if (data.results.length === 0){
        row.innerHTML = "";
        row.append(makeStateBox("empty", "No movies found in this category yet."));
        return;
      }

      displayMovies(data.results, row);

      const filmstrip = row.parentElement;
      const index = [...document.querySelectorAll(".category")].indexOf(
        row.closest(".category")
      );

      animateFilmstrip(filmstrip, index);
    } catch (error){
      console.error("Error fetching movies:", error);
      row.innerHTML = "";
      row.append(makeStateBox("error", "We couldn't load these movies.", load));
    }
  }

  load();
}

movieCategories.forEach(fetchMovies);