# Rakel Vella portfolio

- `index.html` is the homepage. It shows the supplied `test_2.glb` as an interactive, animated model, with Rakel Vella's artist and doctoral researcher bio in the left column. The Artistic Research link below the bio reveals a bordered project list while the model remains visible and interactive; click it again to close the list. A freelance graphic design note and Design link follow beneath it. The Photography page remains available at `photography.html`.
- `home.css` styles the homepage and its transition. `home.js` controls the Artistic Research panel and model interaction. The background is `#DFDFED`.
- `photography.html` is the photography journal. Its desktop photos wrap into new rows; mobile entries use a three-column grid. Click or tap a photo to enlarge it. Click outside the enlarged image or press Escape to close it; left/right arrow keys move through an entry.
- `photography-data.js` holds the journal entries and is the only file you need to edit to add photos or update dates, coordinates, descriptions, and captions.
- `design.html` lists design projects in expandable rows. Click or press Enter/Space on a row to open it; the row scrolls beneath the sticky table header. Expanded images form a carousel with visible arrows and Left/Right keyboard controls, including in the enlarged view. Edit `design-data.js` to replace the sample projects, descriptions, and image placeholders; put project images in `assets/design/`.
- The homepage Design link opens `design.html` with a slide-up entrance for the project table. The Design page's home link stays at the homepage title's position and uses the same type style.
- `meta-gallery.html` remains the separate project page, styled by `styles.css`.
- `assets/vendor/model-viewer.min.js` is a local copy of [model-viewer 4.3.1](https://modelviewer.dev/), used for drag, touch, and keyboard model controls.

The Artistic Research list in `index.html` links to eight project pages, ordered by year with the newest first. `medium-horizons.html`, `dream-edges.html`, `sounds-in-space.html`, and `the-glass-box.html` use the Meta-Gallery layout and contain project text and media from r4k.club. Their images are stored locally in `assets/project-images/`, and `research-detail.js` loads the video players when clicked. `c4ve-dweller.html`, `eyestone.html`, and `procedural-fragments.html` remain templates until their text and media are supplied. Meta-Gallery keeps its existing page.

## Add photography entries

1. Put the image files in `assets/photography/`.
2. Open `photography-data.js`. Copy an entry inside the `entries` array, place it at the top, and replace the date and approximate coordinates. Write a few sentences in its `journal` field; they appear beneath the "Journal entry" label.
3. For each photo, set `src` to its file path, `alt` to a useful visual description, `caption` to the short text shown below it, and `shape` to `wide`, `square`, or `portrait`.
4. Remove the starter entries when your own entries are ready.

Example photo object: `{ src: "assets/photography/street-at-dusk.jpg", alt: "Street at dusk with warm lights reflected on wet pavement", caption: "Evening walk", shape: "wide" }`.

## Preview

Serve this folder through a local web server so the browser can load the GLB. For example, run `python3 -m http.server 8765` here and open `http://localhost:8765/`. Opening `index.html` directly with a `file://` URL may prevent the browser from loading the model.
