(() => {
  'use strict';

  const photos = [
    { file: '01-indoor.jpg', alt: 'A player in a white soccer kit running past a referee on an indoor pitch.' },
    { file: '02-under-the-lights.jpg', alt: 'Number 47 watching play on a floodlit soccer pitch at night.' },
    { file: '03-city-pitch.jpg', alt: 'Soccer players walking across a night-time pitch beneath a blue-lit city skyline.' },
    { file: '04-on-the-ball.jpg', alt: 'A player in a white number 10 jersey dribbling with an opponent in pursuit.' },
    { file: '05-good-company.jpg', alt: 'A group of teammates posing together on a city soccer pitch under floodlights.' },
    { file: '06-after-hours.jpg', alt: 'Two friends standing together on a soccer pitch beneath the night sky.' },
    { file: '07-teammates.jpg', alt: 'Three teammates in red Pennington jerseys smiling on the grass.' }
  ];

  const storageKey = 'david-soccer-shuffle-v1';
  const photo = document.getElementById('soccer-photo');
  let state = { remaining: [], last: null };

  // A shuffled deck survives refreshes. Exhaust all seven before dealing again.
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
    // The page still works when browser storage is unavailable.
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
    photo.src = '../images/soccer/' + selected.file;
  }

  drawPhoto();
})();
