/**
 * Echofy Web & Deep-Link Router Engine
 * Handles universal track/jam/playlist deep-linking and dynamic client rendering.
 */

// Configuration
const CONFIG = {
  appName: 'Echofy',
  appPackage: 'com.Chenkham.Echofy',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.Chenkham.Echofy',
  universalApkDownloadUrl: 'https://drive.google.com/drive/folders/1EchofyReleases?usp=sharing',
  googleDriveMirrorUrl: 'https://drive.google.com/drive/folders/1EchofyReleases?usp=sharing', // Configurable Google Drive link
};

// Route & Query Parameter Parser
function parseShareContext() {
  const urlParams = new URLSearchParams(window.location.search);
  const path = window.location.pathname.replace(/\/echofy-website\/?/, '/');
  const pathSegments = path.split('/').filter(Boolean);

  let type = null;
  let id = null;
  let title = urlParams.get('title') || urlParams.get('t') || '';
  let artist = urlParams.get('artist') || urlParams.get('a') || urlParams.get('artist_name') || '';
  let thumb = urlParams.get('thumb') || urlParams.get('cover') || '';

  // Check query params first
  if (urlParams.has('track') || urlParams.has('song') || urlParams.has('v')) {
    type = 'track';
    id = urlParams.get('track') || urlParams.get('song') || urlParams.get('v');
  } else if (urlParams.has('jam') || urlParams.has('room') || urlParams.has('together')) {
    type = 'jam';
    id = urlParams.get('jam') || urlParams.get('room') || urlParams.get('together');
  } else if (urlParams.has('playlist') || urlParams.has('list')) {
    type = 'playlist';
    id = urlParams.get('playlist') || urlParams.get('list');
  } else if (urlParams.has('album')) {
    type = 'album';
    id = urlParams.get('album');
  } else if (urlParams.has('artist')) {
    type = 'artist';
    id = urlParams.get('artist');
  }

  // Check path segments if not found in query
  if (!type && pathSegments.length >= 2) {
    const first = pathSegments[0].toLowerCase();
    const second = pathSegments[1];
    if (['track', 'song', 'watch'].includes(first)) {
      type = 'track';
      id = second;
    } else if (['jam', 'r', 'together'].includes(first)) {
      type = 'jam';
      id = second;
    } else if (['playlist'].includes(first)) {
      type = 'playlist';
      id = second;
    } else if (['album'].includes(first)) {
      type = 'album';
      id = second;
    } else if (['artist'].includes(first)) {
      type = 'artist';
      id = second;
    }
  }

  return { type, id, title, artist, thumb };
}

// Generate App Deep Links & Intents
function generateDeepLinks(type, id, title, artist) {
  let appSchemeUri = '';
  let intentUri = '';

  switch (type) {
    case 'track':
      appSchemeUri = `echofy://track/${id}`;
      intentUri = `intent://track/${id}?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}#Intent;scheme=echofy;package=${CONFIG.appPackage};end`;
      break;
    case 'jam':
      appSchemeUri = `echofy://jam/${id}`;
      intentUri = `intent://jam/${id}#Intent;scheme=echofy;package=${CONFIG.appPackage};end`;
      break;
    case 'playlist':
      appSchemeUri = `echofy://playlist/${id}`;
      intentUri = `intent://playlist/${id}#Intent;scheme=echofy;package=${CONFIG.appPackage};end`;
      break;
    case 'album':
      appSchemeUri = `echofy://album/${id}`;
      intentUri = `intent://album/${id}#Intent;scheme=echofy;package=${CONFIG.appPackage};end`;
      break;
    case 'artist':
      appSchemeUri = `echofy://artist/${id}`;
      intentUri = `intent://artist/${id}#Intent;scheme=echofy;package=${CONFIG.appPackage};end`;
      break;
    default:
      appSchemeUri = `echofy://open/home`;
      intentUri = `intent://open/home#Intent;scheme=echofy;package=${CONFIG.appPackage};end`;
  }

  return { appSchemeUri, intentUri };
}

