function getSavedTheme(){
  try{
    return localStorage.getItem("theme");
  } catch (error) {
    return null;
  }
}

function applyTheme(theme){
  document.documentElement.setAttribute("datatheme", theme);
}

applyTheme(getSavedTheme()||"light");

function setupThemeToggle(){
  const button = document.getElementById("themetoggle");
  if (!button) return;

  function updateLabel(){
    const isDark = document.documentElement.getAttribute("datatheme") === "dark";
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  updateLabel();

  button.addEventListener("click", function(){
    const isDark = document.documentElement.getAttribute("datatheme") === "dark";
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
    {name: "Home", href:"home.html", icon:"home.png"},
    {name: "Movies", href:"movies.html", icon:"movies.png"},
    {name: "Shows", href:"shows.html", icon:"tv shows.png"},
    {name:"Directors", href:"directors.html", icon:"directors.png"},
    {name:"Credits", href:"credits.html", icon:"credits.png"}
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

    }
 
    function buildFooter(){
        const footer = document.getElementById("footer")
        if(!footer) return; 
        
        footer.innerHTML = '<p>Created using the TMDB API.</p>';
    }

    function setupHeaderScroll(){
        const header = document.getElementById("header")
        if (!header) return;

        window.addEventListener("scroll", function(){
            header.classList.toggle("compact", window.scrollY > 40);
        })
    }

    buildHeader(
          header.innerHTML = `
    <a class="logo" href="home.html">
      <img src="../assets/website logo.png" alt="Scene It! home">
    </a>

    <nav class="main-nav" aria-label="Main navigation">
      <ul>${links}</ul>
    </nav>

    <form class="search" role="search" action="search.html" method="get">
      <label for="search-input" class="visually-hidden">Search movies, shows and directors</label>
      <input id="search-input" type="search" name="query" placeholder="Search" required>
      <button type="submit" aria-label="Search">
        <img src="../assets/search.png" alt="">
      </button>
    </form>

    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to dark mode">
      <img src="../assets/theme.png" alt="">
    </button>`


    );
    buildHeader();
    buildFooter();
    setupHeaderScroll();
    setupThemeToggle();


const loopVideo = document.getElementById("loop");
const playVideo = document.getElementById("playvideo");
const playButton = document. getElementById("playbutton");

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