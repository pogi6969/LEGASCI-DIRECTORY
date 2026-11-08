/*
 * LEGASCI Directory: app shell, routing and views.
 */
(function () {
  'use strict';

  const D = window.LCSHS;
  const CAT = D.categories;
  const view = document.getElementById('view');
  const buildingById = new Map(D.buildings.map(function (b) { return [b.id, b]; }));

  /* ---------- Icons ---------- */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    map: '<path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8.5 7h2M13.5 7h2M8.5 11h2M13.5 11h2M8.5 15h2M13.5 15h2M10 21v-3h4v3"/>',
    route: '<circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M8.2 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    flask: '<path d="M9 3h6M10 3v6.5L4.6 18.6A1.6 1.6 0 0 0 6 21h12a1.6 1.6 0 0 0 1.4-2.4L14 9.5V3"/><path d="M7.2 15h9.6"/>',
    atom: '<circle cx="12" cy="12" r="1.4"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx=".5"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20.5a6.5 6.5 0 0 1 13 0"/><path d="M15.5 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 6.3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    food: '<path d="M7 3v18M4 3v5a3 3 0 0 0 6 0V3"/><path d="M17 21V3c-2.2 0-3.5 2.5-3.5 6.5V14H17"/>',
    restroom: '<circle cx="7" cy="4.5" r="1.8"/><circle cx="17" cy="4.5" r="1.8"/><path d="M5 21v-6H3.8L5.2 8.5h3.6L10.2 15H9v6M15 21V8.5h4V21M12 3v18"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.8z"/>',
    court: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M12 5v14"/><circle cx="12" cy="12" r="3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.1"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
    swap: '<path d="M7 20V4M3.5 7.5 7 4l3.5 3.5M17 4v16M13.5 16.5 17 20l3.5-3.5"/>',
    coins: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    book: '<path d="M4 19V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0 0 4h14"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.8h6V4M8.5 10h7M8.5 14h7M8.5 18h4"/>',
    shield: '<path d="M12 3 20 6v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    door: '<path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21M3.5 21h17"/><circle cx="14.5" cy="12" r="1"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };
  function icon(name, cls) {
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.pin) + '</svg>';
  }

  /* ---------- Helpers ---------- */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  const store = {
    get: function (k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  function listJoin(arr) {
    if (arr.length <= 1) return arr.join('');
    return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  }
  function bName(id) { const b = buildingById.get(id); return b ? b.name + ' Building' : ''; }
  function displayName(e) { return e.hint ? e.name + ' (' + e.hint + ')' : e.name; }
  function isClassroom(e) { return CAT[e.cat] && CAT[e.cat].kind === 'classroom'; }
  function typeLabel(e) {
    if (e.type === 'building') return 'Building';
    const c = CAT[e.cat];
    return c.kind === 'classroom' ? c.label + ' classroom' : c.label;
  }
  function entIcon(e) { return e.icon || (isClassroom(e) ? 'door' : 'pin'); }
  function describe(e) {
    if (e.desc) return e.desc;
    if (isClassroom(e)) return CAT[e.cat].label + ' classroom of section ' + e.section + '.';
    return '';
  }
  function byOrder(a, b) {
    const ca = D.catOrder.indexOf(a.cat), cb = D.catOrder.indexOf(b.cat);
    if (ca !== cb) return ca - cb;
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  }

  function neighbors(e) {
    const b = buildingById.get(e.b);
    if (!b) return [];
    const r = e.rect, tol = 3;
    const ov = function (a1, a2, b1, b2) { return Math.min(a2, b2) - Math.max(a1, b1); };
    return b.rooms.filter(function (o) {
      if (o.id === e.id) return false;
      const q = o.rect;
      if (b.vertical) {
        return (Math.abs(q[1] + q[3] - r[1]) < tol || Math.abs(r[1] + r[3] - q[1]) < tol) && ov(r[0], r[0] + r[2], q[0], q[0] + q[2]) > 20;
      }
      return (Math.abs(q[0] + q[2] - r[0]) < tol || Math.abs(r[0] + r[2] - q[0]) < tol) && ov(r[1], r[1] + r[3], q[1], q[1] + q[3]) > 20;
    }).sort(function (a, c) { return a.rect[0] - c.rect[0] || a.rect[1] - c.rect[1]; });
  }

  function locationText(e) {
    if (e.type === 'place') return e.where || '';
    if (e.type === 'building') return '';
    const b = buildingById.get(e.b);
    const parts = [];
    if (b.rows) {
      const k = Object.keys(b.rows).find(function (y) { return Math.abs(+y - e.rect[1]) < 3; });
      if (k) parts.push(b.rows[k] + '.');
    }
    const nb = neighbors(e).map(function (n) { return n.name; });
    if (nb.length) parts.push('Beside ' + listJoin(nb) + '.');
    if (e.note) parts.push(e.note);
    return parts.join(' ');
  }

  function swatch(e, big) {
    const c = CAT[e.cat];
    if (c && c.kind === 'classroom') {
      return '<span class="sw sw--grade' + (big ? ' sw--big' : '') + '" style="--c:' + c.color + ';--c2:' + c.grad[1] + '">' + esc(c.short) + '</span>';
    }
    const cls = e.type === 'building' ? 'sw--building' : c && c.kind === 'faculty' ? 'sw--faculty' : 'sw--other';
    const style = e.type === 'building' ? ' style="--c:' + buildingById.get(e.b).color + '"' : '';
    return '<span class="sw ' + cls + (big ? ' sw--big' : '') + '"' + style + '>' + icon(entIcon(e)) + '</span>';
  }

  /* ---------- Search ---------- */
  function norm(v) {
    return String(v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[–—\-_.,&()/’']+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const searchIndex = D.places.concat(D.rooms).map(function (e) {
    const c = CAT[e.cat];
    return {
      e: e,
      name: norm(e.name),
      section: norm(e.section),
      hay: ' ' + norm([e.name, e.section, e.hint, (e.aliases || []).join(' '), typeLabel(e), c.short, c.kind === 'classroom' ? 'classroom section room' : '', bName(e.b)].join(' '))
    };
  });
  function matchCat(e, cat) { return !cat || e.cat === cat; }
  function search(q, cat) {
    const nq = norm(q);
    const toks = nq ? nq.split(' ') : [];
    let res = searchIndex.filter(function (x) {
      return matchCat(x.e, cat) && toks.every(function (t) { return x.hay.indexOf(' ' + t) !== -1; });
    });
    if (nq) {
      res = res.map(function (x) {
        let sc = 4;
        if (x.name === nq || x.section === nq) sc = 0;
        else if (x.name.indexOf(nq) === 0 || (x.section && x.section.indexOf(nq) === 0)) sc = 1;
        else if (x.name.indexOf(nq) !== -1) sc = 2;
        return { x: x, sc: sc };
      }).sort(function (a, b) { return a.sc - b.sc || byOrder(a.x.e, b.x.e); }).map(function (o) { return o.x; });
    }
    return res.map(function (x) { return x.e; });
  }

  /* ---------- Shared bits ---------- */
  function ritem(e, extra) {
    const sub = [typeLabel(e), e.hint, extra === false ? null : bName(e.b)].filter(Boolean).join(' · ');
    return '<li><a class="ritem" href="#/room/' + esc(e.id) + '">' + swatch(e) +
      '<span class="ritem__text"><strong>' + esc(e.name) + '</strong><small>' + esc(sub) + '</small></span>' +
      icon('chev', 'ritem__chev') + '</a></li>';
  }
  function dirLink(to, from) { return '#/map?from=' + encodeURIComponent(from || 'court') + '&to=' + encodeURIComponent(to); }
  function mountMinis(root, maps) {
    root.querySelectorAll('[data-minimap]').forEach(function (el) {
      const id = el.getAttribute('data-minimap');
      const sel = el.getAttribute('data-selected');
      const clickable = el.hasAttribute('data-clickable');
      maps.push(new window.CampusMap(el, {
        mini: true, labels: false, pad: +(el.getAttribute('data-pad') || 16), focus: id, selected: sel || null,
        onSelect: clickable ? function (rid) { location.hash = '#/room/' + rid; } : null
      }));
    });
  }
  function setTitle(t) { document.title = t ? t + ' · ' + D.school.app : D.school.app + ' · ' + D.school.name; }
  function counts() {
    const c = { classrooms: 0, labs: 0, offices: 0, faculty: 0, facilities: 0 };
    D.rooms.forEach(function (r) {
      const k = CAT[r.cat].kind;
      if (k === 'classroom') c.classrooms++;
      else if (r.cat === 'lab') c.labs++;
      else if (r.cat === 'office') c.offices++;
      else if (r.cat === 'faculty') c.faculty++;
      else c.facilities++;
    });
    return c;
  }
  function gradesIn(b) {
    const set = [];
    b.rooms.forEach(function (r) { if (isClassroom(r) && set.indexOf(r.cat) === -1) set.push(r.cat); });
    return set.sort(function (a, c) { return D.catOrder.indexOf(a) - D.catOrder.indexOf(c); });
  }
  function gradeChips(b) {
    return gradesIn(b).map(function (g) { return '<span class="gchip" style="--c:' + CAT[g].color + '">' + CAT[g].short + '</span>'; }).join('');
  }

  /* ---------- Views ---------- */
  function HomeView() {
    setTitle('');
    const c = counts();
    const quick = [
      { label: 'Find my classroom', href: '#/guide?s=classrooms', icon: 'door' },
      { label: 'School Head', href: '#/room/osh', icon: 'user' },
      { label: 'Canteen', href: '#/room/canteen', icon: 'food' },
      { label: 'Comfort Rooms', href: '#/directory?q=comfort', icon: 'restroom' },
      { label: 'Laboratories', href: '#/directory?cat=lab', icon: 'flask' },
      { label: 'Faculty Rooms', href: '#/directory?cat=faculty', icon: 'users' }
    ];
    view.innerHTML =
      '<section class="hero">' +
        '<p class="eyebrow eyebrow--light">' + esc(D.school.sy) + ' · Campus directory</p>' +
        '<h1 class="hero__title">Find your way around <span>LCSHS</span></h1>' +
        '<p class="hero__sub">Every building, classroom, office, lab and facility of ' + esc(D.school.name) + ', with directions.</p>' +
        '<form class="searchbox searchbox--hero" data-js="search" role="search">' + icon('search') +
          '<input type="search" name="q" placeholder="Search a section, room or office" aria-label="Search the directory" autocomplete="off" enterkeyhint="search">' +
          '<button class="btn btn--primary" type="submit">Search</button>' +
        '</form>' +
      '</section>' +
      '<nav class="quick" aria-label="Quick links">' + quick.map(function (q) {
        return '<a class="quick__item" href="' + q.href + '">' + icon(q.icon) + '<span>' + esc(q.label) + '</span></a>';
      }).join('') + '</nav>' +
      '<section class="stats" aria-label="Campus at a glance">' +
        stat(D.buildings.length, 'Buildings') + stat(c.classrooms, 'Classrooms') + stat(c.labs, 'Laboratories') + stat(c.offices + c.faculty, 'Offices & faculty rooms') +
      '</section>' +
      '<section class="section">' +
        '<div class="section__head"><h2>Buildings</h2><a class="link" href="#/map">Open campus map ' + icon('arrow') + '</a></div>' +
        '<div class="bgrid">' + D.buildings.map(bcard).join('') + '</div>' +
      '</section>' +
      '<section class="section">' +
        '<div class="section__head"><h2>Open areas</h2></div>' +
        '<div class="pgrid">' + D.places.map(function (p) {
          return '<a class="pcard" href="#/room/' + p.id + '">' + swatch(p, true) + '<span><strong>' + esc(p.name) + '</strong><small>' + esc(p.where) + '</small></span>' + icon('chev', 'ritem__chev') + '</a>';
        }).join('') + '</div>' +
      '</section>' +
      '<a class="cta" href="#/guide">' +
        '<span class="cta__icon">' + icon('compass') + '</span>' +
        '<span><strong>Where do I go?</strong><small>Find the right office, teacher, lab or facility for what you need.</small></span>' +
        icon('arrow', 'cta__arrow') +
      '</a>';

    function stat(n, l) { return '<div class="stat"><strong>' + n + '</strong><span>' + esc(l) + '</span></div>'; }
    function bcard(b) {
      return '<a class="bcard" href="#/building/' + b.id + '" style="--accent:' + b.color + '">' +
        '<div class="bcard__map" data-minimap="b-' + b.id + '" data-pad="14"></div>' +
        '<div class="bcard__body">' +
          '<h3>' + esc(b.name) + ' <span>Building</span></h3>' +
          '<p class="bcard__tag">' + esc(b.tagline) + '</p>' +
          '<p class="bcard__desc">' + esc(b.summary) + '</p>' +
          '<div class="bcard__foot"><span class="gchips">' + gradeChips(b) + '</span><span class="muted">' + b.rooms.length + ' rooms</span></div>' +
        '</div></a>';
    }

    const maps = [];
    mountMinis(view, maps);
    view.querySelector('[data-js="search"]').addEventListener('submit', function (e) {
      e.preventDefault();
      const q = e.target.q.value.trim();
      location.hash = '#/directory' + (q ? '?q=' + encodeURIComponent(q) : '');
    });
    return { destroy: function () { maps.forEach(function (m) { m.destroy(); }); } };
  }

  function DirectoryView(arg, params) {
    setTitle('Directory');
    let q = params.get('q') || '';
    let cat = params.get('cat') || '';
    const filters = [['', 'All'], ['g7', 'G7'], ['g8', 'G8'], ['g9', 'G9'], ['g10', 'G10'], ['g11', 'G11'], ['g12', 'G12'],
      ['office', 'Offices'], ['faculty', 'Faculty'], ['lab', 'Labs'], ['facility', 'Facilities'], ['place', 'Open areas']];
    const total = D.rooms.length + D.places.length;
    view.innerHTML =
      '<header class="page-head"><p class="eyebrow">' + esc(D.school.sy) + '</p><h1>Directory</h1>' +
      '<p>' + total + ' rooms and places across ' + D.buildings.length + ' buildings. Search by section, room, office or what you need.</p></header>' +
      '<div class="dirbar">' +
        '<label class="searchbox">' + icon('search') +
          '<input type="search" data-js="q" value="' + esc(q) + '" placeholder="Try “Hubble”, “10-Volta”, “principal”, “canteen”" aria-label="Search the directory" autocomplete="off" enterkeyhint="search">' +
        '</label>' +
        '<div class="chips" role="toolbar" aria-label="Filter by type">' + filters.map(function (f) {
          const c = CAT[f[0]];
          const dot = c && c.kind === 'classroom' ? '<i style="--c:' + c.color + '"></i>' : '';
          return '<button type="button" class="chip" data-cat="' + f[0] + '" aria-pressed="' + (cat === f[0]) + '">' + dot + esc(f[1]) + '</button>';
        }).join('') + '</div>' +
      '</div>' +
      '<p class="count" data-js="count" aria-live="polite"></p>' +
      '<div data-js="results"></div>';

    const input = view.querySelector('[data-js="q"]');
    const out = view.querySelector('[data-js="results"]');
    const countEl = view.querySelector('[data-js="count"]');

    function render() {
      const res = search(q, cat);
      countEl.textContent = res.length === total ? 'Showing everything' : res.length + (res.length === 1 ? ' result' : ' results');
      if (!res.length) {
        out.innerHTML = '<div class="empty">' + icon('search') + '<p><strong>No match' + (q ? ' for “' + esc(q) + '”' : '') + '.</strong></p>' +
          '<p class="muted">Try a section name like “Hubble”, a grade like “G9”, or a place like “canteen”.</p></div>';
        return;
      }
      if (q) {
        out.innerHTML = '<ul class="rlist rlist--card">' + res.map(function (e) { return ritem(e); }).join('') + '</ul>';
        return;
      }
      const groups = [];
      D.buildings.forEach(function (b) {
        const items = res.filter(function (e) { return e.b === b.id; }).sort(byOrder);
        if (items.length) groups.push({ title: b.name + ' Building', href: '#/building/' + b.id, color: b.color, items: items });
      });
      const pl = res.filter(function (e) { return e.type === 'place'; });
      if (pl.length) groups.push({ title: 'Open areas', items: pl });
      out.innerHTML = groups.map(function (g) {
        return '<section class="dgroup">' +
          '<div class="dgroup__head">' + (g.color ? '<i style="--c:' + g.color + '"></i>' : '') + '<h2>' + esc(g.title) + '</h2>' +
          (g.href ? '<a class="link" href="' + g.href + '">About ' + icon('arrow') + '</a>' : '') + '</div>' +
          '<ul class="rlist rlist--card">' + g.items.map(function (e) { return ritem(e, false); }).join('') + '</ul></section>';
      }).join('');
    }
    function sync() {
      const p = new URLSearchParams();
      if (q) p.set('q', q);
      if (cat) p.set('cat', cat);
      const s = p.toString();
      history.replaceState(null, '', '#/directory' + (s ? '?' + s : ''));
    }

    input.addEventListener('input', function () { q = input.value; render(); sync(); });
    view.querySelector('.chips').addEventListener('click', function (e) {
      const b = e.target.closest('.chip');
      if (!b) return;
      cat = b.getAttribute('data-cat');
      view.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      render(); sync();
    });
    render();
    if (q && window.matchMedia('(pointer: fine)').matches) input.focus();
    return {};
  }

  function GuideView(arg, params) {
    setTitle('Where do I go?');
    const grades = ['g7', 'g8', 'g9', 'g10', 'g11', 'g12'];
    const toc = [['classrooms', 'Classrooms']].concat(D.guide.map(function (g) { return [g.id, g.title]; })).concat([['buildings', 'Buildings']]);

    view.innerHTML =
      '<header class="page-head"><p class="eyebrow">Wayfinding guide</p><h1>Where do I go?</h1>' +
      '<p>Pick what you need. Each answer points to the right room; tap <strong>Directions</strong> to see the way on the map, starting from the Covered Court.</p></header>' +
      '<nav class="chips chips--toc" aria-label="Guide sections">' + toc.map(function (t) {
        return '<button type="button" class="chip" data-go="' + t[0] + '">' + esc(t[1]) + '</button>';
      }).join('') + '</nav>' +

      '<section class="section" id="g-classrooms">' +
        '<div class="section__head"><h2>Find your classroom</h2></div>' +
        '<p class="lead">Sections are named after scientists and thinkers. Find your grade below, then tap your section.</p>' +
        '<div class="gradegrid">' + grades.map(function (g) {
          const c = CAT[g];
          const rows = D.buildings.map(function (b) {
            const secs = b.rooms.filter(function (r) { return r.cat === g; });
            if (!secs.length) return '';
            return '<div class="grow"><span class="grow__b">' + esc(b.name) + '</span><span class="grow__s">' +
              secs.map(function (r) { return '<a href="#/room/' + r.id + '">' + esc(r.section) + '</a>'; }).join('') + '</span></div>';
          }).join('');
          return '<article class="gcard" style="--c:' + c.color + ';--c2:' + c.grad[1] + '"><header><strong>' + esc(c.label) + '</strong></header>' + rows + '</article>';
        }).join('') + '</div>' +
      '</section>' +

      D.guide.map(function (g) {
        return '<section class="section" id="g-' + g.id + '"><div class="section__head"><h2>' + esc(g.title) + '</h2></div>' +
          '<div class="qgrid">' + g.items.map(function (it) {
            const e = D.entity(it.to);
            return '<article class="qcard">' +
              '<p class="qcard__q">' + esc(it.q) + '</p>' +
              '<div class="qcard__a">' + swatch(e) + '<div><strong>' + esc(e.name) + '</strong><small>' + esc(e.type === 'place' ? 'Open area' : bName(e.b)) + '</small></div></div>' +
              '<p class="qcard__d">' + esc(it.a || describe(e)) + '</p>' +
              '<div class="actions"><a class="btn btn--primary btn--sm" href="' + dirLink(e.id) + '">' + icon('route') + 'Directions</a>' +
              '<a class="btn btn--sm" href="#/room/' + e.id + '">Details</a></div>' +
            '</article>';
          }).join('') + '</div></section>';
      }).join('') +

      '<section class="section" id="g-buildings"><div class="section__head"><h2>The buildings at a glance</h2></div>' +
        '<div class="blist">' + D.buildings.map(function (b) {
          return '<article class="bline" style="--accent:' + b.color + '">' +
            '<header><h3>' + esc(b.name) + ' <span>Building</span></h3><span class="gchips">' + gradeChips(b) + '</span></header>' +
            '<p class="bline__tag">' + esc(b.tagline) + '</p>' +
            '<p>' + esc(b.description) + '</p>' +
            '<p class="bline__how"><strong>How to get there:</strong> ' + esc(b.directions) + '</p>' +
            '<div class="actions"><a class="btn btn--sm btn--primary" href="' + dirLink('b-' + b.id) + '">' + icon('route') + 'Directions</a>' +
            '<a class="btn btn--sm" href="#/building/' + b.id + '">Rooms</a></div>' +
          '</article>';
        }).join('') + '</div></section>';

    function go(id, smooth) {
      const el = document.getElementById('g-' + id);
      if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    }
    view.querySelector('.chips--toc').addEventListener('click', function (e) {
      const b = e.target.closest('[data-go]');
      if (b) go(b.getAttribute('data-go'), true);
    });
    const sec = params.get('s');
    if (sec) requestAnimationFrame(function () { go(sec, false); });
    return { keepScroll: !!sec };
  }

  function BuildingView(id) {
    const b = buildingById.get(id);
    if (!b) return NotFound();
    setTitle(b.name + ' Building');
    const groups = [];
    D.catOrder.forEach(function (k) {
      const items = b.rooms.filter(function (r) { return r.cat === k; }).sort(byOrder);
      if (items.length) groups.push({ k: k, items: items });
    });
    const label = function (k) { const c = CAT[k]; return c.kind === 'classroom' ? c.label + ' classrooms' : c.label === 'Facility' ? 'Facilities' : c.label === 'Laboratory' ? 'Laboratories' : c.label + 's'; };

    view.innerHTML =
      '<a class="back" href="#/directory">' + icon('back') + 'Directory</a>' +
      '<header class="bhead" style="--accent:' + b.color + '">' +
        '<p class="eyebrow">Building</p>' +
        '<h1>' + esc(b.name) + ' <span>Building</span></h1>' +
        '<p class="bhead__tag">' + esc(b.tagline) + '</p>' +
        '<div class="gchips">' + gradeChips(b) + '</div>' +
      '</header>' +
      '<div class="minimap" data-minimap="b-' + b.id + '" data-clickable data-pad="18" role="group" aria-label="Floor plan of the ' + esc(b.name) + ' Building. Tap a room."></div>' +
      '<p class="hint">' + icon('info') + 'Tap a room on the plan to open it.</p>' +
      '<div class="cols">' +
        '<section class="card"><h2>About</h2><p>' + esc(b.description) + '</p></section>' +
        '<section class="card"><h2>How to get there</h2><p>' + esc(b.directions) + '</p>' +
          '<div class="actions"><a class="btn btn--primary" href="' + dirLink('b-' + b.id) + '">' + icon('route') + 'Show route</a>' +
          '<a class="btn" href="#/map?room=b-' + b.id + '">' + icon('map') + 'View on map</a></div></section>' +
      '</div>' +
      '<section class="section"><div class="section__head"><h2>Rooms</h2><span class="muted">' + b.rooms.length + ' total</span></div>' +
        groups.map(function (g) {
          return '<h3 class="subhead">' + esc(label(g.k)) + '</h3><ul class="rlist rlist--card">' + g.items.map(function (e) { return ritem(e, false); }).join('') + '</ul>';
        }).join('') +
      '</section>';

    const maps = [];
    mountMinis(view, maps);
    return { destroy: function () { maps.forEach(function (m) { m.destroy(); }); } };
  }

  function RoomView(id) {
    const e = D.entity(id);
    if (!e || e.type === 'building') {
      if (e && e.type === 'building') { location.replace('#/building/' + e.b); return {}; }
      return NotFound();
    }
    setTitle(e.name);
    const b = buildingById.get(e.b);
    const nb = e.type === 'room' ? neighbors(e) : [];
    const loc = locationText(e);
    const others = b ? b.rooms.filter(function (r) { return r.id !== e.id && nb.indexOf(r) === -1; }).sort(byOrder) : [];
    const focus = b ? 'b-' + b.id : e.id;

    view.innerHTML =
      '<a class="back" href="' + (b ? '#/building/' + b.id : '#/directory') + '">' + icon('back') + (b ? esc(b.name) + ' Building' : 'Directory') + '</a>' +
      '<header class="rhead">' + swatch(e, true) +
        '<div><p class="eyebrow">' + esc(typeLabel(e)) + '</p><h1>' + esc(e.name) + '</h1>' +
        '<p class="rhead__b">' + (b ? '<a href="#/building/' + b.id + '">' + esc(b.name) + ' Building</a>' : 'Open area') + (e.hint ? ' · ' + esc(e.hint) : '') + '</p></div>' +
      '</header>' +
      '<div class="actions actions--main">' +
        '<a class="btn btn--primary btn--lg" href="' + dirLink(e.id) + '">' + icon('route') + 'Get directions</a>' +
        '<a class="btn btn--lg" href="#/map?room=' + e.id + '">' + icon('map') + 'Show on map</a>' +
      '</div>' +
      '<div class="minimap" data-minimap="' + focus + '" data-selected="' + e.id + '" data-clickable data-pad="' + (b ? 18 : 120) + '" role="group" aria-label="Location of ' + esc(e.name) + '"></div>' +
      '<div class="cols">' +
        '<section class="card"><h2>Where it is</h2>' +
          '<dl class="facts">' +
            (b ? '<dt>Building</dt><dd><a href="#/building/' + b.id + '">' + esc(b.name) + ' Building</a></dd>' : '') +
            (loc ? '<dt>Location</dt><dd>' + esc(loc) + '</dd>' : '') +
            '<dt>Type</dt><dd>' + esc(typeLabel(e)) + '</dd>' +
          '</dl></section>' +
        '<section class="card"><h2>' + (b ? 'Getting to the ' + esc(b.name) + ' Building' : 'About') + '</h2>' +
          '<p>' + esc(describe(e)) + '</p>' +
          (b ? '<p class="muted">' + esc(b.directions) + '</p>' : '') +
        '</section>' +
      '</div>' +
      (nb.length ? '<section class="section"><div class="section__head"><h2>Right next to it</h2></div><ul class="rlist rlist--card">' + nb.map(function (n) { return ritem(n, false); }).join('') + '</ul></section>' : '') +
      (others.length ? '<section class="section"><div class="section__head"><h2>Also in the ' + esc(b.name) + ' Building</h2></div><ul class="rlist rlist--card">' + others.map(function (n) { return ritem(n, false); }).join('') + '</ul></section>' : '');

    const maps = [];
    mountMinis(view, maps);
    return { destroy: function () { maps.forEach(function (m) { m.destroy(); }); } };
  }

  function entityOptions() {
    const o = function (id, label) { return '<option value="' + esc(id) + '">' + esc(label) + '</option>'; };
    let h = '<optgroup label="Open areas">' + D.places.map(function (p) { return o(p.id, p.name); }).join('') + '</optgroup>';
    h += '<optgroup label="Buildings">' + D.buildings.map(function (b) { return o('b-' + b.id, b.name + ' Building'); }).join('') + '</optgroup>';
    D.buildings.forEach(function (b) {
      h += '<optgroup label="' + esc(b.name) + ' Building">' + b.rooms.slice().sort(byOrder).map(function (r) { return o(r.id, displayName(r)); }).join('') + '</optgroup>';
    });
    return h;
  }

  function MapView(arg, params) {
    setTitle('Campus map');
    const legend = [['g7'], ['g8'], ['g9'], ['g10'], ['g11'], ['g12'], ['faculty', 'Faculty Offices'], ['other', 'Other Facilities']];
    const opts = entityOptions();
    view.innerHTML =
      '<div class="mapview">' +
        '<div class="mapview__canvas" data-js="canvas"></div>' +
        '<div class="mapbar">' +
          '<div class="mapbar__search">' + icon('search') +
            '<input type="search" data-js="q" placeholder="Search the map" aria-label="Search the map" autocomplete="off" enterkeyhint="search">' +
            '<button class="iconbtn" type="button" data-js="toggleRoute" aria-pressed="false" aria-label="Directions" title="Directions">' + icon('route') + '</button>' +
          '</div>' +
          '<ul class="suggest" data-js="suggest" role="listbox" hidden></ul>' +
          '<div class="mapbar__route" data-js="routePanel" hidden>' +
            '<label class="field"><span class="field__dot field__dot--from"></span><span class="sr">From</span><select data-js="from" aria-label="From">' + opts + '</select></label>' +
            '<button class="iconbtn iconbtn--sm" type="button" data-js="swap" aria-label="Swap start and destination" title="Swap">' + icon('swap') + '</button>' +
            '<label class="field"><span class="field__dot field__dot--to"></span><span class="sr">To</span><select data-js="to" aria-label="To"><option value="">Choose destination…</option>' + opts + '</select></label>' +
          '</div>' +
        '</div>' +
        '<div class="mapctrls">' +
          '<button class="iconbtn" type="button" data-js="zin" aria-label="Zoom in" title="Zoom in">' + icon('plus') + '</button>' +
          '<button class="iconbtn" type="button" data-js="zout" aria-label="Zoom out" title="Zoom out">' + icon('minus') + '</button>' +
          '<button class="iconbtn" type="button" data-js="fit" aria-label="Show whole campus" title="Whole campus">' + icon('expand') + '</button>' +
          '<button class="iconbtn" type="button" data-js="legendBtn" aria-expanded="false" aria-label="Legend" title="Legend">' + icon('layers') + '</button>' +
        '</div>' +
        '<div class="legend" data-js="legend" hidden>' +
          '<div class="legend__head"><strong>Legend</strong><span class="muted">Tap to highlight</span></div>' +
          legend.map(function (l) {
            const c = CAT[l[0]];
            const name = l[1] || (c.label + ' Classroom');
            const cls = l[0] === 'other' ? 'lg--other' : l[0] === 'faculty' ? 'lg--faculty' : '';
            const st = c && c.grad ? ' style="--c:' + c.grad[0] + ';--c2:' + c.grad[1] + '"' : '';
            return '<button type="button" class="lg ' + cls + '" data-f="' + l[0] + '" aria-pressed="false"><i' + st + '></i>' + esc(name) + '</button>';
          }).join('') +
        '</div>' +
        '<section class="sheet" data-js="sheet" hidden aria-live="polite"></section>' +
      '</div>';

    const $ = function (k) { return view.querySelector('[data-js="' + k + '"]'); };
    const els = {
      canvas: $('canvas'), q: $('q'), suggest: $('suggest'), toggle: $('toggleRoute'), panel: $('routePanel'),
      from: $('from'), to: $('to'), swap: $('swap'), sheet: $('sheet'), legend: $('legend'), legendBtn: $('legendBtn')
    };
    let selected = null, routeOn = false;
    const filters = new Set();

    function insets() {
      const c = els.canvas.getBoundingClientRect();
      const z = { top: 8, right: 8, bottom: 8, left: 8 };
      [view.querySelector('.mapbar'), els.sheet].forEach(function (el) {
        if (!el || el.hidden) return;
        const r = el.getBoundingClientRect();
        if (r.width < c.width * 0.6) z.left = Math.max(z.left, r.right - c.left + 8);
        else if (r.top - c.top < c.height / 2) z.top = Math.max(z.top, r.bottom - c.top + 8);
        else z.bottom = Math.max(z.bottom, c.bottom - r.top + 8);
      });
      z.right = 60;
      return z;
    }
    const map = new window.CampusMap(els.canvas, { onSelect: onTap, onBackground: onBackground, pad: 24, insets: insets });
    const savedFrom = store.get('lcshs.from', 'court');
    els.from.value = D.entity(savedFrom) ? savedFrom : 'court';

    function onTap(id) {
      if (routeOn) { els.to.value = id; runRoute(); }
      else select(id, false);
    }
    function onBackground() {
      if (!routeOn && selected) clearSelection();
    }
    function sync() {
      let h = '#/map';
      if (routeOn && els.to.value) h += '?from=' + encodeURIComponent(els.from.value) + '&to=' + encodeURIComponent(els.to.value);
      else if (selected) h += '?room=' + encodeURIComponent(selected);
      if (location.hash !== h) history.replaceState(null, '', h);
    }
    function select(id, focus) {
      selected = id;
      renderInfo(id);
      map.select(id, { focus: focus !== false });
      sync();
    }
    function clearSelection() {
      selected = null;
      map.select(null);
      hideSheet();
      sync();
    }
    function setRoute(on) {
      routeOn = on;
      els.panel.hidden = !on;
      els.toggle.setAttribute('aria-pressed', String(on));
      els.toggle.classList.toggle('is-on', on);
      if (!on) {
        map.clearRoute();
        if (selected) { map.select(selected); renderInfo(selected); } else hideSheet();
        sync();
      }
    }
    function runRoute() {
      const f = els.from.value, t = els.to.value;
      store.set('lcshs.from', f);
      if (!t) { map.clearRoute(); map.select(null); hideSheet(); selected = null; sync(); return; }
      selected = t;
      if (f === t) { renderInfo(t, true); map.select(t, { focus: true }); sync(); return; }
      renderRoute(f, t);
      map.showRoute(f, t);
      sync();
    }

    function showSheet(html) {
      els.sheet.innerHTML =
        '<button class="iconbtn iconbtn--sm sheet__min" type="button" data-act="min" aria-expanded="true" aria-label="Collapse panel">' + icon('down') + '</button>' +
        '<button class="iconbtn iconbtn--sm sheet__close" type="button" data-act="close" aria-label="Close">' + icon('x') + '</button>' + html;
      els.sheet.classList.toggle('is-collapsed', els.canvas.getBoundingClientRect().height < 600);
      els.sheet.querySelector('.sheet__min').setAttribute('aria-expanded', String(!els.sheet.classList.contains('is-collapsed')));
      els.sheet.hidden = false;
      els.sheet.scrollTop = 0;
    }
    function refocus() {
      if (routeOn && els.to.value && els.from.value !== els.to.value) map.showRoute(els.from.value, els.to.value);
      else if (selected) map.select(selected, { focus: true });
    }
    function hideSheet() { els.sheet.hidden = true; els.sheet.innerHTML = ''; }

    function renderInfo(id, same) {
      const e = D.entity(id);
      if (!e) return hideSheet();
      if (e.type === 'building') {
        const b = buildingById.get(e.b);
        showSheet(
          '<div class="sheet__head">' + swatch(e, true) + '<div><p class="eyebrow">' + esc(b.tagline) + '</p><h2>' + esc(e.name) + '</h2></div></div>' +
          '<p class="sheet__text">' + esc(b.summary) + '</p>' +
          '<div class="actions"><button class="btn btn--primary" type="button" data-act="directions">' + icon('route') + 'Directions</button>' +
          '<a class="btn" href="#/building/' + b.id + '">Rooms &amp; details</a></div>');
        return;
      }
      const loc = locationText(e);
      showSheet(
        '<div class="sheet__head">' + swatch(e, true) + '<div><p class="eyebrow">' + esc(typeLabel(e)) + '</p><h2>' + esc(e.name) + '</h2>' +
        '<p class="sheet__sub">' + esc(e.type === 'place' ? 'Open area' : bName(e.b)) + (e.hint ? ' · ' + esc(e.hint) : '') + '</p></div></div>' +
        (same ? '<p class="sheet__note">' + icon('info') + 'You are already here.</p>' : '') +
        (loc ? '<p class="sheet__text">' + esc(loc) + '</p>' : '') +
        (e.desc ? '<p class="sheet__text muted">' + esc(e.desc) + '</p>' : '') +
        '<div class="actions">' + (same ? '' : '<button class="btn btn--primary" type="button" data-act="directions">' + icon('route') + 'Directions</button>') +
        '<a class="btn" href="#/room/' + e.id + '">Details</a></div>');
    }

    function renderRoute(f, t) {
      const a = D.entity(f), b = D.entity(t);
      const B = b.b ? buildingById.get(b.b) : null;
      const steps = [];
      steps.push('Start at the <strong>' + esc(a.name) + '</strong>' + (a.b && a.type !== 'building' ? ' (' + esc(bName(a.b)) + ')' : '') + '.');
      if (b.type === 'building') {
        steps.push(f === 'court' ? esc(B.directions) : 'Follow the highlighted walkway to the <strong>' + esc(b.name) + '</strong>.');
      } else if (b.type === 'place') {
        steps.push('Follow the highlighted walkway to the <strong>' + esc(b.name) + '</strong>. ' + esc(b.where));
      } else {
        if (a.b !== b.b || a.type === 'building') {
          steps.push(f === 'court' ? esc(B.directions) : 'Follow the highlighted walkway to the <strong>' + esc(B.name) + ' Building</strong>.');
        } else {
          steps.push('Stay in the <strong>' + esc(B.name) + ' Building</strong> and follow the highlighted path.');
        }
        const loc = locationText(b);
        steps.push('<strong>' + esc(b.name) + '</strong> is in the ' + esc(B.name) + ' Building' + (loc ? ': ' + esc(loc.charAt(0).toLowerCase() + loc.slice(1)) : '.'));
      }
      showSheet(
        '<div class="sheet__head"><span class="sw sw--route sw--big">' + icon('route') + '</span><div><p class="eyebrow">Directions</p>' +
        '<h2 class="sheet__route">' + esc(a.short || a.name) + ' ' + icon('arrow') + ' ' + esc(b.name) + '</h2></div></div>' +
        '<ol class="steps">' + steps.map(function (st) { return '<li>' + st + '</li>'; }).join('') + '</ol>' +
        '<p class="sheet__legend"><span class="k k--walk"></span>Walkway <span class="k k--in"></span>Inside the building</p>' +
        '<div class="actions"><a class="btn btn--primary btn--sm" href="#/room/' + (b.type === 'building' ? 'b-' + b.b : b.id) + '">About ' + esc(b.type === 'building' ? 'the building' : 'this place') + '</a>' +
        '<button class="btn btn--sm" type="button" data-act="end">End route</button></div>');
    }

    // Sheet actions
    els.sheet.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const act = btn.getAttribute('data-act');
      if (act === 'min') {
        const collapsed = els.sheet.classList.toggle('is-collapsed');
        btn.setAttribute('aria-expanded', String(!collapsed));
        btn.setAttribute('aria-label', collapsed ? 'Expand panel' : 'Collapse panel');
        refocus();
        return;
      }
      if (act === 'close' || act === 'end') {
        if (routeOn) { els.to.value = ''; setRoute(false); selected = null; map.select(null); hideSheet(); sync(); }
        else clearSelection();
      } else if (act === 'directions' && selected) {
        els.to.value = selected;
        if (els.from.value === selected) els.from.value = selected === 'court' ? 'stage' : 'court';
        setRoute(true);
        runRoute();
      }
    });

    // Route panel
    els.toggle.addEventListener('click', function () {
      if (routeOn) { setRoute(false); return; }
      if (selected && !els.to.value) els.to.value = selected;
      setRoute(true);
      if (els.to.value) runRoute(); else els.to.focus();
    });
    els.from.addEventListener('change', runRoute);
    els.to.addEventListener('change', runRoute);
    els.swap.addEventListener('click', function () {
      if (!els.to.value) return;
      const f = els.from.value;
      els.from.value = els.to.value;
      els.to.value = f;
      runRoute();
    });

    // Search with suggestions
    let sugg = [];
    function renderSuggest() {
      const v = els.q.value.trim();
      sugg = v ? search(v).slice(0, 7) : [];
      if (!sugg.length) { els.suggest.hidden = !v; els.suggest.innerHTML = v ? '<li class="suggest__empty">No match for “' + esc(v) + '”</li>' : ''; return; }
      els.suggest.innerHTML = sugg.map(function (e, i) {
        return '<li><button type="button" role="option" data-id="' + e.id + '"' + (i === 0 ? ' class="is-first"' : '') + '>' + swatch(e) +
          '<span><strong>' + esc(e.name) + '</strong><small>' + esc([typeLabel(e), e.hint, bName(e.b)].filter(Boolean).join(' · ')) + '</small></span></button></li>';
      }).join('');
      els.suggest.hidden = false;
    }
    function pick(id) {
      els.q.value = '';
      els.suggest.hidden = true;
      els.q.blur();
      if (routeOn) { els.to.value = id; runRoute(); } else select(id, true);
    }
    els.q.addEventListener('input', renderSuggest);
    els.q.addEventListener('focus', renderSuggest);
    els.q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); if (sugg[0]) pick(sugg[0].id); }
      else if (e.key === 'Escape') { els.suggest.hidden = true; els.q.blur(); }
    });
    els.q.addEventListener('blur', function () { setTimeout(function () { els.suggest.hidden = true; }, 160); });
    els.suggest.addEventListener('mousedown', function (e) { e.preventDefault(); });
    els.suggest.addEventListener('click', function (e) {
      const b = e.target.closest('[data-id]');
      if (b) pick(b.getAttribute('data-id'));
    });

    // Controls
    $('zin').addEventListener('click', function () { map.zoomCenter(1.6); });
    $('zout').addEventListener('click', function () { map.zoomCenter(1 / 1.6); });
    $('fit').addEventListener('click', function () { map.fit(true); });
    els.legendBtn.addEventListener('click', function () {
      const open = els.legend.hidden;
      els.legend.hidden = !open;
      els.legendBtn.setAttribute('aria-expanded', String(open));
      els.legendBtn.classList.toggle('is-on', open);
    });
    els.legend.addEventListener('click', function (e) {
      const b = e.target.closest('[data-f]');
      if (!b) return;
      const f = b.getAttribute('data-f');
      const keys = f === 'other' ? ['office', 'lab', 'facility', 'place'] : [f];
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      keys.forEach(function (k) { if (on) filters.add(k); else filters.delete(k); });
      map.setFilter(filters);
    });

    function applyParams(p) {
      const to = p.get('to'), from = p.get('from'), room = p.get('room');
      if (to && D.entity(to)) {
        if (from && D.entity(from)) els.from.value = from;
        els.to.value = to;
        if (els.from.value === to) els.from.value = to === 'court' ? 'stage' : 'court';
        setRoute(true);
        runRoute();
      } else if (room && D.entity(room)) {
        if (routeOn) { els.to.value = ''; routeOn = false; els.panel.hidden = true; els.toggle.setAttribute('aria-pressed', 'false'); els.toggle.classList.remove('is-on'); }
        select(room, true);
      }
    }
    requestAnimationFrame(function () { applyParams(params); });

    return {
      update: applyParams,
      destroy: function () { map.destroy(); }
    };
  }

  function NotFound() {
    setTitle('Not found');
    view.innerHTML = '<div class="empty empty--page">' + icon('compass') + '<h1>Page not found</h1><p class="muted">That room or page does not exist in the directory.</p>' +
      '<div class="actions"><a class="btn btn--primary" href="#/">Go home</a><a class="btn" href="#/directory">Open directory</a></div></div>';
    return {};
  }

  /* ---------- Router ---------- */
  const views = { '': HomeView, home: HomeView, map: MapView, directory: DirectoryView, guide: GuideView, building: BuildingView, room: RoomView };
  const tabOf = { '': 'home', home: 'home', map: 'map', directory: 'directory', building: 'directory', room: 'directory', guide: 'guide' };
  let current = null;

  function parse() {
    const h = (location.hash || '#/').slice(1);
    const qi = h.indexOf('?');
    const path = qi === -1 ? h : h.slice(0, qi);
    const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
    return { name: parts[0] || '', arg: parts[1], params: new URLSearchParams(qi === -1 ? '' : h.slice(qi + 1)) };
  }

  function render() {
    const r = parse();
    if (current && current.name === r.name && current.arg === r.arg && current.update) { current.update(r.params); return; }
    if (current && current.destroy) current.destroy();
    const V = views[r.name] || NotFound;
    document.body.setAttribute('data-view', r.name || 'home');
    view.innerHTML = '';
    current = V(r.arg, r.params) || {};
    current.name = r.name;
    current.arg = r.arg;
    const tab = tabOf[r.name] || '';
    document.querySelectorAll('.tab').forEach(function (t) {
      const on = t.getAttribute('data-tab') === tab;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    if (!current.keepScroll) window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  function currentTheme() {
    const t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function paintThemeBtn() {
    const dark = currentTheme() === 'dark';
    themeBtn.innerHTML = icon(dark ? 'sun' : 'moon');
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0e0e10' : '#ffffff');
  }
  const savedTheme = store.get('lcshs.theme', '');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  themeBtn.addEventListener('click', function () {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store.set('lcshs.theme', next);
    paintThemeBtn();
  });
  paintThemeBtn();

  /* ---------- Tab icons ---------- */
  document.querySelectorAll('.tab[data-icon]').forEach(function (t) {
    t.insertAdjacentHTML('afterbegin', icon(t.getAttribute('data-icon')));
  });
  const brand = document.querySelector('[data-js="brandIcon"]');
  if (brand) brand.innerHTML = icon('pin');

  render();

  /* ---------- Offline support ---------- */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* offline mode unavailable */ }); });
  }
})();
