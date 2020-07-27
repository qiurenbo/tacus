"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fast = /*#__PURE__*/function () {
  function fast() {
    _classCallCheck(this, fast);

    _defineProperty(this, "mediaRecorder", void 0);

    _defineProperty(this, "chunks", []);

    _defineProperty(this, "audioURL", null);

    _defineProperty(this, "media", null);
  }

  _createClass(fast, [{
    key: "open",
    value: function open() {
      var _this = this;

      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          audio: true
        }).then(function (stream) {
          _this.mediaRecorder = new MediaRecorder(stream);

          _this.mediaRecorder.ondataavailable = function (e) {
            console.log("push data");

            _this.chunks.push(e.data);
          };

          _this.mediaRecorder.onstop = function (e) {
            console.log(_this.chunks);
            var blob = new Blob(_this.chunks, {
              type: "audio/ogg; codecs=opus"
            });
            _this.chunks = [];
            _this.audioURL = window.URL.createObjectURL(blob);
          };
        }, function () {
          throw new Error("Authorization failed.");
        });
      } else {
        throw new Error("Browser not support.");
      }
    }
  }, {
    key: "start",
    value: function start() {
      if (this.mediaRecorder && this.mediaRecorder.state !== "recording") {
        console.log("start");
        this.mediaRecorder.start();
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
        console.log("stop");
        this.mediaRecorder.stop();
      }
    }
  }, {
    key: "getAudio",
    value: function getAudio() {
      return this.audioURL;
    }
  }]);

  return fast;
}();