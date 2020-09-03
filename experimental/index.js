(function () {
  "use strict";

  Tacus.prototype = {
    init: function () {},
    start: function () {},
    stop: function () {},
    pause: function () {},
    resume: function () {},
  };

  Memo.prototype = {
    init: function () {},
    start: function () {},
    stop: function () {},
    pause: function () {},
    resume: function () {},
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
