/**
 * WAYAG ARCHIPELAGO - BRAND GUIDELINE & DESIGN SYSTEM
 * Interactive Tabs & Fullscreen Floating Image Lightbox with HD Download
 */

document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------------------------------------------------------- */
  /* 1. TAB NAVIGATION LOGIC                                                    */
  /* -------------------------------------------------------------------------- */
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');

      // Remove active state from all tabs and tab contents
      tabs.forEach((t) => t.classList.remove('active'));
      contents.forEach((c) => c.classList.remove('active'));

      // Activate clicked tab
      this.classList.add('active');

      // Display corresponding tab panel
      const targetContent = document.getElementById('tab-' + target);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      // Smooth scroll adjustment for user experience
      window.scrollTo({
        top: window.scrollY - 1,
        behavior: 'smooth'
      });
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 2. IMAGE PREVIEW LIGHTBOX & DOWNLOAD SYSTEM                                */
  /* -------------------------------------------------------------------------- */
  const modal = document.getElementById('imageLightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const imgWrapper = document.getElementById('lightboxImageWrapper');
  const counterEl = document.getElementById('lightboxCounter');
  const titleEl = document.getElementById('lightboxTitle');
  const captionEl = document.getElementById('lightboxCaption');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');
  const btnZoomIn = document.getElementById('lightboxZoomIn');
  const btnZoomOut = document.getElementById('lightboxZoomOut');
  const btnResetZoom = document.getElementById('lightboxResetZoom');
  const btnDownload = document.getElementById('lightboxDownload');

  if (!modal || !lightboxImg) return;

  // Collect all previewable images on the page
  const pageImages = Array.from(document.querySelectorAll('img')).filter((img) => {
    const src = img.getAttribute('src');
    return src && (src.includes('./assets/') || src.includes('assets/'));
  });

  // Extract metadata for each image
  const galleryItems = pageImages.map((img) => {
    let title = img.getAttribute('alt') || 'Wayag Archipelago Asset';
    let subtitle = '';

    // Extract title from parent card if available
    const parentCard = img.closest('.gallery-card, .element-card, .value-card, section, div');
    if (parentCard) {
      const heading = parentCard.querySelector('h3, h4, h2');
      if (heading && heading.textContent.trim()) {
        title = heading.textContent.trim();
      }
      const desc = parentCard.querySelector('p');
      if (desc && desc.textContent.trim()) {
        subtitle = desc.textContent.trim();
      }
    }

    // Enhance image element appearance
    img.classList.add('previewable-image');
    img.setAttribute('title', 'Klik untuk melihat ukuran penuh / Download');

    return {
      src: img.src,
      rawSrc: img.getAttribute('src'),
      alt: img.getAttribute('alt') || title,
      title: title,
      caption: subtitle || title,
      element: img
    };
  });

  let currentIndex = 0;
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  // Helper to update image transform
  function updateTransform() {
    lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    if (zoom > 1) {
      imgWrapper.classList.add('is-zoomed');
    } else {
      imgWrapper.classList.remove('is-zoomed');
      panX = 0;
      panY = 0;
    }
  }

  // Reset Zoom & Pan
  function resetZoom() {
    zoom = 1;
    panX = 0;
    panY = 0;
    updateTransform();
  }

  // Load image by index
  function showImage(index) {
    if (galleryItems.length === 0) return;
    
    // Wrap around index
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const item = galleryItems[currentIndex];
    
    // Set image source & details
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    titleEl.textContent = item.title;
    captionEl.textContent = item.caption || item.alt;
    counterEl.textContent = `${currentIndex + 1} / ${galleryItems.length}`;

    resetZoom();
  }

  let isClosingFromPopstate = false;

  // Open Lightbox
  function openLightbox(index) {
    showImage(index);
    modal.classList.add('active');
    document.body.classList.add('lightbox-open');
    try {
      history.pushState({ lightboxOpen: true }, '');
    } catch (_) {}
  }

  // Close Lightbox
  function closeLightbox() {
    if (!modal.classList.contains('active')) return;
    modal.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    resetZoom();
    if (!isClosingFromPopstate && history.state && history.state.lightboxOpen) {
      try {
        history.back();
      } catch (_) {}
    }
  }

  // Browser / Mobile Back button support
  window.addEventListener('popstate', () => {
    if (modal.classList.contains('active')) {
      isClosingFromPopstate = true;
      closeLightbox();
      isClosingFromPopstate = false;
    }
  });

  // Navigation
  function nextImage() {
    showImage(currentIndex + 1);
  }

  function prevImage() {
    showImage(currentIndex - 1);
  }

  // Zoom Controls
  function zoomIn() {
    if (zoom < 3.5) {
      zoom = Math.min(3.5, Math.round((zoom + 0.3) * 10) / 10);
      updateTransform();
    }
  }

  function zoomOut() {
    if (zoom > 0.6) {
      zoom = Math.max(0.6, Math.round((zoom - 0.3) * 10) / 10);
      updateTransform();
    }
  }

  // Download High-Res Image
  function downloadCurrent() {
    const item = galleryItems[currentIndex];
    if (!item) return;

    const fileUrl = item.src;
    const originalFileName = decodeURIComponent(item.rawSrc.split('/').pop().split('?')[0]);

    // Show feedback on download button
    const prevText = btnDownload.innerHTML;
    btnDownload.innerHTML = `
      <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      <span class="hidden sm:inline">Downloading...</span>
    `;

    fetch(fileUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.blob();
      })
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = originalFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch(() => {
        // Fallback standard download trigger
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = originalFileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .finally(() => {
        setTimeout(() => {
          btnDownload.innerHTML = prevText;
        }, 500);
      });
  }

  // Attach click events to all page images and parent cards
  galleryItems.forEach((item, index) => {
    item.element.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(index);
    });

    // Also enable clicking the card container
    const card = item.element.closest('.gallery-card, .element-card');
    if (card) {
      card.addEventListener('click', (e) => {
        // Don't override other button links or direct image clicks inside card
        if (e.target.closest('a') || e.target.closest('button') || e.target.tagName.toLowerCase() === 'img') {
          return;
        }
        openLightbox(index);
      });
    }
  });

  // Modal Button Click Handlers
  btnClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
  btnZoomIn.addEventListener('click', (e) => { e.stopPropagation(); zoomIn(); });
  btnZoomOut.addEventListener('click', (e) => { e.stopPropagation(); zoomOut(); });
  if (btnResetZoom) btnResetZoom.addEventListener('click', (e) => { e.stopPropagation(); resetZoom(); });
  btnDownload.addEventListener('click', (e) => { e.stopPropagation(); downloadCurrent(); });

  // Close when clicking empty backdrop / space outside image & controls
  modal.addEventListener('click', (e) => {
    // If clicked on an interactive button, toolbar, or caption box, don't close
    if (e.target.closest('button') || e.target.closest('#lightboxToolbar') || e.target.closest('#lightboxCaptionBox')) {
      return;
    }
    // If clicked directly on the image, don't close (user might be inspecting or dragging)
    if (e.target === lightboxImg || e.target.closest('#lightboxImage')) {
      return;
    }
    // Any other click on empty dark space closes the modal!
    closeLightbox();
  });

  // Mouse Drag Panning (when zoomed)
  imgWrapper.addEventListener('mousedown', (e) => {
    if (zoom <= 1) return;
    isDragging = true;
    dragStartX = e.clientX - panX;
    dragStartY = e.clientY - panY;
    imgWrapper.classList.add('is-dragging');
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panX = e.clientX - dragStartX;
    panY = e.clientY - dragStartY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      imgWrapper.classList.remove('is-dragging');
    }
  });

  // Mouse Wheel Zoom
  modal.addEventListener('wheel', (e) => {
    if (!modal.classList.contains('active')) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }, { passive: false });

  // Touch Swipe & Drag for Mobile
  imgWrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      if (zoom > 1) {
        isDragging = true;
        dragStartX = touchStartX - panX;
        dragStartY = touchStartY - panY;
      }
    }
  }, { passive: true });

  imgWrapper.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging && zoom > 1) {
      panX = e.touches[0].clientX - dragStartX;
      panY = e.touches[0].clientY - dragStartY;
      updateTransform();
    }
  }, { passive: true });

  imgWrapper.addEventListener('touchend', (e) => {
    if (isDragging) {
      isDragging = false;
    } else if (zoom === 1 && e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;
      // Horizontal swipe threshold (50px)
      if (Math.abs(diffX) > 50 && Math.abs(diffY) < 60) {
        if (diffX < 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
    }
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case '+':
      case '=':
        zoomIn();
        break;
      case '-':
      case '_':
        zoomOut();
        break;
      case '0':
        resetZoom();
        break;
      case 'd':
      case 'D':
        downloadCurrent();
        break;
    }
  });
});


