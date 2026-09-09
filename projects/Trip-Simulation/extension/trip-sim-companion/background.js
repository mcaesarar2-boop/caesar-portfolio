/**
 * Trip Simulation - Background Service Worker
 * Relays scraped flight data from Google Flights tabs to all open Trip Simulation tabs.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('[TripSim Service Worker] Installed successfully');
});

// Listen for flight data dispatched from flights-scraper.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'TRIP_SIMULATION_IMPORT_FLIGHT') {
    console.log('[TripSim Service Worker] Received flight payload:', message.payload);

    // Save to extension storage as cache
    chrome.storage.local.set({ last_imported_flight: message.payload });

    // Query all active and inactive tabs running Trip Simulation
    chrome.tabs.query({}, (tabs) => {
      let targetTabs = tabs.filter((t) => {
        return t.url && /(?:localhost|127\.0\.0\.1|mcaesarar\.site)/i.test(t.url);
      });

      console.log(`[TripSim Service Worker] Found ${targetTabs.length} target tabs`);

      targetTabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, message).catch((err) => {
            console.warn(`[TripSim Service Worker] Could not send to tab ${tab.id}:`, err);
          });
        }
      });

      sendResponse({ status: 'broadcasted', tabCount: targetTabs.length });
    });

    return true; // Keep message channel open for async sendResponse
  }
});

