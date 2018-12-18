module.exports = {
  /* For now: default to cdn. */
  load: function load() {
    var srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/js/monaco';
    var callback = arguments[1];

    if (window.monaco) {
      callback();
      return;
    }
    var config = {
      paths: {
        vs: '/js/monaco/vs'
      }
    };
    var loaderUrl = config.paths.vs + '/loader.js';
    var onGotAmdLoader = function onGotAmdLoader() {

      if (window.LOADER_PENDING) {
        window.require.config(config);
      }

      // Load monaco
      window.require(['vs/editor/editor.main'], function () {
        callback();
      });

      // Call the delayed callbacks when AMD loader has been loaded
      if (window.LOADER_PENDING) {
        window.LOADER_PENDING = false;
        var loaderCallbacks = window.LOADER_CALLBACKS;
        if (loaderCallbacks && loaderCallbacks.length) {
          var currentCallback = loaderCallbacks.shift();
          while (currentCallback) {
            currentCallback.fn.call(currentCallback.window);
            currentCallback = loaderCallbacks.shift();
          }
        }
      }
    };

    // Load AMD loader if necessary
    if (window.LOADER_PENDING) {
      // We need to avoid loading multiple loader.js when there are multiple editors loading concurrently
      //  delay to call callbacks except the first one
      window.LOADER_CALLBACKS = window.LOADER_CALLBACKS || [];
      window.LOADER_CALLBACKS.push({
        window: this,
        fn: onGotAmdLoader
      });
    } else {
      if (typeof window.require === 'undefined') {
        var loaderScript = window.document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = loaderUrl;
        loaderScript.addEventListener('load', onGotAmdLoader);
        window.document.body.appendChild(loaderScript);
        window.LOADER_PENDING = true;
      } else {
        onGotAmdLoader();
      }
    }
  }
};