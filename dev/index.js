const startAndStopBtn = document.getElementById("start-stop");
const pauseAndResumeBtn = document.getElementById("pause-resume");
const downloadBtn = document.getElementById("download");

let config = {
  method: "AudioContext",
  bufferSize: 4096,
  sampleRate: 16000,
  bitDepth: 16,
};

let recorder = new Psittacus();

let blob;
let binary;

function onStart() {
  const state = startAndStopBtn.innerHTML;
  switch (state) {
    case "Stop":
      startAndStopBtn.innerHTML = "Start";
      recorder.stop();
      pauseAndResumeBtn.disabled = true;
      downloadBtn.disabled = false;
      console.log("here");
      recorder.export("wav", async (_blob) => {
        blob = _blob;
        console.log(blob);
      });

      break;

    case "Start":
      recorder.setConfig(config);
      startAndStopBtn.innerHTML = "Stop";
      recorder.record();
      pauseAndResumeBtn.disabled = false;
      downloadBtn.disabled = true;

      break;
  }
}

function onPause() {
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
}

function onDownload() {
  const downloadEl = document.createElement("a");
  downloadEl.style = "display: none";
  downloadEl.innerHTML = "download";
  downloadEl.download = "audio.wav";
  console.log(blob);
  downloadEl.href = URL.createObjectURL(blob);
  document.body.appendChild(downloadEl);
  downloadEl.click();
  document.body.removeChild(downloadEl);
  downloadBtn.disabled = true;
}

function onBitDepthChange(event) {
  config.bitDepth = event.target.value;
  debugDIV.innerHTML = JSON.stringify(config);
}
function onSampleRateChange(event) {
  config.sampleRate = event.target.value;
  debugDIV.innerHTML = JSON.stringify(config);
}

function onBufferSizeChange(event) {
  config.bufferSize = event.target.value;
  debugDIV.innerHTML = JSON.stringify(config);
}
