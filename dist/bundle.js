(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fast"] = factory();
	else
		root["fast"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _media_recorder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./media-recorder */ \"./src/media-recorder.js\");\n\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\nvar fast = /*#__PURE__*/function () {\n  function fast(config) {\n    _classCallCheck(this, fast);\n\n    _defineProperty(this, \"recorder\", void 0);\n\n    _defineProperty(this, \"config\", {\n      method: \"MediaRecorder\"\n    });\n\n    this.config = config || this.config;\n  }\n\n  _createClass(fast, [{\n    key: \"open\",\n    value: function open() {\n      var _this = this;\n\n      if (navigator.mediaDevices.getUserMedia) {\n        navigator.mediaDevices.getUserMedia({\n          audio: true\n        }).then(function (stream) {\n          if (_this.config.method === \"MediaRecorder\") {\n            _this.recorder = new _media_recorder__WEBPACK_IMPORTED_MODULE_0__[\"_MediaRecorder\"](stream, _this.config.mimeType);\n          } else if (_this.config.method === \"AudioContext\") {} else {\n            throw new Error(\"Unsupported method.\");\n          }\n        }, function () {\n          throw new Error(\"Authorization failed.\");\n        });\n      } else {\n        throw new Error(\"Unsupported Browser.\");\n      }\n    }\n  }, {\n    key: \"start\",\n    value: function start() {\n      this.recorder.start();\n    }\n  }, {\n    key: \"stop\",\n    value: function stop(cb) {\n      this.recorder.stop(cb);\n    }\n  }, {\n    key: \"pause\",\n    value: function pause() {\n      this.recorder.pause();\n    }\n  }, {\n    key: \"resume\",\n    value: function resume(cb) {\n      this.recorder.resume(cb);\n    }\n  }]);\n\n  return fast;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (fast);\n\n//# sourceURL=webpack://fast/./src/index.js?");

/***/ }),

/***/ "./src/media-recorder.js":
/*!*******************************!*\
  !*** ./src/media-recorder.js ***!
  \*******************************/
/*! exports provided: _MediaRecorder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"_MediaRecorder\", function() { return _MediaRecorder; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar _MediaRecorder = /*#__PURE__*/function () {\n  _createClass(_MediaRecorder, [{\n    key: \"state\",\n    get: function get() {\n      return this.mediaRecorder.state;\n    }\n  }]);\n\n  function _MediaRecorder(stream, mimeType) {\n    _classCallCheck(this, _MediaRecorder);\n\n    _defineProperty(this, \"mediaRecorder\", null);\n\n    _defineProperty(this, \"chunks\", []);\n\n    _defineProperty(this, \"mimeType\", {\n      type: \"audio/ogg; codecs=opus\"\n    });\n\n    _defineProperty(this, \"cb\", null);\n\n    this.mediaRecorder = new MediaRecorder(stream, this.mimeType);\n    this.mimeType = mimeType || this.mimeType;\n    this.addListeners();\n  }\n\n  _createClass(_MediaRecorder, [{\n    key: \"addListeners\",\n    value: function addListeners() {\n      var _this = this;\n\n      this.mediaRecorder.ondataavailable = function (e) {\n        _this.chunks.push(e.data);\n\n        console.log(e.data);\n      };\n\n      this.mediaRecorder.onstop = function (e) {\n        var blob = new Blob(_this.chunks, _this.mimeType);\n        _this.chunks = [];\n        var url = window.URL.createObjectURL(blob);\n\n        _this.cb(url);\n      };\n    }\n  }, {\n    key: \"start\",\n    value: function start() {\n      if (this.state === \"inactive\") {\n        this.mediaRecorder.start();\n      }\n    }\n  }, {\n    key: \"pause\",\n    value: function pause() {\n      if (this.state === \"recording\") {\n        mediaRecorder.pause(); // recording paused\n      }\n    }\n  }, {\n    key: \"resume\",\n    value: function resume() {\n      if (this.state === \"paused\") {\n        this.cb = cb;\n        this.mediaRecorder.resume();\n      }\n    }\n  }, {\n    key: \"stop\",\n    value: function stop(cb) {\n      if (this.state === \"recording\" || this.state === \"paused\") {\n        this.cb = cb;\n        this.mediaRecorder.stop();\n      }\n    }\n  }]);\n\n  return _MediaRecorder;\n}();\n\n//# sourceURL=webpack://fast/./src/media-recorder.js?");

/***/ })

/******/ })["default"];
});