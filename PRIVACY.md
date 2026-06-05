# Privacy Policy - WA Privacy Shield

The **WA Privacy Shield** browser extension was built with the core principles of **maximum security** and **absolute user privacy**. We understand the sensitivity of your chat data, and this extension is designed from the ground up to be safe, offline, and fully transparent.

---

## Core Privacy Guarantees

*   **0% Data Collection:** This extension does not collect, record, transmit, or process any of your personal details, chat histories, contact names, profile photos, or usage behaviors.
*   **100% Offline (No External Connections):** The extension runs completely locally inside your browser context. It makes no network requests (`fetch`, `XMLHttpRequest`), uses no analytics code, and has no server backends.
*   **Zero Third-Party Libraries (No Dependencies):** To eliminate the risk of supply chain vulnerabilities, this extension is built using **pure native HTML, CSS, and Vanilla JavaScript**. No external packages or npm scripts are imported.
*   **Local-Only Storage:** All configurations (e.g., toggled settings, selected blur radius) are stored locally on your device via the browser’s local storage API (`chrome.storage.local`) and never leave your machine.

---

## Explanation of Requested Permissions

This extension requests only the absolute minimum permissions required to perform its functions:

1.  **`storage`**: Necessary to persist your privacy preferences locally in your browser.
2.  **Host Access (`https://web.whatsapp.com/*`)**: Necessary to inject `content.js` and `content.css` into WhatsApp Web tabs. The extension **cannot** access or interact with any other websites.

---

## Security Auditing

Because this project is open-source and contains no obfuscated or minified scripts, you can inspect all codebase files at any time to verify our security guarantees:
*   `manifest.json`: Confirms the minimal permissions list and local file bindings.
*   `content.js` & `popup.js`: Straightforward source code with zero tracking, storage transmission, or remote APIs.
*   `content.css` & `popup.css`: Pure stylesheet definitions using standard CSS blur filters (`filter: blur()`).

With this architecture, **WA Privacy Shield** provides an audit-safe, reliable shield to protect your screen from onlookers when using WhatsApp Web in public spaces or office environments.
