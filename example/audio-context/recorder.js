const startAndStopBtn = document.getElementById("start-stop");
const pauseAndResumeBtn = document.getElementById("pause-resume");
const downloadBtn = document.getElementById("download");
const recognitionBtn = document.getElementById("recognition");
const audio = document.getElementById("audio");

const recorder = new fast({
  method: "AudioContext",
  mimeType: "audio/wav",
  bufferLen: 4096,
  sampleRate: 16000,
});

let blob;
let binary;
recorder.open();

startAndStopBtn.addEventListener("click", function () {
  const state = startAndStopBtn.innerHTML;
  switch (state) {
    case "Stop":
      startAndStopBtn.innerHTML = "Start";
      recorder.stop();
      pauseAndResumeBtn.disabled = true;
      recognitionBtn.disabled = false;
      downloadBtn.disabled = false;

      recorder.export("wav", true, async (_blob) => {
        blob = _blob;
        audio.src = URL.createObjectURL(blob);
        const buffer = await blob.arrayBuffer();
      });

      break;

    case "Start":
      startAndStopBtn.innerHTML = "Stop";
      recorder.clear();
      recorder.start();
      pauseAndResumeBtn.disabled = false;
      recognitionBtn.disabled = true;
      downloadBtn.disabled = true;

      audio.src = "";

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

recognitionBtn.addEventListener("click", function () {
  recorder.export("wav", false, async (binary) => {
    const config = {
      method: "post",
      url:
        "http://localhost/server_api?cuid=1&token=24.98691dc2ee74c80370abd955dd6ec8b7.2592000.1598593468.282335-21668671",
      headers: {
        "Content-Type": " audio/wav;rate=16000",
      },
      data: binary,
    };

    axios(config)
      .then(function (response) {
        document.getElementById("output").innerHTML = JSON.stringify(
          response.data
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});

downloadBtn.addEventListener("click", function () {
  const downloadEl = document.createElement("a");
  downloadEl.style = "display: none";
  downloadEl.innerHTML = "download";
  downloadEl.download = "audio.wav";
  downloadEl.href = URL.createObjectURL(blob);
  document.body.appendChild(downloadEl);
  downloadEl.click();
  document.body.removeChild(downloadEl);
  downloadBtn.disabled = true;
});
