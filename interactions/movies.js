const movieCategories =[
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
  
function makeMovieCard(movie){
  const card = document.createElement("article");
  card.className = "moviecard";

  const img = document.createElement("img");
  img.src = movie.poster_path
    ? imageUrl(movie.poster_path, "w342")
    : "../assets/error state dark mode.png";

  img.alt = `Poster for ${movie.title}`;

  const title = document.createElement("h3");
  title.textContent = movie.title;

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

function displayMovies(movies){
  const container = document.querySelector("#moviecontainer");

  container.innerHTML = "";

  movies.forEach(movie =>{
    container.append(makeMovieCard(movie));
  });
}
  fetchMovies(movieCategories[0]);
