const btn = document.getElementById("play");
const audio = document.getElementById("audio");
recorder = new fast();
recorder.open();
btn.addEventListener("click", function () {
  switch (btn.innerHTML) {
    case "Recording":
      btn.innerHTML = "Start";
      recorder.stop();
      audio.url = recorder.getAudio();
      console.log(audio.url);
      break;

    case "Start":
      btn.innerHTML = "Recording";
      recorder.start();
      break;
  }
});
