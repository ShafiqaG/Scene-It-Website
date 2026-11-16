const stage = document.querySelector("#credits-stage");
const roll = document.querySelector("#credits-roll");
const controls = document.querySelector("#credits-controls");
const toggleButton = document.querySelector("#credits-toggle");
const listButton = document.querySelector("#credits-list");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function startRoll(){
  stage.classList.add("is-rolling");
  controls.hidden = false;

  const startY = stage.clientHeight;
  const endY = Math.min(0, stage.clientHeight - roll.offsetHeight);
  const duration = Math.max(20, (startY - endY) / 50);

  const tween = gsap.fromTo(roll, { y: startY }, { y: endY, duration: duration, ease: "none" });

  toggleButton.addEventListener("click", function(){
    const nowPaused = !tween.paused();
    tween.paused(nowPaused);
    toggleButton.textContent = nowPaused ? "Play" : "Pause";
  });

  listButton.addEventListener("click", function(){
    tween.kill();
    gsap.set(roll, { clearProps: "transform" });
    stage.classList.remove("is-rolling");
    controls.hidden = true;
  });
}

if (stage && roll && controls && typeof gsap !== "undefined" && !reduceMotion){
  document.fonts.ready.then(startRoll);
}