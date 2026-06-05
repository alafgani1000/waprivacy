/* ==========================================================================
   WA Privacy Shield - Injected Content Script
   Runs completely client-side in WhatsApp Web tab.
   Syncs user preferences from local chrome storage and updates body classes.
   ========================================================================== */

// Default privacy settings
const DEFAULT_SETTINGS = {
  isActive: true,
  blurMessages: true,
  blurNames: false,
  blurPreviews: true,
  blurAvatars: true,
  blurMedia: true,
  blurInput: false,
  revealHover: true,
  blurRadius: 8
};

/**
 * Updates the <body> element classes and CSS variables based on configuration.
 * @param {Object} settings - The stored user preferences.
 */
function applySettings(settings) {
  const body = document.body;
  if (!body) return;

  // 1. Master Active Class
  if (settings.isActive) {
    body.classList.add('wa-privacy-active');
  } else {
    body.classList.remove('wa-privacy-active');
  }

  // 2. Individual Blurring Toggles
  const toggles = {
    'wa-blur-messages': settings.blurMessages,
    'wa-blur-names': settings.blurNames,
    'wa-blur-previews': settings.blurPreviews,
    'wa-blur-avatars': settings.blurAvatars,
    'wa-blur-media': settings.blurMedia,
    'wa-blur-input': settings.blurInput,
    'wa-reveal-hover': settings.revealHover
  };

  for (const [className, isEnabled] of Object.entries(toggles)) {
    if (isEnabled && settings.isActive) {
      body.classList.add(className);
    } else {
      body.classList.remove(className);
    }
  }

  // 3. Blur Radius Variable
  const radius = settings.blurRadius !== undefined ? settings.blurRadius : 8;
  document.documentElement.style.setProperty('--wa-blur-radius', `${radius}px`);
}

/**
 * Loads current settings from storage and applies them to the document.
 */
function initializePrivacyShield() {
  chrome.storage.local.get(DEFAULT_SETTINGS, (settings) => {
    applySettings(settings);
  });
}

// Since content.js is configured with run_at: "document_start",
// the <body> element might not exist yet when script runs. We handle this safely.
if (document.body) {
  initializePrivacyShield();
} else {
  const observer = new MutationObserver(() => {
    if (document.body) {
      initializePrivacyShield();
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true });
}

// Listen for storage changes to sync settings in real-time (works across tabs instantly)
chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(DEFAULT_SETTINGS, (settings) => {
    applySettings(settings);
  });
});
