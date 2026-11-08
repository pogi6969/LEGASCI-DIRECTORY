# LEGASCI Directory

Campus directory and wayfinding app for **Legazpi City Science High School** (S.Y. 2026–2027), built from the official vicinity map.

## Features

- **Interactive campus map**: pinch/scroll to zoom, drag to pan, tap any room for details. The legend matches the vicinity map colors and can highlight one grade level or room type.
- **Directions**: pick a start and a destination (any room, office, building or open area). The app draws the route along the walkways and lists the steps.
- **Directory**: search every classroom, office, lab and facility by section ("Hubble", "10-Volta"), grade ("G9") or need ("principal", "canteen", "CR"), with filters.
- **Where do I go? guide**: which office, faculty room, lab or facility to go to for common needs, plus a grade-by-grade classroom finder.
- **Building pages**: a short description, how to get there from the Covered Court, a tappable floor plan and the full room list.
- **Installable and offline**: works as a PWA (Add to Home Screen) and keeps working without a connection after the first visit. Light and dark mode.

## Buildings

| Building | What's inside |
| --- | --- |
| **Aristotle** | Office of the School Head, Finance, Supply & Property Office, Research Center, Faculty Rooms – JHS, Grade 8 (Brown, Hooke, Linnaeus, Mendel, Pasteur), Grade 7 (Copernicus, Hubble, Kepler) |
| **Lapus** | Canteen, Comfort Rooms, Grade 7 (Richter, Wegener) |
| **Einstein** | PSDS Office, Academic Management Office 1, two Robotics Laboratories, Grade 9 (Dalton, Curie, Boyle), Grade 10 (Maxwell, Hawking, Faraday, Compton, Volta) |
| **Newton** | Computer, Physics and Biochemistry Laboratories, Faculty Room – SHS, Grade 11 (Taylor, Fayol, Riemann), Grade 9 (Mendeleev, Priestley) |
| **Da Vinci** | Grade 12 (Smith, Pacioli, Tesla, Lavoisier, Feynman, Franklin, Democritus), Grade 11 (Pascal, Gosset, Euler) |
| **Open areas** | Covered Court Area, Center Stage |

## Run it locally

It is a static site with no build step. Serve the folder with any web server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Publish with GitHub Pages

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*, pick `main` and `/ (root)`, then save.
3. The app will be live at `https://<username>.github.io/<repository>/`.

## Updating the directory

All campus content lives in [`js/data.js`](js/data.js):

- `buildings`: name, description, how to get there, row labels.
- `rooms`: every room with its category (`g7`–`g12`, `faculty`, `office`, `lab`, `facility`), position on the map (`rect`), description and search keywords (`aliases`).
- `guide`: the "Where do I go?" questions and their destination rooms.
- `walkways`: the lanes used to draw routes.

After editing, bump `VERSION` in [`sw.js`](sw.js) so installed copies pick up the change.

## Project structure

```
index.html            App shell
css/styles.css        Styles (light/dark themes)
js/data.js            Campus data
js/map.js             SVG campus map, pan/zoom, route finding
js/app.js             Views: Home, Map, Directory, Guide, Building, Room
sw.js                 Offline cache
manifest.webmanifest  PWA manifest
icons/                App icons
```
