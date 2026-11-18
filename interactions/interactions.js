function getSavedTheme(){
  try{
    return localStorage.getItem("theme");
  } catch (error) {
    return null;
  }
}

function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
}

applyTheme(getSavedTheme()||"light");

function setupThemeToggle(){
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  function updateLabel(){
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  updateLabel();

  button.addEventListener("click", function(){
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (error){
    }
    updateLabel();
  });
}


const navLinks = [
    {name: "Home", href:"home.html", icon:"home.svg"},
    {name: "Movies", href:"movies.html", icon:"movies.svg"},
    {name: "Shows", href:"shows.html", icon:"tv shows.svg"},
    {name:"Directors", href:"directors.html", icon:"directors.svg"},
    {name:"Credits", href:"credits.html", icon:"credits.svg"}
    ];

    function buildHeader(){
        const header = document.getElementById ("header")
        if (!header) return;

        const currentPage = window.location.pathname.split("/").pop();

        const links = navLinks.map(function(link){
            const current = link.href === currentPage? 'aria-current = "page"': "";
            return `<li><a href = "${link.href}"${current}>
            <img src = "../assets/${link.icon}" alt = "image of logo">
            <span>${link.name}</span>
            </a></li>`;
            }).join("");


     header.innerHTML = `
    <a class="logo" href="home.html">
      <img src="../assets/SCENE IT!.svg" alt="Scene It! home">
    </a>

    <nav class="main-nav" aria-label="Main navigation">
      <ul>${links}</ul>
    </nav>

    <form class="search" role="search" action="search.html" method="get">
      <label for="search-input" class="visually-hidden">Search movies, shows and directors</label>
      <input id="search-input" type="search" name="query" placeholder="Search" required>
      <button type="submit" aria-label="Search">
        <img src="../assets/search icon.svg" alt="search icon">
      </button>
    </form>

    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to dark mode">
      <img src="../assets/theme.svg" alt="menu icon">
    </button>`;


} 
 const introPath = window.location.pathname.includes("/pages/")
  ? "../index.html": "index.html";

    function buildFooter(){
        const footer = document.getElementById("footer")
        if(!footer) return; 
        
        footer.innerHTML = `
    <div class="footer-bottom">
    <img src="../assets/The_Movie_Database_Logo_0.svg" alt="The Movie Database (TMDB)"class="tmdb-logo">
      <p>Movie and television data provided by TMDB.</p>
      <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      <a href="${introPath}">Back to Intro</a>
      <p>© 2026 Scene It!</p>
      <h3 class="footer-end">THE END.</h3>
    </div>
  `;
    }

    function setupHeaderScroll(){
        const header = document.getElementById("header")
        if (!header) return;

        window.addEventListener("scroll", function(){
            header.classList.toggle("compact", window.scrollY > 40);
        });

        
    }

    buildHeader();
    buildFooter();
    setupHeaderScroll();
    setupThemeToggle();

function createPageNavigation(previousPage, nextPage){
  const nav = document.createElement("nav");
  nav.className = "page-navigation";
  nav.setAttribute("aria-label", "Page navigation");

  function makeArrow(direction, href, tooltipText){
    const arrow = document.createElement("a");
    arrow.className = `page-arrow ${direction}`;
    arrow.href = href;
    const image = document.createElement("img");
    image.src = "../assets/arrow.svg";
    image.alt = "image of arrow";
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.textContent = tooltipText;
    arrow.append(image, tooltip);
    return arrow;
  }
  if (previousPage){
    nav.append(
      makeArrow("previous", previousPage.href, previousPage.label)
    );
  }
  if (nextPage){
    nav.append(
      makeArrow("next", nextPage.href, nextPage.label)
    );
  }
  return nav;
}

const pageNavigation ={
  "home.html":{
    previous: null,
    next: { href: "movies.html", label: "Movies" }
  },

  "movies.html":{
    previous: { href: "home.html", label: "Home" },
    next: { href: "shows.html", label: "Shows" }
  },

  "shows.html":{
    previous: { href: "movies.html", label: "Movies" },
    next: { href: "directors.html", label: "Directors" }
  },

  "directors.html":{
    previous: { href: "shows.html", label: "Shows" },
    next: { href: "credits.html", label: "Credits" }
  },

  "credits.html":{
    previous: { href: "directors.html", label: "Directors" },
    next: null
  }
};

const currentPage = window.location.pathname.split("/").pop();
const navigation = pageNavigation[currentPage];

const main = document.querySelector("main");

console.log("Current page:", currentPage);
console.log("Navigation:", navigation);

if (main && navigation) {
  const pageArrows = createPageNavigation(
    navigation.previous,
    navigation.next
  );

  main.append(pageArrows);

  console.log("Navigation added to main:", main.contains(pageArrows));
  console.log("Arrows added:", pageArrows);
}

async function loadCategoryCarousel(cardName, endpoint, titleField){
  const media = document.querySelector(
    `[data-card="${cardName}"] .card-media`
  );
  if (!media) return;
  try{
    const data = await tmdbFetch(endpoint);
    const images = data.results
      .filter(item => item.poster_path)
      .slice(0, 6)
      .map(item => ({
        src: imageUrl(item.poster_path, "w500"),
        title: item[titleField]
      }));
    startImageCarousel(media, images, `${cardName} poster`);
  } catch(error){
    console.error(`Could not load ${cardName} carousel:`, error);
  }
}

async function loadDirectorCarousel(){
  const media = document.querySelector(
    '[data-card="directors"] .card-media'
  );
  if (!media) return;
  try{
    const people = await Promise.all(
      featuredDirectorIDS.slice(0, 6).map(id =>
        tmdbFetch("/person/" + id)
      )
    );
    const images = people
      .filter(person => person.profile_path)
      .map(person => ({
        src: imageUrl(person.profile_path, "h632"),
        title: person.name
      }));
    startImageCarousel(media, images, "Director portrait");
  } catch(error){
    console.error("Could not load directors carousel:", error);
  }
}

function startImageCarousel(media, images, altText){
  if (!media || images.length === 0) return;
  media.style.position = "relative";
  media.style.overflow = "hidden";

  let currentIndex = 0;

  function createImage(image){
    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.title || altText;
    img.style.position = "absolute";
    img.style.inset = "0";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    return img;
  }

  let currentImage = createImage(images[0]);
  media.replaceChildren(currentImage);
  if (images.length === 1) return;

  setInterval(() =>{
    const nextIndex = (currentIndex + 1) % images.length;
    const nextImage = createImage(images[nextIndex]);
    nextImage.style.transform = "translateX(100%)";
    media.appendChild(nextImage);

    gsap.timeline({
      onComplete: () =>{
        currentImage.remove();
        currentImage = nextImage;
        currentIndex = nextIndex;
      }
    })
    .to(currentImage,{
      x: "-100%",
      duration: 0.8,
      ease: "power2.inOut"
    }, 0)
    .to(nextImage,{
      x: "0%",
      duration: 0.8,
      ease: "power2.inOut"
    }, 0);
  },5000);
}

loadCategoryCarousel("movies", "/trending/movie/week", "title");
loadCategoryCarousel("shows", "/trending/tv/week", "name");
loadDirectorCarousel();

function makeArrow(direction, grid, what = "movies"){
  const button = document.createElement("button");
  button.type = "button";
  button.className = "arrow arrow-" + direction;
  const icon = document.createElement("img");
  icon.src = "../assets/arrow.svg";
  button.append(icon);

  const label = direction === "next" ? "Next" : "Previous";
  button.setAttribute("aria-label", label + " " + what);
  const tooltip = document.createElement("span");
  tooltip.className = "tooltip";
  tooltip.textContent = label;
  button.append(tooltip);

  button.addEventListener("click", function(){
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const amount = grid.clientWidth * (direction === "next" ? 1 : -1);
    grid.scrollBy({ left: amount, behavior: reduce ? "auto" : "smooth" });
  });

  return button;
}

function makeElement(tag, className, text){
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

const STATE_MESSAGES = {
  loading: "Loading...",
  empty: "Nothing to show here yet.",
  error: "Whoopsie! Something went wrong. Please try again."
};

const STATE_IMAGES = {
  loading: null,
  empty: { light: "somethingwentwrong.svg", dark: "somethingwentwrong.svg" },
  error: { light: "somethingwentwrong.svg", dark: "somethingwentwrong.svg" }
};

function addLoadingAnimation(box){
  const holder = makeElement("div", "loading-animation");
  holder.setAttribute("aria-hidden", "true");
  box.append(holder);

  if (typeof lottie === "undefined") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  box.lottie = lottie.loadAnimation({
    container: holder,
    renderer: "svg",
    loop: true,
    autoplay: !reduceMotion,
    path: "../assets/movieloading.json"
  });
}

function pageEntrance(){

  const main = document.querySelector("main");

  if (!main) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) return;

  window.addEventListener("load", () =>{

    gsap.from(main,{
      opacity: 0,
      y: 12,
      duration: 0.8,
      ease: "power2.out"
    });

  }, { once: true });

}

function makeStateBox(kind, message, onRetry){
  const box = makeElement("div", "state-box state-" + kind);
  box.setAttribute("role", kind === "error" ? "alert" : "status");
  if (kind === "loading") addLoadingAnimation(box);

  const images = STATE_IMAGES[kind];
  if (images){
    ["light", "dark"].forEach(function (mode){
      const img = document.createElement("img");
      img.src = "../assets/somethingwentwrong.svg" + images[mode];
      img.alt = "Image of spilled popcorn";
      img.className = "state-img" + mode;
      box.append(img);
    });
  }

  box.append(makeElement("p", "state-message", message));

  if (onRetry){
    const retry = makeElement("button", "card-button", "Try again");
    retry.type = "button";
    retry.addEventListener("click", onRetry);
    box.append(retry);
  }

  return box;
}
const loopVideo = document.getElementById("loop");
const playVideo = document.getElementById("playvideo");
const playButton = document. getElementById("playbutton");

function introButtonAnimation(){

  if (!playButton || typeof gsap === "undefined") return;

  gsap.to(playButton,{
    scale: 1.13,
    duration: 0.9,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".playbutton img",{
    filter: "drop-shadow(0 0 22px rgba(255, 190, 120, 0.9))",
    duration: 0.9,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}
introButtonAnimation();

function animateFilmstrips(){
  const leftTrack = document.querySelector(
    ".filmstrip-left .filmstrip-track"
  );
  const rightTrack = document.querySelector(
    ".filmstrip-right .filmstrip-track"
  );
  console.log("Left:", leftTrack);
  console.log("Right:", rightTrack);
  console.log("GSAP:", typeof gsap);

  if (!leftTrack || !rightTrack || typeof gsap === "undefined") return;
  gsap.to(leftTrack, {
  xPercent: -50,
  duration: 18,
  ease: "none",
  repeat: -1
});
gsap.to(rightTrack, {
  xPercent: -50,
  duration: 18,
  ease: "none",
  repeat: -1
});
}

animateFilmstrips();

if(playButton){
    playButton.addEventListener("click", async () =>{
    playButton.disabled = true;

    loopVideo.pause();

    playButton.classList.add("hidden");

    playVideo.style.display = "block";

    playVideo.currentTime = 0;

    try{
       await playVideo.play();

       playVideo. addEventListener("ended", () =>{
        window.location.href = "pages/home.html";
       },
    {once:true});

    } catch(error){
        console.error("Something went wrong, this video cannot play")
    }
});

}

pageEntrance();