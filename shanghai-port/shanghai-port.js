(() => {
  'use strict';

  const photos = [
    { file: '01-players-and-fans.jpg', alt: 'Shanghai Port players greeting a stadium full of supporters in red.' },
    { file: '02-matchday-friends.jpg', alt: 'Three friends in red Shanghai Port jerseys taking a selfie in the stadium stands.' },
    { file: '03-derby-scoreboard.jpg', alt: 'A stadium scoreboard showing Shanghai Port leading Shanghai Shenhua two to zero.' },
    { file: '04-in-the-stands.jpg', alt: 'Friends wearing Shanghai Port jerseys and scarves among supporters in the stands.' },
    { file: '05-away-stadium.jpg', alt: 'A view across the soccer pitch and crowded stands before a Shanghai Port away match.' },
    { file: '06-outside-stadium.jpg', alt: 'Two friends in Shanghai Port jerseys taking a selfie outside a stadium at night.' }
  ];

  const storageKey = 'david-shanghai-port-shuffle-v1';
  const photo = document.getElementById('shanghai-port-photo');
  let state = { remaining: [], last: null };

  // A shuffled deck survives refreshes. Exhaust all photos before dealing again.
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Array.isArray(saved.remaining) &&
        saved.remaining.every(index => Number.isInteger(index) && index >= 0 && index < photos.length) &&
        new Set(saved.remaining).size === saved.remaining.length &&
        Number.isInteger(saved.last) && saved.last >= 0 && saved.last < photos.length &&
        !saved.remaining.includes(saved.last)) {
      state = saved;
    }
  } catch (_) {
    // The image still loads when browser storage is unavailable.
  }

  function drawPhoto() {
    if (!state.remaining.length) {
      state.remaining = photos.map((_, index) => index);
      for (let i = state.remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.remaining[i], state.remaining[j]] = [state.remaining[j], state.remaining[i]];
      }
      // Avoid a repeat at the boundary between two shuffled decks.
      if (state.remaining[state.remaining.length - 1] === state.last) {
        [state.remaining[0], state.remaining[state.remaining.length - 1]] =
          [state.remaining[state.remaining.length - 1], state.remaining[0]];
      }
    }

    const index = state.remaining.pop();
    state.last = index;
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) {}
    const selected = photos[index];
    photo.alt = selected.alt;
    photo.src = '../images/shanghai-port/' + selected.file;
  }

  drawPhoto();
})();
