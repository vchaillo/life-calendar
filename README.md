# Life Calendar

A dependency-free calendar of life: 90 rows, with 52 weeks per row.

## Run locally

Serve the repository root with `python3 -m http.server 8000`, then open http://localhost:8000.

The app uses three files: `index.html`, `life-calendar.css`, and `life-calendar.js`.

Choose a category, then click a week or hold and drag to paint a continuous period. Use the eraser to clear weeks and undo to revert the last gesture.

Colors are saved in localStorage in the current browser. They are not synchronized across browsers or devices. Undo history lasts for the current session.

## Deployment

Every push to `main` publishes the three static files to `gh-pages` using the existing `SSH_KEY` secret. GitHub Pages should remain configured to serve the root of `gh-pages`.
