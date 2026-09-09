/**
 * Trip Simulation - Companion Bridge
 * Injected into Trip Simulation web pages (localhost, 127.0.0.1, mcaesarar.site)
 * Bridges extension messages to window events so React context receives them immediately.
 */

(function () {
  'use strict';

  console.log('[TripSim Bridge] Content script bridge loaded on Trip Simulation web page');

  // Listen for messages relayed from background.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === 'TRIP_SIMULATION_IMPORT_FLIGHT') {
      console.log('[TripSim Bridge] Forwarding flight payload to web app:', message.payload);

      // 1. Post to window for window.addEventListener('message')
      window.postMessage({
        type: 'TRIP_SIMULATION_IMPORT_FLIGHT',
        payload: message.payload
      }, '*');

      // 2. Dispatch custom DOM event as guarantee
      window.dispatchEvent(
        new CustomEvent('trip-sim-flight-import', {
          detail: message.payload
        })
      );

      // 3. Write to webpage localStorage so React hook/listener picks it up
      try {
        localStorage.setItem('trip_sim_imported_flight', JSON.stringify({
          ...message.payload,
          _bridge_ts: Date.now()
        }));
      } catch (e) {}

      sendResponse({ status: 'delivered_to_web_page' });
    }
  });

  // Check if there's any recent unsynced flight saved in extension storage upon page load
  try {
    chrome.storage.local.get(['last_imported_flight'], (res) => {
      if (res && res.last_imported_flight) {
        const payload = res.last_imported_flight;
        // If imported in last 2 minutes
        if (payload.timestamp && (Date.now() - payload.timestamp < 120000)) {
          window.postMessage({
            type: 'TRIP_SIMULATION_IMPORT_FLIGHT',
            payload: payload
          }, '*');
        }
      }
    });
  } catch (e) {}
})();