// Toast helper
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// Initialize Dynamic UI
document.addEventListener('DOMContentLoaded', () => {
  const context = parseShareContext();
  const sharedSection = document.getElementById('shared-item-section');
  const sharedBadge = document.getElementById('shared-badge');
  const sharedTitle = document.getElementById('shared-title');
  const sharedSubtitle = document.getElementById('shared-subtitle');
  const sharedArt = document.getElementById('shared-art');
  const btnOpenApp = document.getElementById('btn-open-app');
  const jamBox = document.getElementById('jam-box');
  const jamCodeDisplay = document.getElementById('jam-code-display');
  const btnCopyJam = document.getElementById('btn-copy-jam');

  // Update dynamic download links
  const playStoreBtns = document.querySelectorAll('.btn-playstore-link');
  playStoreBtns.forEach(btn => btn.href = CONFIG.playStoreUrl);

  const directApkBtns = document.querySelectorAll('.btn-apk-link');
  directApkBtns.forEach(btn => btn.href = CONFIG.universalApkDownloadUrl);

  const driveBtns = document.querySelectorAll('.btn-drive-link');
  driveBtns.forEach(btn => btn.href = CONFIG.googleDriveMirrorUrl);

  if (context.type && context.id) {
    const { appSchemeUri, intentUri } = generateDeepLinks(context.type, context.id, context.title, context.artist);

    // Make shared section visible
    if (sharedSection) sharedSection.style.display = 'block';

    if (context.type === 'track') {
      const displayTitle = context.title || 'Shared Song';
      const displayArtist = context.artist || 'Listen on Echofy';
      const artUrl = context.thumb || `https://i.ytimg.com/vi/${context.id}/hqdefault.jpg`;

      document.title = `${displayTitle} • ${displayArtist} | Echofy`;
      if (sharedBadge) {
        sharedBadge.textContent = '🎵 Shared Track';
        sharedBadge.className = 'shared-badge';
      }
      if (sharedTitle) sharedTitle.textContent = displayTitle;
      if (sharedSubtitle) sharedSubtitle.textContent = displayArtist;
      if (sharedArt) {
        sharedArt.src = artUrl;
        sharedArt.style.display = 'block';
      }
      if (btnOpenApp) {
        btnOpenApp.textContent = '▶ Play in Echofy';
        btnOpenApp.onclick = (e) => {
          e.preventDefault();
          launchAppOrFallback(appSchemeUri, intentUri);
        };
      }
      if (jamBox) jamBox.style.display = 'none';

      // 30-Second Web Audio Preview Player
      const previewPlayer = document.getElementById('web-preview-player');
      const btnPreviewPlay = document.getElementById('btn-preview-play');
      const playIcon = document.getElementById('preview-play-icon');
      const pauseIcon = document.getElementById('preview-pause-icon');
      const waveformBars = document.getElementById('waveform-bars');
      const ytContainer = document.getElementById('yt-player-container');
      let isPlaying = false;
      let previewTimer = null;

      if (previewPlayer && btnPreviewPlay) {
        previewPlayer.style.display = 'flex';
        btnPreviewPlay.onclick = () => {
          if (!isPlaying) {
            isPlaying = true;
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
            if (waveformBars) waveformBars.classList.add('playing');

            // Embed audio stream without leaving page
            if (ytContainer) {
              ytContainer.innerHTML = `<iframe width="1" height="1" src="https://www.youtube-nocookie.com/embed/${context.id}?autoplay=1&enablejsapi=1" frameborder="0" allow="autoplay"></iframe>`;
            }

            // 30-second preview limit
            clearTimeout(previewTimer);
            previewTimer = setTimeout(() => {
              if (isPlaying) {
                isPlaying = false;
                if (playIcon) playIcon.style.display = 'block';
                if (pauseIcon) pauseIcon.style.display = 'none';
                if (waveformBars) waveformBars.classList.remove('playing');
                if (ytContainer) ytContainer.innerHTML = '';
                showToast('Preview complete. Tap "Play in Echofy" for lossless sound!');
              }
            }, 30000);
          } else {
            isPlaying = false;
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
            if (waveformBars) waveformBars.classList.remove('playing');
            if (ytContainer) ytContainer.innerHTML = '';
            clearTimeout(previewTimer);
          }
        };
      }

      // Auto-attempt launch on mobile Android browsers
      if (/Android/i.test(navigator.userAgent)) {
        setTimeout(() => {
          launchAppOrFallback(appSchemeUri, intentUri, false);
        }, 300);
      }

    } else if (context.type === 'jam') {
      const roomCode = context.id.toUpperCase();
      document.title = `Join Jam Room ${roomCode} | Echofy Jam Together`;

      if (sharedBadge) {
        sharedBadge.textContent = '👥 Jam Together Live';
        sharedBadge.className = 'shared-badge jam';
      }
      if (sharedTitle) sharedTitle.textContent = 'You are invited to Jam!';
      if (sharedSubtitle) sharedSubtitle.textContent = 'Listen in real-time sync with high quality sound & dynamic queue.';
      if (sharedArt) sharedArt.style.display = 'none';
      if (jamBox) jamBox.style.display = 'flex';
      if (jamCodeDisplay) jamCodeDisplay.textContent = roomCode;

      const jamStatusBadge = document.getElementById('jam-status-badge');
      if (jamStatusBadge) jamStatusBadge.style.display = 'flex';

      if (btnCopyJam) {
        btnCopyJam.onclick = () => {
          navigator.clipboard.writeText(roomCode);
          showToast(`Room code ${roomCode} copied!`);
        };
      }

      if (btnOpenApp) {
        btnOpenApp.textContent = '🚀 Join Jam Session';
        btnOpenApp.onclick = (e) => {
          e.preventDefault();
          launchAppOrFallback(appSchemeUri, intentUri);
        };
      }

      // Auto-attempt launch on Android
      if (/Android/i.test(navigator.userAgent)) {
        setTimeout(() => {
          launchAppOrFallback(appSchemeUri, intentUri, false);
        }, 300);
      }
    } else {
      // Playlist / Album / Artist
      const capitalized = context.type.charAt(0).toUpperCase() + context.type.slice(1);
      document.title = `${capitalized} | Echofy`;
      if (sharedBadge) sharedBadge.textContent = `📁 Shared ${capitalized}`;
      if (sharedTitle) sharedTitle.textContent = context.title || `Echofy ${capitalized}`;
      if (sharedSubtitle) sharedSubtitle.textContent = `Open this ${context.type} inside Echofy app.`;
      if (btnOpenApp) {
        btnOpenApp.textContent = `Open ${capitalized} in Echofy`;
        btnOpenApp.onclick = (e) => {
          e.preventDefault();
          launchAppOrFallback(appSchemeUri, intentUri);
        };
      }
      if (jamBox) jamBox.style.display = 'none';
    }
  }
});

// Launch App or Fallback to Store/Download
function launchAppOrFallback(appSchemeUri, intentUri, shouldPromptFallback = true) {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const startTime = Date.now();

  if (isAndroid) {
    // Try Android Intent URI first (most reliable on Chrome Android)
    window.location.href = intentUri;
    
    // Also trigger custom scheme as immediate fallback
    setTimeout(() => {
      window.location.href = appSchemeUri;
    }, 150);
  } else {
    // Non-Android or desktop: try custom scheme
    window.location.href = appSchemeUri;
  }

  // If after 1.5 seconds the browser is still active, app is likely not installed
  setTimeout(() => {
    if (Date.now() - startTime < 2200) {
      if (shouldPromptFallback) {
        showToast('App not installed. Redirecting to download options...');
        const downloadsElem = document.getElementById('downloads');
        if (downloadsElem) {
          downloadsElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, 1500);
}
