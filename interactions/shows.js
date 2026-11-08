const movieCategories =[
  {title: "Popular",  endpoint: "/tv/popular", params: {} },
  {title: "Trending", endpoint: "/trending/tv/week", params: {} },
  {title: "Action & Adventure", endpoint: "/discover/tv", params: {with_genres: 10759, sort_by: "popularity.desc"}},
  {title: "Comedy", endpoint: "/discover/tv", params: {with_genres: 35, sort_by: "popularity.desc"}},
  {title: "Kids", endpoint: "/discover/tv", params: {with_genres: 10762, sort_by: "popularity.desc"}},
  {title: "News", endpoint: "/discover/tv", params: {with_genres: 10763, sort_by: "popularity.desc"}},
  {title: "Reality", endpoint: "/discover/tv", params: {with_genres: 10764, sort_by: "popularity.desc"}},
  {title: "Sci-fi & Fantasy", endpoint: "/discover/tv", params: {with_genres: 10765, sort_by: "popularity.desc"}},
  {title: "Soap", endpoint: "/discover/tv", params: {with_genres: 10766, sort_by: "popularity.desc"}},
  {title: "Talk", endpoint: "/discover/tv", params: {with_genres: 10767, sort_by: "popularity.desc"}},
  {title: "War & Polotics", endpoint: "/discover/tv", params: {with_genres: 10768, sort_by: "popularity.desc"}},
 
];
  
function makeMovieCard(movie){
  const card = document.createElement("article");
  card.className = "moviecard";

  const img = document.createElement("img");
  img.src = movie.poster_path
    ? imageUrl(movie.poster_path, "w342")
    : "../assets/error state dark mode.png";

  img.alt = `Poster for ${movie.name}`;

  const title = document.createElement("h3");
  title.textContent = movie.name;

  card.append(img, title);

  return card;
}

async function fetchMovies(category){
  try {
    const data = await tmdbFetch(
      category.endpoint,
      category.params
    );

    displayMovies(data.results);

  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

  
  function makeArrow(direction, grid){
  const button = document.createElement("button");
  button.type = "button";
  button.className = "arrow arrow-" + direction;
  const icon = document.createElement("img");
  icon.src = "../assets/arrow.svg";
  button.append(icon);

  const label = direction === "next" ? "Next" : "Previous";
  button.setAttribute("aria-label", label + " movies");
  button.title = label;

  button.addEventListener("click", function(){
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const amount = grid.clientWidth * (direction === "next" ? 1 : -1);
    grid.scrollBy({ left: amount, behavior: reduce ? "auto" : "smooth" });
  });

  return button;
}

function createRow(category){
  const section = document.createElement("section");
  section.className = "category";

  const heading = document.createElement("h2");
  heading.textContent = category.title;

  const wrap = document.createElement("div");
  wrap.className = "rowwrap";

  const grid = document.createElement("div");
  grid.className = "moviegrid";

  wrap.append(makeArrow("previous", grid), grid, makeArrow("next", grid));
  section.append(heading, wrap);
  document.querySelector("#rows").append(section);

  return grid;
}

function displayMovies(movies, container){
  container.innerHTML = "";

  movies.forEach(movie => {
    container.append(makeMovieCard(movie));
  });
}

async function fetchMovies(category){
  const row = createRow(category);

  try {
    const data = await tmdbFetch(category.endpoint, category.params);
    displayMovies(data.results, row);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

movieCategories.forEach(fetchMovies);