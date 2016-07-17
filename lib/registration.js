(function() {
  if ('serviceWorker' in navigator) {
    function sendMessage(message) {
      return new Promise(function(resolve, reject) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function(event) {
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data);
          }
        };

        navigator.serviceWorker.controller.postMessage(
          message,
          [messageChannel.port2]
        );
      });
    }

    navigator.serviceWorker.register('/sw.js', { scope: '{{rootURL}}' })
      .catch(function(error) {
        console.log('Service Worker registration failed with: ' + error);
      })
      .then(function(registration) {
        return navigator.serviceWorker.ready
          .then(function() {
            return sendMessage({ command: 'verify', appVersion: '{{APP_VERSION}}'});
          })
          .then(function() {
            console.log('Service Worker registration succeeded. Scope is ' + registration.scope);
          })
          .catch(function() {
            return registration.unregister();
          });
      });
  }
})();
