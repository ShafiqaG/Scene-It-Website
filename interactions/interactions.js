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

        setTimeout(()=>{
            window.location.href = "index.html";
        }, 1500);
    } catch(error){
        console.error("Something went wrog, this video cannot play")
    }
});