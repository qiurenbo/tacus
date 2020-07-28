const btn = document.getElementById("play");
const audio = document.getElementById("audio");
const recorder = new fast();

recorder.open();

btn.addEventListener("click", function () {
  switch (btn.innerHTML) {
    case "Recording":
      btn.innerHTML = "Start";
      recorder.stop((url) => {
        audio.src = url;
        console.log(audio);
        console.log(url);
      });

      break;

    case "Start":
      btn.innerHTML = "Recording";
      recorder.start();
      break;
  }
});
