gsap.registerPlugin(ScrollTrigger);

function makeSearchCard(item){

  const card = document.createElement("a");
  card.className = "moviecard";

  if (item.media_type === "movie" || item.media_type === "tv"){
    card.href = `profiles.html?type=${item.media_type}&id=${item.id}`;
  } else {
    card.href = `directors.html?id=${item.id}`;
  }

  const imagePath = item.media_type === "person"
    ? item.profile_path
    : item.poster_path;

  const img = document.createElement("img");
  img.src = imagePath
    ? imageUrl(imagePath, "w342")
    : "../assets/movienotfoundthumbnail.svg";

  const titleText = item.title || item.name || "Untitled";

  img.alt = `Image for ${titleText}`;

  const title = document.createElement("h3");
  title.textContent = titleText;

  card.append(img, title);

  return card;
}

function animateSearchResults(){

  const cards = document.querySelectorAll("#search-results .filmframe");

  gsap.from(cards,{
    opacity: 0,
    y: 35,
    duration: 0.7,
    stagger: 0.12,
    ease: "power2.out",
    scrollTrigger:{
      trigger: "#search-results",
      start: "top 85%",
      toggleActions: "play none none none"
    }
  });

}

async function searchContent(){

  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");

  const heading = document.querySelector("#search-query");
  const results = document.querySelector("#search-results");

  if (!heading || !results) return;

  if (!query || !query.trim()){
    heading.textContent = "Please enter something to search for.";
    return;
  }

  heading.textContent = `Results for "${query}"`;

  results.textContent = "Searching...";

  try {
    const data = await tmdbFetch("/search/multi",{
      query: query.trim(),
      include_adult: false
    });

    console.log("TMDB results:", data.results.length);
    console.log("Total results:", data.total_results);
    console.log("Total pages:", data.total_pages);

    results.innerHTML = "";

    const filteredResults = data.results.filter(item =>
      ["movie", "tv", "person"].includes(item.media_type)
    );

   if (filteredResults.length === 0){
  results.innerHTML = `
    <div class="search-empty">
      <p>No results found.</p>
      <img src="../assets/error state dark mode.png" alt="Unavailable showing">
      <h3>Uh oh, this showing is currently unavailable.</h3>
    </div>
  `;
  return;
}


filteredResults.forEach(item =>{

  const frame = document.createElement("div");
  frame.className = "filmframe";

  const card = makeSearchCard(item);

  frame.appendChild(card);
  results.appendChild(frame);

});

animateSearchResults();

  } catch (error){
    console.error("Search error:", error);
    results.textContent = "Something went wrong. Please try again.";
  }
}

searchContent();
