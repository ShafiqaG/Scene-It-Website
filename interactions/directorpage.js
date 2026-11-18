gsap.set(".clapperboard",{
  opacity: 0,
  x: (index) => index === 0 ? -100 : 100
});

gsap.set(".clapper-closed",{
  opacity: 0
});

const directorIntro = gsap.timeline();

directorIntro
  .to(".clapperboard",{
    opacity: 1,
    x: 0,
    duration: 0.8,
    ease: "power3.out"
  })
  .to(".clapper-open",{
    opacity: 0,
    duration: 0.1
  })
  .to(".clapper-closed",{
    opacity: 1,
    duration: 0.1
  }, "<")
  .to(".clapperboard",{
    y: -8,
    duration: 0.12,
    yoyo: true,
    repeat: 1,
    ease: "power1.inOut"
  })

  .to(".clapperboard",{
  opacity: 0,
  duration: 0.6,
  delay: 1,
  ease: "power2.out"
});

const DIRECTORSPERBATCH = 6;
let nextDirector = 0;

const list = document.querySelector("#director-list");
const loadMoreButton = document.querySelector("#load-more");

function makeDirectorCard(person){
  const card = makeElement("article", "director-card");
  const inner = makeElement("div", "flip-inner");

  const front = makeElement("button", "face front");
  front.type = "button";
  front.setAttribute("aria-label", person.name + ". Show biography");

  const photo = document.createElement("img");
  photo.src = person.profile_path
    ? imageUrl(person.profile_path, "h632")
    : "../assets/error state dark mode.png";
  photo.alt = "";
  photo.loading = "lazy";

  front.append(photo, makeElement("span", "director-name", person.name));

  const back = makeElement("div", "face back");

  const facts = [];
  if (person.birthday){
    facts.push("Born " + new Date(person.birthday).toLocaleDateString("en-GB"));
  }
  if (person.place_of_birth) facts.push(person.place_of_birth);

  const bioText = person.biography ? person.biography : "No biography available yet.";
  const bio = makeElement("p", "bio is-clamped", bioText);

  const readMore = makeElement("button", "card-button", "Read more");
  readMore.type = "button";
  readMore.setAttribute("aria-expanded", "false");
  if (bioText.length < 250) readMore.hidden = true;

  const flipBack = makeElement("button", "card-button flip-back", "Back to photo");
  flipBack.type = "button";

  back.append(makeElement("h2", "", person.name));
  if (facts.length > 0) back.append(makeElement("p", "facts", facts.join(" · ")));
  back.append(bio, readMore, flipBack);

    function collapseBio(){
    bio.classList.add("is-clamped");
    bio.removeAttribute("tabindex");
    readMore.hidden = bioText.length < 250;
    card.style.height = "";

    const row = card.closest(".director-row");
    if (row) row.classList.remove("expanded");
  }

    function setFlipped(flipped, moveFocus = true){
        if (!flipped) collapseBio();
    card.classList.toggle("flipped", flipped);
    front.inert = flipped;
    back.inert = !flipped;
    if (moveFocus) (flipped ? flipBack : front).focus({ preventScroll: true });
  }

  if (window.matchMedia("(hover: hover)").matches){
    card.addEventListener("mouseenter", function (){ setFlipped(true, false); });
    card.addEventListener("mouseleave", function (){
         const row = card.closest(".director-row");
      if (!row.classList.contains("expanded")) setFlipped(false, false);
    });
  }

  back.inert = true;

  front.addEventListener("click", function (){ setFlipped(true); });
  flipBack.addEventListener("click", function (){ setFlipped(false); });
  readMore.addEventListener("click", function (){
  const row = card.closest(".director-row");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  bio.classList.remove("is-clamped");
  bio.tabIndex = 0;
  readMore.hidden = true;
  row.classList.add("expanded");
  flipBack.focus({ preventScroll: true });
  const expandedHeight = back.scrollHeight + 24;
  if (reduce || typeof gsap === "undefined"){
    card.style.height = expandedHeight + "px";
    return;
  }
  gsap.set(bio,{
    opacity: 0,
    y: 12
  });
  gsap.to(card,{
    height: expandedHeight,
    duration: 0.6,
    ease: "power2.out",
    onComplete: function (){
      gsap.to(bio,{
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  });
});

  inner.append(front, back);
  card.append(inner);
  return card;
}

async function loadDirector(id){
  try {
    return await tmdbFetch("/person/" + id, { append_to_response: "movie_credits" });
  } catch (error) {
    console.error("Could not load director", id, error);
    return null;
  }
}

function getDirectedFilms(person){
  const crew = person.movie_credits ? person.movie_credits.crew : [];
  const seen = new Set();

  return crew
    .filter(function (film) {
      if (film.job !== "Director" || !film.release_date) return false;
      if (seen.has(film.id)) return false;
      seen.add(film.id);
      return true;
    })
    .sort(function (a, b){ return b.vote_count - a.vote_count; })
    .slice(0, 8)
    .sort(function (a, b){ return b.release_date.localeCompare(a.release_date); });
}

function makeDirectorRow(person){
  const row = makeElement("section", "director-row");
  row.setAttribute("aria-label", person.name);

  const panel = makeElement("section", "filmography");
  panel.append(makeElement("h3", "", "Films directed"));

  const films = getDirectedFilms(person);

  if (films.length === 0){
    panel.append(makeElement("p", "", "No directed films listed yet."));
  } else {
    const filmList = makeElement("ul", "film-list");

    films.forEach(function (film){
      const item = document.createElement("li");

      const link = makeElement("a", "", film.title);
      link.href = `profiles.html?type=movie&id=${film.id}`;

      const year = makeElement("span", "film-year", " (" + film.release_date.slice(0, 4) + ")");

      item.append(link, year);
      filmList.append(item);
    });

    panel.append(filmList);
  }

  row.append(makeDirectorCard(person), panel);
  return row;
}

async function loadNextDirectors(){
  const ids = featuredDirectorIDS.slice(nextDirector, nextDirector + DIRECTORSPERBATCH);
  nextDirector += DIRECTORSPERBATCH;

  const people = await Promise.all(ids.map(loadDirector));

  people.forEach(function (person){
   if (person) list.append(makeDirectorRow(person));
  });

  if (nextDirector >= featuredDirectorIDS.length){
    loadMoreButton.hidden = true;
  }
}

loadMoreButton.addEventListener("click", loadNextDirectors);
loadNextDirectors();