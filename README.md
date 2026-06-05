# WA Privacy Shield

A premium, lightweight, and security-focused browser extension (Manifest V3) designed to protect your screen privacy on WhatsApp Web. It blurs sensitive chat elements (messages, previews, contact names, profile photos, media, and inputs) and reveals them dynamically when hovered. 

Runs **100% offline** with **zero external dependencies** or CDNs to guarantee complete data isolation.

---

## ✨ Features

*   **Granular Blur Controls:** Independent switches to toggle blur effects for:
    *   **Chat Messages:** Hide text content inside message bubbles.
    *   **Message Previews:** Hide the last message previews in the left sidebar list.
    *   **Contact & Group Names:** Hide sender identities and group titles.
    *   **Profile Pictures:** Hide avatar images in the sidebar and chat header.
    *   **Sent Media:** Hide images, videos, stickers, voice notes, and waveforms.
    *   **Message Input Area:** Blur text in your compose box (only active when not focused, ensuring privacy before you press send).
*   **Reveal on Hover:** Temporarily unblurs any item with a smooth transition when you place your mouse cursor over it.
*   **Custom Blur Intensity:** Interactive range slider allowing you to adjust the blur radius from `4px` to `20px`.
*   **Instant Multi-Tab Synchronization:** Settings are synced across all open WhatsApp Web tabs instantly without page refreshes.

---

## 🔒 Security Design

Security and data safety are the absolute priorities of this project:

1.  **Zero External Libraries:** Built strictly with native, vanilla HTML, CSS, and JavaScript. This prevents supply chain attacks (e.g., malicious NPM updates).
2.  **100% Offline (No CDNs):** All styles, icons, and fonts are bundled locally. The extension does not load remote CDNs or external fonts, and is completely offline-capable.
3.  **No Network Calls:** Zero integration of remote trackers, fetch scripts, or analytics engines. All states remain in local storage (`chrome.storage.local`).
4.  **Minimal Permissions Policy:** Only requests `storage` and host access to `*://web.whatsapp.com/*`.

---

## 📁 Codebase Structure

The project has a minimalist and transparent structure:

*   `manifest.json`: Defines Manifest V3 extension settings and matching filters.
*   `content.js`: Injected script that listens to local storage updates and handles HTML body classes.
*   `content.css`: Injected stylesheet defining blur filters and transition states.
*   `popup.html`: The panel control interface for users.
*   `popup.css`: Premium dark glassmorphism styling for the popup dashboard.
*   `popup.js`: Event listeners for the toggles and range inputs, saving configurations.
*   `PRIVACY.md`: Human-readable privacy policy and security guarantees.
*   `validate.js`: Automated testing script to verify the absence of external connections.
*   `icon16.png`, `icon48.png`, `icon128.png`: Locally scaled graphic assets for browser toolbar, dashboard, and settings menus.

---

## 🚀 Installation Guide

Since the extension runs locally and is open-source, you can load it as an unpacked directory in any Chromium-based browser (Chrome, Edge, Brave, Opera, Vivaldi):

1.  Clone or download this repository to a folder on your computer (e.g., `d:\source_code\waprivacy\`).
2.  Open your browser and navigate to `chrome://extensions/` (or `edge://extensions/`).
3.  Enable **Developer Mode** by toggling the switch in the top-right corner of the page.
4.  Click the **Load Unpacked** button in the top-left corner.
5.  Select the folder containing the project files (`d:\source_code\waprivacy\`).
6.  Open [WhatsApp Web](https://web.whatsapp.com/) in a new tab.
7.  Click the extensions puzzle icon in the toolbar, pin **WA Privacy Shield**, and click its green shield icon to customize your settings.

---

## 🧪 Automated Integrity & Security Scanning

We provide a validation script (`validate.js`) to audit the codebase for security compliance. It checks manifest health, asset availability, and scans source code for network calls or remote scripts.

To run the verification locally:

```bash
# Verify the extension structure and safety rules
node validate.js
```

### Validator Checks Performed:
*   [x] Manifest V3 compliance and JSON format integrity.
*   [x] Completeness check of all bound scripts and media assets.
*   [x] Scanning JS code for connection queries (`fetch`, `XMLHttpRequest`, `WebSocket`, or non-WhatsApp APIs).
*   [x] Scanning HTML/CSS files to verify zero external imports, fonts, styles, or script CDNs are used.
