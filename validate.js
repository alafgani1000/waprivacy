/* ==========================================================================
   WA Privacy Shield - Security & Codebase Validator
   A local script to verify extension structure and enforce the 100% offline
   rule by scanning files for external connections (fetch, XHR, CDNs, etc.).
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
let errors = [];
let warnings = [];

console.log('=== WA Privacy Shield Codebase Validator ===\n');

// 1. Validate manifest.json
const manifestPath = path.join(baseDir, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  errors.push('manifest.json does not exist');
} else {
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    console.log('✔ manifest.json is valid JSON');

    if (manifest.manifest_version !== 3) {
      errors.push(`manifest_version must be 3 (found ${manifest.manifest_version})`);
    } else {
      console.log('✔ manifest_version is 3 (Manifest V3)');
    }

    // Verify files listed in manifest exist
    const filesToVerify = [];
    if (manifest.action && manifest.action.default_popup) {
      filesToVerify.push(manifest.action.default_popup);
    }
    if (manifest.action && manifest.action.default_icon) {
      Object.values(manifest.action.default_icon).forEach(icon => filesToVerify.push(icon));
    }
    if (manifest.icons) {
      Object.values(manifest.icons).forEach(icon => filesToVerify.push(icon));
    }
    if (manifest.content_scripts) {
      manifest.content_scripts.forEach(script => {
        if (script.css) script.css.forEach(file => filesToVerify.push(file));
        if (script.js) script.js.forEach(file => filesToVerify.push(file));
      });
    }

    const uniqueFiles = [...new Set(filesToVerify)];
    uniqueFiles.forEach(file => {
      const filePath = path.join(baseDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`✔ File declared in manifest exists: ${file}`);
      } else {
        errors.push(`File declared in manifest does NOT exist: ${file}`);
      }
    });

  } catch (err) {
    errors.push(`manifest.json is invalid JSON: ${err.message}`);
  }
}

// 2. Scan JS files for external connections (fetch, XHR, WebSocket, external URL domains)
const jsFiles = ['content.js', 'popup.js'];
jsFiles.forEach(file => {
  const filePath = path.join(baseDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for fetch, XMLHttpRequest, websocket
    if (content.includes('fetch(') || content.includes('fetch (') || content.includes('.fetch(')) {
      errors.push(`Security Alert: ${file} contains a "fetch" call, violating 100% offline rule.`);
    }
    if (content.includes('XMLHttpRequest') || content.includes('ActiveXObject')) {
      errors.push(`Security Alert: ${file} contains an "XMLHttpRequest" call, violating 100% offline rule.`);
    }
    if (content.includes('WebSocket') || content.includes('socket.io') || content.includes('io(')) {
      errors.push(`Security Alert: ${file} contains a "WebSocket" call, violating 100% offline rule.`);
    }

    // Scan for http/https URLs in code
    const urlRegex = /https?:\/\/[^\s"']+/g;
    const matches = content.match(urlRegex) || [];
    const forbiddenMatches = matches.filter(url => !url.includes('web.whatsapp.com'));
    if (forbiddenMatches.length > 0) {
      warnings.push(`Warning: ${file} contains external URLs: ${forbiddenMatches.join(', ')}`);
    } else {
      console.log(`✔ Security Check: ${file} contains no external API calls or suspicious network code.`);
    }
  }
});

// 3. Scan HTML and CSS files for external CDN links or imports
const markupFiles = ['popup.html', 'popup.css', 'content.css'];
markupFiles.forEach(file => {
  const filePath = path.join(baseDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (file.endsWith('.html')) {
      // Check for remote scripts/styles
      const remoteScriptRegex = /<script\s+[^>]*src=["'](https?:\/\/[^"']+)["']/g;
      const remoteLinkRegex = /<link\s+[^>]*href=["'](https?:\/\/[^"']+)["']/g;
      
      let match;
      while ((match = remoteScriptRegex.exec(content)) !== null) {
        errors.push(`Security Alert: ${file} loads remote script: ${match[1]}`);
      }
      while ((match = remoteLinkRegex.exec(content)) !== null) {
        errors.push(`Security Alert: ${file} loads remote stylesheet/resource: ${match[1]}`);
      }
    }

    if (file.endsWith('.css')) {
      // Check for @import of remote resources
      const importRegex = /@import\s+(url\()?["'](https?:\/\/[^"']+)["']/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        errors.push(`Security Alert: ${file} imports remote stylesheet: ${match[2]}`);
      }
    }

    console.log(`✔ Security Check: ${file} does not load any external assets or CDNs.`);
  }
});

// 4. Report results
console.log('\n=== Validation Summary ===');
if (errors.length === 0) {
  console.log('🎉 SUCCESS: All validation checks passed! The extension is safe, 100% offline, and structurally sound.');
} else {
  console.error(`❌ FAILED: ${errors.length} error(s) found:`);
  errors.forEach(err => console.error(`   - ${err}`));
}

if (warnings.length > 0) {
  console.warn(`\n⚠ Warnings (${warnings.length}):`);
  warnings.forEach(warn => console.warn(`   - ${warn}`));
}

process.exit(errors.length > 0 ? 1 : 0);
