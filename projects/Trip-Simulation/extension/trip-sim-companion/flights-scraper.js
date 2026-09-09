/**
 * Trip Simulation - Google Flights Companion
 * Content Script: Scrapes flight prices, routes, dates, and trip types directly from Google Flights UI.
 * Supports both Indonesian ("Rp 2.664.300") and English ("IDR 2,803,299" / "Select flight") locales.
 */

(function () {
  'use strict';

  console.log('[TripSim Companion] Extension loaded on Google Flights');

  const PRICE_REGEX = /(?:IDR|Rp|\$|€|£|¥)\s*([0-9]{1,3}(?:[,\.][0-9]{3})+|[0-9]+)/i;
  const TIME_REGEX = /(\d{1,2}[:.]\d{2}(?:\s*[AP]M)?)\s*[–\-—]\s*(\d{1,2}[:.]\d{2}(?:\s*[AP]M)?)/i;

  const KNOWN_AIRLINES = [
    'Indonesia AirAsia', 'AirAsia', 'Lion Air', 'Lion', 'Citilink', 'Garuda Indonesia', 'Garuda',
    'Batik Air', 'Batik', 'Super Air Jet', 'TransNusa', 'Sriwijaya Air', 'Sriwijaya', 'Pelita Air',
    'Wings Air', 'Scoot', 'Jetstar', 'Singapore Airlines', 'Malaysia Airlines', 'Qantas',
    'Cathay Pacific', 'Emirates', 'Qatar Airways', 'ANA', 'Japan Airlines', 'Korean Air',
    'Thai Airways', 'Vietnam Airlines', 'Philippine Airlines'
  ];

  /**
   * Helper: Parse price string with dot or comma thousands separator
   * e.g. "IDR 2,803,299" -> 2803299
   * e.g. "Rp 2.664.300"  -> 2664300
   */
  function parsePrice(str) {
    if (!str) return 0;
    const match = str.match(PRICE_REGEX);
    if (match && match[1]) {
      const clean = match[1].replace(/[,\.]/g, '');
      const num = parseInt(clean, 10);
      return isNaN(num) ? 0 : num;
    }
    const anyDigits = str.replace(/[^\d]/g, '');
    const num = parseInt(anyDigits, 10);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Helper: Format number to display string
   */
  function formatRupiah(amount) {
    return 'IDR ' + (amount || 0).toLocaleString('id-ID');
  }

  /**
   * Helper: Parse Date Strings from English ("Sat, Nov 21", "Nov 21") or Indonesian ("21 Nov")
   */
  function parseDateString(rawStr, defaultYear = new Date().getFullYear()) {
    if (!rawStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawStr.trim())) {
      return rawStr.trim();
    }

    const monthMap = {
      jan: '01', feb: '02', mar: '03', apr: '04', mei: '05', may: '05',
      jun: '06', jul: '07', agu: '08', aug: '08', sep: '09', okt: '10', oct: '10',
      nov: '11', des: '12', dec: '12'
    };

    // Case 1: English format: "Nov 21" or "Sat, Nov 21" or "Nov 21, 2026"
    const enMatch = rawStr.match(/([a-zA-Z]{3,9})\s+(\d{1,2})(?:,?\s+(\d{4}))?/i);
    if (enMatch) {
      const monthStr = enMatch[1].toLowerCase().substring(0, 3);
      if (monthMap[monthStr]) {
        const day = enMatch[2].padStart(2, '0');
        const month = monthMap[monthStr];
        const year = enMatch[3] || defaultYear;
        return `${year}-${month}-${day}`;
      }
    }

    // Case 2: Indonesian format: "21 Nov" or "Sab, 21 Nov"
    const idMatch = rawStr.match(/(\d{1,2})\s+([a-zA-Z]{3,9})(?:\s+(\d{4}))?/i);
    if (idMatch) {
      const monthStr = idMatch[2].toLowerCase().substring(0, 3);
      if (monthMap[monthStr]) {
        const day = idMatch[1].padStart(2, '0');
        const month = monthMap[monthStr];
        const year = idMatch[3] || defaultYear;
        return `${year}-${month}-${day}`;
      }
    }

    return '';
  }

  /**
   * Scrape search parameters from Title, URL, or Header
   */
  function getSearchParams() {
    let origin = '';
    let destination = '';
    let departureDate = '';
    let returnDate = '';
    let isRoundTrip = true;

    // 1. Detect from Document Title: e.g. "Bali to Jakarta | Google Flights"
    const docTitle = document.title || '';
    const titleMatch = docTitle.match(/^([^–\-|]+)\s+(?:to|ke)\s+([^–\-|]+)/i);
    if (titleMatch) {
      origin = titleMatch[1].trim();
      destination = titleMatch[2].trim();
    }

    // 2. Check URL parameters
    try {
      const url = new URL(window.location.href);
      const q = url.searchParams.get('q') || '';
      const qMatch = q.match(/flights\+from\+([^+]+)\+to\+([^+]+)/i);
      if (qMatch) {
        if (!origin) origin = decodeURIComponent(qMatch[1]).replace(/\+/g, ' ');
        if (!destination) destination = decodeURIComponent(qMatch[2]).replace(/\+/g, ' ');
      }
    } catch (e) {}

    // 3. Detect Trip Type from text on page
    const pageText = document.body.innerText || '';
    if (/round trip|pulang[- ]pergi/i.test(pageText)) {
      isRoundTrip = true;
    } else if (/one[- ]way|satu arah/i.test(pageText)) {
      isRoundTrip = false;
    }

    // 4. Scrape Dates from headers or text (e.g. "Return • Sat, Nov 21" or calendar buttons)
    const allDateButtons = Array.from(document.querySelectorAll('button, div[role="button"], input'))
      .map(el => el.getAttribute('aria-label') || el.innerText || el.value || '')
      .filter(t => /\b(?:jan|feb|mar|apr|mei|may|jun|jul|agu|aug|sep|okt|oct|nov|des|dec)\b/i.test(t));

    for (const text of allDateButtons) {
      const parsed = parseDateString(text);
      if (parsed) {
        if (!departureDate) {
          departureDate = parsed;
        } else if (!returnDate && parsed !== departureDate) {
          returnDate = parsed;
          break;
        }
      }
    }

    // Fallback search in entire page for "Sat, Nov 21" pattern
    if (!departureDate || !returnDate) {
      const dateInText = pageText.match(/\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|Sen|Sel|Rab|Kam|Jum|Sab|Min)[a-z]*,?\s+(?:Jan|Feb|Mar|Apr|May|Mei|Jun|Jul|Aug|Agu|Sep|Oct|Okt|Nov|Dec|Des)[a-z]*\s+\d{1,2}\b/gi);
      if (dateInText && dateInText.length > 0) {
        if (!departureDate) departureDate = parseDateString(dateInText[0]);
        if (dateInText.length > 1 && !returnDate) returnDate = parseDateString(dateInText[1]);
      }
    }

    return {
      origin: origin || 'Jakarta',
      destination: destination || 'Bali',
      tripType: isRoundTrip ? 'roundTrip' : 'oneWay',
      departureDate,
      returnDate
    };
  }

  /**
   * Find all flight cards / prices currently visible on Google Flights
   */
  function scanAllFlightsOnPage() {
    const flights = [];

    // Find all elements containing a price pattern
    const candidatePriceElems = Array.from(document.querySelectorAll('span, div, b, strong, p'))
      .filter(el => {
        // Element directly contains price text (exclude parents that contain huge blocks)
        if (el.children.length > 2) return false;
        const txt = el.innerText || el.textContent || '';
        return PRICE_REGEX.test(txt);
      });

    candidatePriceElems.forEach(priceEl => {
      const priceText = priceEl.innerText || priceEl.textContent || '';
      const price = parsePrice(priceText);
      if (price <= 10000) return; // Filter out trivial numbers

      // Find the card container (go up 3 to 7 levels)
      let card = priceEl;
      for (let i = 0; i < 7; i++) {
        if (!card.parentElement) break;
        card = card.parentElement;
        const cardText = card.innerText || '';
        // If this container includes flight times and an airline or "Select flight" / "Pilih penerbangan"
        if (TIME_REGEX.test(cardText) || /Select flight|Pilih penerbangan|Nonstop|AirAsia|Lion|Citilink|Garuda/i.test(cardText)) {
          break;
        }
      }

      const fullText = card.innerText || '';

      // Airline
      let detectedAirline = '';
      for (const airline of KNOWN_AIRLINES) {
        if (new RegExp('\\b' + airline + '\\b', 'i').test(fullText)) {
          detectedAirline = airline;
          break;
        }
      }
      if (!detectedAirline) {
        detectedAirline = 'Maskapai Penerbangan';
      }

      // Times
      const timeMatch = fullText.match(TIME_REGEX);
      const times = timeMatch ? `${timeMatch[1]} - ${timeMatch[2]}` : '';

      // Trip type check
      const isRoundTrip = !/satu arah|one[- ]way/i.test(fullText);

      flights.push({
        price: price,
        formattedPrice: formatRupiah(price),
        airline: detectedAirline,
        times: times,
        isRoundTrip: isRoundTrip,
        cardElement: card,
        priceElement: priceEl
      });
    });

    // Deduplicate by price & airline
    const unique = [];
    const seen = new Set();
    flights.forEach(f => {
      const key = `${f.price}-${f.airline}-${f.times}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(f);
      }
    });

    return unique;
  }

  /**
   * Send the selected flight data to Trip Simulation Web App
   */
  function sendDataToTripSimulation(flightData) {
    const searchParams = getSearchParams();

    const payload = {
      airline: flightData.airline,
      price: flightData.price,
      formattedPrice: flightData.formattedPrice || formatRupiah(flightData.price),
      tripType: flightData.isRoundTrip !== undefined ? (flightData.isRoundTrip ? 'roundTrip' : 'oneWay') : searchParams.tripType,
      departureDate: searchParams.departureDate,
      returnDate: searchParams.returnDate,
      origin: searchParams.origin,
      destination: searchParams.destination,
      times: flightData.times || '',
      timestamp: Date.now()
    };

    console.log('[TripSim Companion] Dispatching payload:', payload);

    // 0. Primary: Send via Chrome Extension runtime to background worker -> web app tabs
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({
          type: 'TRIP_SIMULATION_IMPORT_FLIGHT',
          payload: payload
        }, (res) => {
          console.log('[TripSim Companion] Background relay response:', res);
        });
      }
    } catch (e) {
      console.warn('[TripSim Companion] chrome.runtime.sendMessage error:', e);
    }

    // 1. Send via window.opener (Mini Window Popup if allowed by browser)
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage({
          type: 'TRIP_SIMULATION_IMPORT_FLIGHT',
          payload: payload
        }, '*');
      } catch (e) {
        console.warn('Could not postMessage to opener:', e);
      }
    }

    // 2. Send via BroadcastChannel (Works across all tabs)
    try {
      const channel = new BroadcastChannel('trip_simulation_flight_sync');
      channel.postMessage({
        type: 'TRIP_SIMULATION_IMPORT_FLIGHT',
        payload: payload
      });
      channel.close();
    } catch (e) {}

    // 3. Fallback to localStorage
    try {
      localStorage.setItem('trip_sim_imported_flight', JSON.stringify(payload));
    } catch (e) {}

    // Show visual feedback toast on screen
    showToastNotification(payload);
  }

  /**
   * Floating Toast Notification on Google Flights UI
   */
  function showToastNotification(payload) {
    let toast = document.getElementById('trip-sim-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'trip-sim-toast';
      toast.className = 'trip-sim-toast-container';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="trip-sim-toast-card">
        <div class="trip-sim-toast-icon">✈️</div>
        <div class="trip-sim-toast-content">
          <div class="trip-sim-toast-title">Berhasil Dikirim ke Simulasi Perjalanan!</div>
          <div class="trip-sim-toast-desc">
            <strong>${payload.airline}</strong> — <span class="trip-sim-price-badge">${payload.formattedPrice}</span>
          </div>
          <div class="trip-sim-toast-sub">
            Rute: ${payload.origin} ➔ ${payload.destination} (${payload.tripType === 'roundTrip' ? 'Pulang-Pergi' : 'Satu Arah'})
          </div>
        </div>
      </div>
    `;

    toast.classList.add('trip-sim-toast-show');
    setTimeout(() => {
      toast.classList.remove('trip-sim-toast-show');
    }, 4500);
  }

  /**
   * Inject inline button "[ ✈️ Masukkan ke Simulasi ]" into every detected flight row
   */
  function injectButtonsIntoFlightRows() {
    const flights = scanAllFlightsOnPage();

    flights.forEach(f => {
      if (!f.cardElement) return;

      // Avoid duplicate buttons in this card
      if (f.cardElement.querySelector('.trip-sim-quick-btn')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'trip-sim-quick-btn';
      btn.innerHTML = `<span>✈️ Masukkan ke Simulasi</span>`;
      btn.title = `Kirim ${f.airline} (${f.formattedPrice}) ke Simulasi Perjalanan`;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        sendDataToTripSimulation(f);

        btn.classList.add('trip-sim-btn-success');
        btn.innerHTML = `<span>✓ Terkirim!</span>`;
        setTimeout(() => {
          btn.classList.remove('trip-sim-btn-success');
          btn.innerHTML = `<span>✈️ Masukkan ke Simulasi</span>`;
        }, 2500);
      });

      // Prefer inserting near the price or Select button
      if (f.priceElement && f.priceElement.parentElement) {
        f.priceElement.parentElement.appendChild(btn);
      } else {
        f.cardElement.appendChild(btn);
      }
    });
  }

  /**
   * Create Floating Action Widget at bottom right of Google Flights
   */
  function createFloatingCompanionWidget() {
    if (document.getElementById('trip-sim-floating-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'trip-sim-floating-widget';
    widget.className = 'trip-sim-widget';

    widget.innerHTML = `
      <div class="trip-sim-widget-header">
        <div class="trip-sim-widget-title">
          <span class="trip-sim-pulse-dot"></span>
          <span>✈️ Simulasi Perjalanan</span>
        </div>
        <button type="button" class="trip-sim-minimize-btn" id="trip-sim-toggle-btn" title="Minimize/Maximize">_</button>
      </div>

      <div class="trip-sim-widget-body" id="trip-sim-widget-body">
        <div class="trip-sim-widget-status">
          <span class="trip-sim-badge-mode">Mode Mini Window</span>
          <span class="trip-sim-status-text">Siap Mengambil Data</span>
        </div>

        <div class="trip-sim-detected-box">
          <div class="trip-sim-detected-label">Penerbangan Terbaik Terdeteksi:</div>
          <div class="trip-sim-detected-flight" id="trip-sim-best-airline">Mencari...</div>
          <div class="trip-sim-detected-price" id="trip-sim-best-price">Rp 0</div>
        </div>

        <button type="button" class="trip-sim-main-send-btn" id="trip-sim-send-best-btn">
          🚀 Masukkan ke Simulasi
        </button>
      </div>
    `;

    document.body.appendChild(widget);

    // Minimize toggle
    const toggleBtn = document.getElementById('trip-sim-toggle-btn');
    const body = document.getElementById('trip-sim-widget-body');
    let isMinimized = false;

    toggleBtn.addEventListener('click', () => {
      isMinimized = !isMinimized;
      body.style.display = isMinimized ? 'none' : 'block';
      toggleBtn.innerText = isMinimized ? '▢' : '_';
    });

    // Send best flight button
    const sendBtn = document.getElementById('trip-sim-send-best-btn');
    sendBtn.addEventListener('click', () => {
      const flights = scanAllFlightsOnPage();

      if (flights.length > 0) {
        sendDataToTripSimulation(flights[0]);
      } else {
        // Ultimate fallback: scan document body text for any price
        const pageText = document.body.innerText || '';
        const rawPrice = parsePrice(pageText);
        if (rawPrice > 0) {
          sendDataToTripSimulation({
            airline: 'Penerbangan Terpilih',
            price: rawPrice,
            formattedPrice: formatRupiah(rawPrice)
          });
        } else {
          alert('Tidak dapat mendeteksi harga tiket di layar. Pastikan halaman sudah selesai memuat hasil pencarian penerbangan.');
        }
      }
    });

    // Update preview continuously
    setInterval(updateWidgetPreview, 1000);
  }

  function updateWidgetPreview() {
    const airlineEl = document.getElementById('trip-sim-best-airline');
    const priceEl = document.getElementById('trip-sim-best-price');
    if (!airlineEl || !priceEl) return;

    const flights = scanAllFlightsOnPage();
    if (flights.length > 0) {
      const top = flights[0];
      airlineEl.innerText = `${top.airline} ${top.times ? `(${top.times})` : ''}`;
      priceEl.innerText = top.formattedPrice;
    }
  }

  // Initialize
  function init() {
    createFloatingCompanionWidget();
    injectButtonsIntoFlightRows();

    const observer = new MutationObserver(() => {
      injectButtonsIntoFlightRows();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
