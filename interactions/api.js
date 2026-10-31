const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p";

async function tmdbFetch(path, params = {}){
  if (typeof TMDB_API_KEY === "undefined"){
    throw new Error("API key missing: check interactions/config.js");
  }

  const query = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "en-US",
    ...params
  });

  const response = await fetch(`${TMDB_BASE}${path}?${query}`);

  if (!response.ok){
    throw new Error(`TMDB request failed with status ${response.status}`);
  }

  return response.json();
}

function imageUrl(path, size){
  return path ? `${TMDB_IMG}/${size}${path}` : null;
}