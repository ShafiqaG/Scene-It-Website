console.log("profiles.js loaded");
const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const id = params.get("id");

function makeElement(tag, className, text){
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function makeSlides(data){
  const slides =[];
  const videos = data.videos ? data.videos.results :[];
  const trailer = videos.find(function (video){
    return video.site === "YouTube" && video.type === "Trailer";
  });
  if (trailer) slides.push({ kind: "trailer", key: trailer.key});

  const backdrops = data.images ? data.images.backdrops :[];
  backdrops.slice(0, 6).forEach(function (image){
    slides.push({ kind: "image", path: image.file_path});
  });

  const fallback = data.backdrop_path || data.poster_path;
  if (slides.length === 0 && fallback){
    slides.push({ kind: "image", path: fallback });
  }

  return slides;
}

function makeSlide(slide, name){
  const item = makeElement("div", "profile-slide");

  if (slide.kind === "trailer"){
    const frame = document.createElement("iframe"); //getting the trailer for the movie/show
    frame.src = `https://www.youtube-nocookie.com/embed/${slide.key}?rel=0`;
    frame.title = "Trailer for " + name;
    frame.allowFullscreen = true;
    item.append(frame);
  } else{
    const img = document.createElement("img");
    img.src = imageUrl(slide.path, "w1280");
    img.alt = "Image from " + name;
    img.loading = "lazy";
    item.append(img);
  }

  return item;
}

function makeCarousel(slides, name){
  const wrap = makeElement("div", "rowwrap profile-carousel");
  const track = makeElement("div", "profile-slides");

  slides.forEach(function (slide){
    track.append(makeSlide(slide, name));
  });

  wrap.append(track);

  if (slides.length > 1){
    wrap.prepend(makeArrow("previous", track, "slides"));
    wrap.append(makeArrow("next", track, "slides"));
  }

  return wrap;
}

function showProfile(data){
  const container = document.querySelector("#profile");
  container.innerHTML = "";

  const name = data.title || data.name;
  document.title = name + " | Scene It!";

  const heading = makeElement("h1", "", name);
  container.append(heading);

  const slides = makeSlides(data);
  if (slides.length > 0) container.append(makeCarousel(slides, name));
  container.append(makeDetails(data));
 
}

function makeDetail(label, value){
  const item = makeElement("p", "profile-detail");
  const labelElement = makeElement("strong", "", label + ": ");
  item.append(labelElement, value);
  return item;
}

function getDirector(data){
  if (type === "tv"){
    const creators = data.created_by ? data.created_by : [];
    const names = creators.map(function (person) { return person.name; });
    return names.length > 0 ? names.join(", ") : "Not listed";
  }

  const crew = data.credits ? data.credits.crew : [];
  const director = crew.find(function (person) { return person.job === "Director"; });
  return director ? director.name : "Not listed";
}

function makeDetails(data){
  const wrap = makeElement("section", "profile-details");

  const date = data.release_date || data.first_air_date;
  const dateText = date ? new Date(date).toLocaleDateString("en-GB") : "Not available";

  const rating = data.vote_average ? data.vote_average.toFixed(1) + "/10" : "Not rated yet";

  const genreNames = data.genres ? data.genres.map(function (genre) { return genre.name; }) : [];
  const genreText = genreNames.length > 0 ? genreNames.join(", ") : "Not listed";

  const directorLabel = type === "tv" ? "Created by" : "Director";

  wrap.append(
    makeDetail(directorLabel, getDirector(data)),
    makeDetail("Rating", rating),
    makeDetail("Genre", genreText),
    makeDetail("Release date", dateText)
  );

  const summary = makeElement("div", "profile-summary");
  summary.append(
    makeElement("h2", "", "Plot summary"),
    makeElement("p", "", data.overview ? data.overview : "No plot summary available yet.")
  );

  const section = makeElement("div", "profile-info");
  section.append(wrap, summary);
  return section;
}

async function loadProfile(){
  const container = document.querySelector("#profile");
  const typeIsValid = ["movie", "tv"].includes(type);
  const idIsValid = Number(id)>0;

  if (!typeIsValid){
    container.textContent = "Error. Unable to determine show or movie";
    return;
  }

  if (!idIsValid){
    container.textContent = "Error. Movie or show could not be found.";
    return;
  }

   try{
    const data = await tmdbFetch(`/${type}/${id}`,{ 
        append_to_response: "credits,videos,images", 
        include_image_language:"en,null", 
        include_video_language:"en,null"});

  

    showProfile(data); 
  } catch (error){
    console.error(error);
    container.textContent = "Error. Sorry, we couldn't load this right now.";
  }
}

loadProfile();