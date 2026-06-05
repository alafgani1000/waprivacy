/* ==========================================================================
   WA Privacy Shield - Popup Controller
   Manages the state of the UI and saves preferences to chrome.storage.local.
   Content scripts listen to storage changes and update dynamically.
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

// DOM Elements
const card = document.querySelector('.card');
const blurRadiusInput = document.getElementById('blurRadius');
const radiusValueBadge = document.getElementById('radius-value');

// List of all checkbox elements in popup
const checkboxIds = [
  'isActive',
  'blurMessages',
  'blurPreviews',
  'blurNames',
  'blurAvatars',
  'blurMedia',
  'blurInput',
  'revealHover'
];

/**
 * Loads values from local storage and updates the popup interface.
 */
function loadSettings() {
  chrome.storage.local.get(DEFAULT_SETTINGS, (settings) => {
    // Set checked states for checkboxes
    checkboxIds.forEach((id) => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = settings[id];
      }
    });

    // Set slider value
    if (blurRadiusInput && radiusValueBadge) {
      blurRadiusInput.value = settings.blurRadius;
      radiusValueBadge.textContent = `${settings.blurRadius}px`;
    }

    // Toggle card disabled appearance
    updateUIState(settings.isActive);
  });
}

/**
 * Visual styling update for disabled state of sub-settings.
 * @param {boolean} isActive - Whether the shield is active.
 */
function updateUIState(isActive) {
  if (isActive) {
    card.classList.remove('disabled');
  } else {
    card.classList.add('disabled');
  }
}

/**
 * Saves a single key-value setting to chrome local storage.
 * @param {string} key - The setting name.
 * @param {*} value - The value.
 */
function saveSetting(key, value) {
  chrome.storage.local.set({ [key]: value });
}

/**
 * Attaches change listeners to checkboxes and the range slider.
 */
function bindEvents() {
  // Checkbox state triggers
  checkboxIds.forEach((id) => {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        saveSetting(id, isChecked);
        
        // If master toggle changed, update visual disabled state
        if (id === 'isActive') {
          updateUIState(isChecked);
        }
      });
    }
  });

  // Slider controls
  if (blurRadiusInput) {
    // Update badge in real-time as user drags slider
    blurRadiusInput.addEventListener('input', (e) => {
      const radius = parseInt(e.target.value, 10);
      if (radiusValueBadge) {
        radiusValueBadge.textContent = `${radius}px`;
      }
    });

    // Save settings when dragging ends (change event)
    blurRadiusInput.addEventListener('change', (e) => {
      const radius = parseInt(e.target.value, 10);
      saveSetting('blurRadius', radius);
    });
  }
}

// Run initializer
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  bindEvents();
});
