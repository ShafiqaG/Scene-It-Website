const navLinks = [
    {name: "Home", href:"home.html", icon:"home.png"},
    {name: "Movies", href:"movies.html", icon:"movies.png"},
    {name: "Shows", href:"shows.html", icon:"shows.png"},
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

        header.innerHTML = `
        <a class="logo" href="home.html">
        <img src = "../assets/website logo.png" alt = "Scene It! logo">
        </a>

        <nav class="main-nav" aria-label="Main navigation">
            <ul>${links}</ul>
         </nav>`; 

         
    }
 
    function buildFooter(){
        const footer = document.getElementById("footer")
        if(!footer) return; 
        
        footer.innerHTML = '<p>Created using the TMDB API.</p>';
    }

    buildHeader();
    buildFooter();


const loopVideo = document.getElementById("loop");
const playVideo = document.getElementById("playvideo");
const playButton = document. getElementById("playbutton");

playButton.addEventListener("click", async () =>{
    playButton.disabled = true;

    loopVideo.pause();

    playButton.classList.add("hidden");

    playVideo.style.display = "block";

    playVideo.currentTime = 0;

    try{
       await playVideo.play();

       playVideo. addEventListener("ended", () =>{
        window.location.href = "../pages/home.html";
       },
    {once:true});

    } catch(error){
        console.error("Something went wrog, this video cannot play")
    }
});