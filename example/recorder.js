const startAndStopBtn = document.getElementById("start-stop");
const pauseAndResumeBtn = document.getElementById("pause-resume");
const downloadBtn = document.getElementById("download");
const audio = document.getElementById("audio");
const recorder = new fast();
let blobUrl;
recorder.open();

startAndStopBtn.addEventListener("click", function () {
  const state = startAndStopBtn.innerHTML;
  switch (state) {
    case "Stop":
      startAndStopBtn.innerHTML = "Start";
      recorder.stop((url) => {
        audio.src = url;
        blobUrl = url;
        console.log(url);
      });
      pauseAndResumeBtn.disabled = true;
      downloadBtn.disabled = false;
      break;

    case "Start":
      startAndStopBtn.innerHTML = "Stop";
      recorder.start();
      pauseAndResumeBtn.disabled = false;
      downloadBtn.disabled = true;
      break;
  }
});

pauseAndResumeBtn.addEventListener("click", function () {
  const state = pauseAndResumeBtn.innerHTML;
  switch (state) {
    case "Resume":
      pauseAndResumeBtn.innerHTML = "Pause";
      recorder.resume();
      break;

    case "Pause":
      pauseAndResumeBtn.innerHTML = "Resume";
      recorder.pause();
      break;
  }
});

function downloadAudio() {
  console.log(blobUrl);
  const downloadEl = document.createElement("a");
  downloadEl.style = "display: none";
  downloadEl.innerHTML = "download";
  downloadEl.download = "audio.webm";
  downloadEl.href = blobUrl;
  document.body.appendChild(downloadEl);
  downloadEl.click();
  document.body.removeChild(downloadEl);
}
