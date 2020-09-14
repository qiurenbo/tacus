(function () {
  "use strict";

  // Tacus constructor
  var Tacus = function () {
    var self = this;

    self._options = {
      sampleRate: 16000,
      bufferSize: 4096,
    };

    /******** Shared Variables  *******/
    self._ctx = null;
    self._pause = false;
    self._stream = null;

    /******** Record Related Variables  *******/
    self._PCM32fSamplesNoFlat = [];
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
    self._pause = true;
    self._flatPCM32fSamples();
    self._convertPCM32f2PCM16i();

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

    console.log(self._PCM16iSamples);
    context.decodeAudioData(self._PCM16iSamples.buffer, (buffer) => {
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

  /**** Convert Related Utils ******/
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
      var sample = self._PCM32fSamplesNoFlat[i];
      self._PCM32fSamples.set(sample, sample.length);
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

        processNode.onaudioprocess = (e) => {
          if (self._pause) return;

          console.log(e.inputBuffer.getChannelData(0));
          // We only concern single channel
          self._PCM32fSamplesNoFlat.push(e.inputBuffer.getChannelData(0));
        };

        /**
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
  /**** Convert Related Utils End ******/

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
