/* ==========================================================================
   WA Privacy Shield - Showcase Simulator Controller
   Simulates the behavior of the extension's popup and content script in
   an isolated sandbox on the landing page.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Target DOM Containers
  const waBody = document.getElementById('waBody');
  const mockCard = document.querySelector('.mock-popup-container .card');
  const blurRadiusInput = document.getElementById('blurRadius');
  const radiusValueBadge = document.getElementById('radius-value');

  // Input elements map
  const toggles = {
    isActive: document.getElementById('isActive'),
    blurMessages: document.getElementById('blurMessages'),
    blurPreviews: document.getElementById('blurPreviews'),
    blurNames: document.getElementById('blurNames'),
    blurAvatars: document.getElementById('blurAvatars'),
    blurMedia: document.getElementById('blurMedia'),
    blurInput: document.getElementById('blurInput'),
    revealHover: document.getElementById('revealHover')
  };

  /**
   * Reads states from inputs and syncs styling classes on the simulated WhatsApp panel.
   */
  function updateSimulation() {
    const settings = {};
    for (const [key, element] of Object.entries(toggles)) {
      if (element) {
        settings[key] = element.checked;
      }
    }

    // 1. Update Master switch state
    if (settings.isActive) {
      mockCard.classList.remove('disabled');
      waBody.classList.add('wa-privacy-active');
    } else {
      mockCard.classList.add('disabled');
      waBody.classList.remove('wa-privacy-active');
    }

    // 2. Toggle respective class mappings
    const classMappings = {
      'wa-blur-messages': settings.blurMessages,
      'wa-blur-previews': settings.blurPreviews,
      'wa-blur-names': settings.blurNames,
      'wa-blur-avatars': settings.blurAvatars,
      'wa-blur-media': settings.blurMedia,
      'wa-blur-input': settings.blurInput,
      'wa-reveal-hover': settings.revealHover
    };

    for (const [className, isEnabled] of Object.entries(classMappings)) {
      if (isEnabled && settings.isActive) {
        waBody.classList.add(className);
      } else {
        waBody.classList.remove(className);
      }
    }

    // 3. Update Custom blur radius
    const radius = blurRadiusInput ? parseInt(blurRadiusInput.value, 10) : 8;
    waBody.style.setProperty('--sim-blur-radius', `${radius}px`);
    if (radiusValueBadge) {
      radiusValueBadge.textContent = `${radius}px`;
    }
  }

  // Bind event listeners to toggles
  for (const element of Object.values(toggles)) {
    if (element) {
      element.addEventListener('change', updateSimulation);
    }
  }

  // Bind range input actions
  if (blurRadiusInput) {
    // Dynamic updates while dragging slider
    blurRadiusInput.addEventListener('input', (e) => {
      const radius = parseInt(e.target.value, 10);
      if (radiusValueBadge) {
        radiusValueBadge.textContent = `${radius}px`;
      }
      waBody.style.setProperty('--sim-blur-radius', `${radius}px`);
    });

    // Final state save
    blurRadiusInput.addEventListener('change', updateSimulation);
  }

  // Initialize initial sandbox state
  updateSimulation();
});

/* =========================================================================
   Mobile Detection Logic for Extension Download
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    const downloadBtns = document.querySelectorAll('.download-btn');
    const warnings = document.querySelectorAll('.mobile-warning');
    
    downloadBtns.forEach(btn => {
      btn.innerHTML = 'Desktop Required <i class="ph ph-desktop"></i>';
      btn.style.opacity = '0.5';
      btn.style.pointerEvents = 'none';
      btn.href = '#';
    });
    
    warnings.forEach(warn => warn.classList.add('active'));
  }
});
