(function () {
  "use strict";

  // Tacus constructor
  var Tacus = function () {
    var self = this;

    self._options = {
      sampleRate: 16000,
      bufferSize: 4096,
    };

    self._ctx = null;
    self._pause = false;
    self._stream = null;

    self._PCM32fSamplesNoFlat = [];
    self._PCM16iDataView = null;
    self._PCM32fSamples = null;
    self._PCM16iSamples = null;

    // audio player
    if (typeof arguments[0] === "string") {
      self._assignOptions(arguments[1]);
    }

    // recorder player
    if (typeof arguments[0] !== "string") {
      self._assignOptions(arguments[0]);
    }
  };

  Tacus.prototype._assignOptions = function (options) {
    if (options) {
      Object.assign(self._options, options);
    }
  };

  Tacus.prototype.start = function () {
    var self = this;
    if (!self._ctx) this._setupAudioContext();
  };

  Tacus.prototype.stop = function () {
    var self = this;

    if (self._pause) {
      return;
    }

    self._pause = true;
    self._flatPCM32fSamples();
    self._convertPCM32f2PCM16i();
    self._convertPCM16i2WAV();
    // https://stackoverflow.com/questions/26670677/remove-red-icon-after-recording-has-stopped/26671315
    if (self._stream && self._stream.getTracks) {
      self._stream.getTracks().forEach((track) => track.stop());
      self._stream = null;
    }
  };

  Tacus.prototype.play = function () {
    var self = this;
    if (!self._pause) {
      self.stop();
    }
    var context = new AudioContext();

    context.decodeAudioData(self._PCM16iDataView.buffer, (buffer) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
      var sourceNode = context.createBufferSource();
      sourceNode.buffer = buffer;
      sourceNode.connect(context.destination);
      sourceNode.start(0);

      sourceNode.onended = () => {
        sourceNode.disconnect(context.destination);
      };
    });
  };

  /**
   * export wav array buffer
   */
  Tacus.prototype.exportWAV = function () {
    var self = this;

    self.stop();

    return self._PCM16iDataView.buffer;
  };

  Tacus.prototype.download = function () {
    var downloadEl = document.createElement("a");
    downloadEl.style = "display: none";
    downloadEl.innerHTML = "download";
    downloadEl.download = "audio.wav";

    downloadEl.href = URL.createObjectURL(
      new Blob([this.exportWAV()], { type: "audio/wav" })
    );

    document.body.appendChild(downloadEl);
    downloadEl.click();
    document.body.removeChild(downloadEl);
  };

  Tacus.prototype._convertPCM16i2WAV = function () {
    var self = this;

    var bitDepth = 16;
    var byteDepth = 2;
    var byteRate = self._options.sampleRate * byteDepth;
    var numberOfBytes = self._PCM16iSamples.length * byteDepth;

    // 44 bytes wav header
    var buffer = new ArrayBuffer(44 + numberOfBytes);

    DataView.prototype.setString = function (offset, string) {
      var self = this;
      for (var i = 0; i < string.length; i++) {
        self.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    DataView.prototype.setData = function (offset, PCM16iSamples) {
      var self = this;
      for (var i = 0; i < PCM16iSamples.length; i++, offset += 2) {
        self.setInt16(offset, PCM16iSamples[i], true);
      }
    };

    var dataview = new DataView(buffer);

    // RIFF identifier
    dataview.setString(0, "RIFF");
    // RIFF chunk length
    dataview.setUint32(4, 36 + numberOfBytes, true);
    // RIFF type
    dataview.setString(8, "WAVE");
    // format chunk identifier
    dataview.setString(12, "fmt ");
    // format chunk length
    dataview.setUint32(16, 16, true);
    // sample format (raw)
    dataview.setUint16(20, 1, true);
    // channel count
    dataview.setUint16(22, 1, true);
    // sample rate
    dataview.setUint32(24, self._options.sampleRate, true);
    // byte rate (sample rate * block align)
    dataview.setUint32(28, byteRate, true);
    // block align (bytes per sample)
    dataview.setUint16(32, byteDepth, true);
    // bits per sample
    dataview.setUint16(34, bitDepth, true);
    // data chunk identifier
    dataview.setString(36, "data");
    // data chunk length
    dataview.setUint32(40, numberOfBytes, true);

    dataview.setData(44, self._PCM16iSamples);

    self._PCM16iDataView = dataview;
  };

  Tacus.prototype._convertPCM32f2PCM16i = function () {
    var self = this;

    self._PCM16iSamples = new Int16Array(self._PCM32fSamples.length);

    for (var i = 0; i < self._PCM32fSamples.length; i++) {
      var s = Math.max(-1, Math.min(1, self._PCM32fSamples[i]));
      s = s < 0 ? s * 0x8000 : s * 0x7fff;
      self._PCM16iSamples[i] = s;
    }
  };

  Tacus.prototype._flatPCM32fSamples = function () {
    var self = this;
    self._PCM32fSamples = new Float32Array(
      self._PCM32fSamplesNoFlat.length * self._options.bufferSize
    );

    for (let i = 0; i < self._PCM32fSamplesNoFlat.length; i++) {
      self._PCM32fSamples.set(
        self._PCM32fSamplesNoFlat[i],
        self._options.bufferSize * i
      );
    }
  };

  Tacus.prototype._setupAudioContext = function () {
    var self = this;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        self._ctx = new AudioContext({
          sampleRate: self._options.sampleRate,
        });

        var audioInputNode = self._ctx.createMediaStreamSource(stream);

        var processNode = audioInputNode.context.createScriptProcessor(
          self._options.bufferSize
        );

        var count = 0;
        processNode.onaudioprocess = (e) => {
          if (self._pause) return;

          // We only concern single channel
          self._PCM32fSamplesNoFlat.push(
            new Float32Array(e.inputBuffer.getChannelData(0))
          );
        };

        /*
         * Input stream connect to processor processNode.
         * Processor processNode connect to destination.
         * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/connect
         */

        audioInputNode.connect(processNode);

        // Output to destination
        processNode.connect(self._ctx.destination);
      });
    }
  };

  // Add support for CommonJS libraries.
  if (typeof exports !== "undefined") {
    exports.Tacus = Tacus;
  }

  // Add to global in Node.js.
  if (typeof global !== "undefined") {
    global.Tacus = Tacus;
  } else if (typeof window !== "undefined") {
    // Define globally in case AMD is not available or unused.
    window.Tacus = Tacus;
  }
})();
