const startAndStopBtn = document.getElementById("start-stop");
const pauseAndResumeBtn = document.getElementById("pause-resume");
const downloadBtn = document.getElementById("download");
const audio = document.getElementById("audio");
const recorder = new fast({
  method: "AudioContext",
  mimeType: "audio/wav",
  bufferLen: 4096,
  sampleRate: 16000,
});

let blob;
recorder.open();

startAndStopBtn.addEventListener("click", function () {
  const state = startAndStopBtn.innerHTML;
  switch (state) {
    case "Stop":
      startAndStopBtn.innerHTML = "Start";
      recorder.stop();
      pauseAndResumeBtn.disabled = true;
      downloadBtn.disabled = false;
      recorder.export("wav", (_blob) => {
        blob = _blob;
        audio.src = URL.createObjectURL(blob);
      });

      break;

    case "Start":
      startAndStopBtn.innerHTML = "Stop";
      recorder.start();
      pauseAndResumeBtn.disabled = false;
      downloadBtn.disabled = true;
      audio.src = "";
      recorder.clear();
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
  const downloadEl = document.createElement("a");
  downloadEl.style = "display: none";
  downloadEl.innerHTML = "download";
  downloadEl.download = "audio.wav";
  downloadEl.href = URL.createObjectURL(blob);
  document.body.appendChild(downloadEl);
  downloadEl.click();
  document.body.removeChild(downloadEl);
  downloadBtn.disabled = true;
}
