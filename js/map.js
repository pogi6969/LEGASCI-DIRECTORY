/*
 * LEGASCI Directory: interactive campus map (SVG) and walkway routing.
 */
(function () {
  'use strict';

  const D = window.LCSHS;
  const NS = 'http://www.w3.org/2000/svg';
  let uidCounter = 0;

  function s(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  const clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Text helpers ---------- */
  function wrap(text, maxChars) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = '';
    words.forEach(function (w) {
      if (w.length > maxChars && w.indexOf('-') > 0 && !line) {
        const i = w.indexOf('-') + 1;
        lines.push(w.slice(0, i));
        w = w.slice(i);
      }
      const t = line ? line + ' ' + w : w;
      if (t.length > maxChars && line) { lines.push(line); line = w; } else line = t;
    });
    if (line) lines.push(line);
    return lines;
  }

  function label(parent, lines, cx, cy, size, cls, rot, weight) {
    const lh = size * 1.12;
    const t = s('text', {
      x: cx, y: cy, 'font-size': size, 'font-weight': weight || null, class: cls, 'text-anchor': 'middle',
      transform: rot ? 'rotate(' + rot + ' ' + cx + ' ' + cy + ')' : null
    }, parent);
    const first = -((lines.length - 1) * lh) / 2 + size * 0.36;
    lines.forEach(function (ln, i) {
      const ts = s('tspan', { x: cx, dy: i === 0 ? first : lh }, t);
      ts.textContent = ln;
    });
    return t;
  }

  function roomLines(e) {
    if (e.lines) return e.lines;
    const name = e.upper ? e.name.toUpperCase() : e.name;
    const size = e.fs || 12;
    const span = e.rot ? e.rect[3] : e.rect[2];
    return wrap(name, Math.max(4, Math.floor((span - 10) / (size * 0.6))));
  }

  /* ---------- Walkway graph & routing ---------- */
  const Router = (function () {
    const segs = D.walkways;
    const key = function (p) { return Math.round(p.x) + ',' + Math.round(p.y); };
    const nodes = new Map();
    const edges = [];

    function node(p) {
      const k = key(p);
      if (!nodes.has(k)) nodes.set(k, { k: k, x: Math.round(p.x), y: Math.round(p.y), adj: [] });
      return nodes.get(k);
    }

    function intersect(a, b) {
      const x1 = a[0], y1 = a[1], x2 = a[2], y2 = a[3];
      const x3 = b[0], y3 = b[1], x4 = b[2], y4 = b[3];
      const d = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);
      if (Math.abs(d) < 1e-9) return null;
      const t = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / d;
      const u = ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)) / d;
      const e = 1e-6;
      if (t < -e || t > 1 + e || u < -e || u > 1 + e) return null;
      return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
    }

    const pts = segs.map(function (sg) { return [{ x: sg[0], y: sg[1] }, { x: sg[2], y: sg[3] }]; });
    for (let i = 0; i < segs.length; i++) {
      for (let j = i + 1; j < segs.length; j++) {
        const p = intersect(segs[i], segs[j]);
        if (p) { pts[i].push(p); pts[j].push(p); }
      }
    }
    segs.forEach(function (sg, i) {
      const dx = sg[2] - sg[0], dy = sg[3] - sg[1];
      const list = pts[i]
        .map(function (p) { return { p: p, t: Math.abs(dx) > Math.abs(dy) ? (p.x - sg[0]) / dx : (p.y - sg[1]) / dy }; })
        .sort(function (a, b) { return a.t - b.t; });
      for (let k = 1; k < list.length; k++) {
        const a = node(list[k - 1].p), b = node(list[k].p);
        if (a === b) continue;
        const len = Math.hypot(a.x - b.x, a.y - b.y);
        a.adj.push({ n: b, w: len });
        b.adj.push({ n: a, w: len });
        edges.push({ a: a, b: b });
      }
    });

    function nearest(p) {
      let best = null;
      edges.forEach(function (ed) {
        const ax = ed.a.x, ay = ed.a.y, bx = ed.b.x, by = ed.b.y;
        const vx = bx - ax, vy = by - ay;
        const l2 = vx * vx + vy * vy || 1;
        const t = clamp(((p.x - ax) * vx + (p.y - ay) * vy) / l2, 0, 1);
        const q = { x: ax + t * vx, y: ay + t * vy };
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (!best || d < best.d) best = { d: d, q: q, edge: ed };
      });
      return best;
    }

    function route(p1, p2) {
      const A = nearest(p1), B = nearest(p2);
      const S = { k: 'S', x: A.q.x, y: A.q.y, adj: [] };
      const T = { k: 'T', x: B.q.x, y: B.q.y, adj: [] };
      const link = function (u, v) { const w = Math.hypot(u.x - v.x, u.y - v.y); u.adj.push({ n: v, w: w }); v.adj.push({ n: u, w: w }); };
      const extra = [];
      const temp = function (u, v) { const w = Math.hypot(u.x - v.x, u.y - v.y); u.adj.push({ n: v, w: w }); extra.push([v, u, w]); };

      // connect the temporary start / end points into the graph
      temp(S, A.edge.a); temp(S, A.edge.b);
      temp(T, B.edge.a); temp(T, B.edge.b);
      extra.forEach(function (x) { x[0].adj.push({ n: x[1], w: x[2], tmp: true }); });
      if (A.edge === B.edge) link(S, T);

      const dist = new Map([[S, 0]]);
      const prev = new Map();
      const open = new Set([S]);
      const done = new Set();
      while (open.size) {
        let u = null, best = Infinity;
        open.forEach(function (n) { const d = dist.get(n); if (d < best) { best = d; u = n; } });
        open.delete(u);
        if (u === T) break;
        done.add(u);
        u.adj.forEach(function (e) {
          if (done.has(e.n)) return;
          const nd = best + e.w;
          if (nd < (dist.has(e.n) ? dist.get(e.n) : Infinity)) { dist.set(e.n, nd); prev.set(e.n, u); open.add(e.n); }
        });
      }
      // remove temporary links
      nodes.forEach(function (n) { n.adj = n.adj.filter(function (e) { return !e.tmp; }); });

      const path = [];
      let cur = T;
      while (cur) { path.unshift({ x: cur.x, y: cur.y }); cur = prev.get(cur); }
      if (path[0].x !== S.x || path[0].y !== S.y) path.unshift({ x: S.x, y: S.y });
      // drop consecutive duplicates and collinear midpoints
      const clean = [];
      path.forEach(function (p) {
        const last = clean[clean.length - 1];
        if (last && Math.abs(last.x - p.x) < 0.5 && Math.abs(last.y - p.y) < 0.5) return;
        if (clean.length >= 2) {
          const a = clean[clean.length - 2], b = last;
          if ((Math.abs(a.x - b.x) < 0.5 && Math.abs(b.x - p.x) < 0.5) || (Math.abs(a.y - b.y) < 0.5 && Math.abs(b.y - p.y) < 0.5)) clean.pop();
        }
        clean.push(p);
      });
      return { walk: clean, length: dist.get(T) || 0 };
    }

    return { route: route };
  })();

  /* ---------- Campus map ---------- */
  function CampusMap(host, opts) {
    this.host = host;
    this.o = Object.assign({ mini: false, pad: 30, labels: true, onSelect: null, onBackground: null, focus: null, selected: null }, opts || {});
    this.uid = 'cm' + (++uidCounter);
    this.full = D.map.bounds;
    this.home = this.o.focus ? rectOf(this.o.focus) : this.full;
    this.vb = { x: this.home[0], y: this.home[1], w: this.home[2], h: this.home[3] };
    this.groups = new Map();
    this.markers = [];
    this.svg = s('svg', {
      class: 'cmap' + (this.o.mini ? ' cmap--mini' : '') + (this.o.onSelect ? ' cmap--clickable' : ''),
      preserveAspectRatio: 'xMidYMid meet',
      role: this.o.mini && !this.o.onSelect ? 'img' : 'application',
      'aria-label': 'Campus map of ' + D.school.name
    });
    this.draw();
    host.appendChild(this.svg);
    this.sized = false;
    this.onResize();
    if (this.o.selected) this.select(this.o.selected);
    if (!this.o.mini) this.bindGestures();
    else if (this.o.onSelect) this.bindClicks();
    this.bindKeys();
    const self = this;
    this.ro = new ResizeObserver(function () { self.onResize(); });
    this.ro.observe(host);
  }

  function rectOf(x) {
    if (Array.isArray(x)) return x;
    const e = D.entity(x);
    return e ? e.rect : D.map.bounds;
  }

  CampusMap.prototype.draw = function () {
    const svg = this.svg, id = this.uid, o = this.o;
    const defs = s('defs', null, svg);
    const pat = s('pattern', { id: id + '-grid', width: 44, height: 44, patternUnits: 'userSpaceOnUse', x: 0, y: 0 }, defs);
    s('path', { d: 'M44 0H0V44', class: 'grid-line' }, pat);
    Object.keys(D.categories).forEach(function (k) {
      const c = D.categories[k];
      if (!c.grad) return;
      const lg = s('linearGradient', { id: id + '-' + k, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      s('stop', { offset: 0, 'stop-color': c.grad[0] }, lg);
      s('stop', { offset: 1, 'stop-color': c.grad[1] }, lg);
    });

    s('rect', { x: -3000, y: -3000, width: 8000, height: 8000, class: 'map-bg' }, svg);
    s('rect', { x: -3000, y: -3000, width: 8000, height: 8000, fill: 'url(#' + id + '-grid)' }, svg);

    const lanes = s('g', { class: 'lanes' }, svg);
    D.walkways.forEach(function (w) { s('line', { x1: w[0], y1: w[1], x2: w[2], y2: w[3] }, lanes); });

    const self = this;
    const interactive = !!o.onSelect;
    const cellsG = s('g', { class: 'cells' }, svg);

    function addEntity(e) {
      const cat = D.categories[e.cat];
      const g = s('g', {
        class: 'room cat-' + e.cat + (cat.kind === 'other' || cat.kind === 'place' ? ' is-other' : ''),
        'data-id': e.id,
        tabindex: interactive ? 0 : null,
        role: interactive ? 'button' : null,
        'aria-label': interactive ? e.name + (e.hint ? ' (' + e.hint + ')' : '') : null
      }, cellsG);
      const r = e.rect;
      const style = cat.grad ? 'fill:url(#' + id + '-' + e.cat + ')' : null;
      s('rect', { x: r[0], y: r[1], width: r[2], height: r[3], class: 'cell' + (e.dashed ? ' cell--dashed' : ''), style: style }, g);
      label(g, roomLines(e), r[0] + r[2] / 2, r[1] + r[3] / 2, e.fs || 12, 'rl', e.rot, e.weight);
      self.groups.set(e.id, g);
    }

    D.places.forEach(addEntity);
    D.buildings.forEach(function (b) {
      b.halls.forEach(function (h) { s('rect', { x: h[0], y: h[1], width: h[2], height: h[3], class: 'cell cell--hall' }, cellsG); });
      b.rooms.forEach(addEntity);
    });

    if (o.labels) {
      const lg = s('g', { class: 'blabels' }, svg);
      D.buildings.forEach(function (b) {
        const L = b.label, size = 34;
        const g = s('g', { transform: L.vertical ? 'rotate(90 ' + L.x + ' ' + L.y + ')' : null }, lg);
        s('circle', { cx: L.x + 6, cy: L.y - size * 0.34, r: 6, class: 'bdot' }, g);
        const t = s('text', { x: L.x + 22, y: L.y, 'font-size': size, class: 'bl' }, g);
        const a = s('tspan', { 'font-weight': 800 }, t); a.textContent = b.name.toUpperCase();
        const c = s('tspan', { 'font-weight': 400 }, t); c.textContent = ' BUILDING';
      });
    }

    this.ringLayer = s('g', { class: 'ring-layer' }, svg);
    this.routeLayer = s('g', { class: 'route-layer' }, svg);
    this.markerLayer = s('g', { class: 'marker-layer' }, svg);
  };

  /* ---------- Viewport ---------- */
  CampusMap.prototype.size = function () {
    const r = this.svg.getBoundingClientRect();
    return { w: r.width, h: r.height, left: r.left, top: r.top };
  };

  CampusMap.prototype.insets = function () {
    const z = { top: 0, right: 0, bottom: 0, left: 0 };
    if (this.o.insets) Object.assign(z, this.o.insets());
    return z;
  };

  // Fit a map rect into the visible part of the map (outside floating panels).
  CampusMap.prototype.fitRect = function (rect, pad, minW) {
    const sz = this.size();
    pad = pad == null ? this.o.pad : pad;
    const cx = rect[0] + rect[2] / 2, cy = rect[1] + rect[3] / 2;
    if (sz.w < 2 || sz.h < 2) {
      const w0 = rect[2] + pad * 2, h0 = w0 * 0.7;
      return { x: cx - w0 / 2, y: cy - h0 / 2, w: w0, h: h0 };
    }
    let I = this.insets();
    let aw = sz.w - I.left - I.right, ah = sz.h - I.top - I.bottom;
    if (aw < 120 || ah < 120) { I = { top: 0, right: 0, bottom: 0, left: 0 }; aw = sz.w; ah = sz.h; }
    let k = Math.max((rect[2] + pad * 2) / aw, (rect[3] + pad * 2) / ah);
    if (minW) k = Math.max(k, minW / sz.w);
    return { x: cx - (I.left + aw / 2) * k, y: cy - (I.top + ah / 2) * k, w: sz.w * k, h: sz.h * k };
  };

  CampusMap.prototype.apply = function () {
    const v = this.vb;
    this.svg.setAttribute('viewBox', v.x.toFixed(2) + ' ' + v.y.toFixed(2) + ' ' + v.w.toFixed(2) + ' ' + v.h.toFixed(2));
    const sz = this.size();
    const k = sz.w > 1 ? v.w / sz.w : 1; // map units per screen px
    const scale = clamp(k, 0.55, 6);
    this.markers.forEach(function (m) { m.g.setAttribute('transform', 'translate(' + m.x + ' ' + m.y + ') scale(' + scale + ')'); });
  };

  CampusMap.prototype.onResize = function () {
    const sz = this.size();
    if (sz.w < 2 || sz.h < 2) return;
    if (!this.sized || this.o.mini) {
      this.sized = true;
      this.vb = this.fitRect(this.home, this.o.pad);
      this.lastW = sz.w;
      this.apply();
      return;
    }
    const cx = this.vb.x + this.vb.w / 2, cy = this.vb.y + this.vb.h / 2;
    const k = this.vb.w / (this.lastW || sz.w);
    this.vb.w = sz.w * k;
    this.vb.h = sz.h * k;
    this.vb.x = cx - this.vb.w / 2;
    this.vb.y = cy - this.vb.h / 2;
    this.lastW = sz.w;
    this.apply();
  };

  CampusMap.prototype.limits = function () {
    return { min: 160, max: Math.max(this.full[2], this.full[3]) * 1.8 };
  };

  CampusMap.prototype.clampCenter = function () {
    const f = this.full, v = this.vb;
    const cx = clamp(v.x + v.w / 2, f[0], f[0] + f[2]);
    const cy = clamp(v.y + v.h / 2, f[1], f[1] + f[3]);
    v.x = cx - v.w / 2; v.y = cy - v.h / 2;
  };

  CampusMap.prototype.zoomAt = function (factor, clientX, clientY) {
    const sz = this.size();
    if (sz.w < 2) return;
    const px = clientX - sz.left, py = clientY - sz.top;
    const k = this.vb.w / sz.w;
    const mx = this.vb.x + px * k, my = this.vb.y + py * k;
    const L = this.limits();
    const nw = clamp(this.vb.w / factor, L.min, L.max);
    const nk = nw / sz.w;
    this.vb.w = nw;
    this.vb.h = sz.h * nk;
    this.vb.x = mx - px * nk;
    this.vb.y = my - py * nk;
    this.clampCenter();
    this.apply();
  };

  CampusMap.prototype.zoomCenter = function (factor) {
    const sz = this.size();
    this.cancelAnim();
    const target = Object.assign({}, this.vb);
    const L = this.limits();
    const nw = clamp(target.w / factor, L.min, L.max);
    const cx = target.x + target.w / 2, cy = target.y + target.h / 2;
    target.w = nw; target.h = nw * (sz.h / sz.w);
    target.x = cx - target.w / 2; target.y = cy - target.h / 2;
    this.animateTo(target);
  };

  CampusMap.prototype.fit = function (animate) {
    const t = this.fitRect(this.full, this.o.pad);
    if (animate) this.animateTo(t); else { this.vb = t; this.apply(); }
  };

  CampusMap.prototype.focusRect = function (rect, pad, minW) {
    this.animateTo(this.fitRect(rect, pad == null ? 60 : pad, minW));
  };

  CampusMap.prototype.cancelAnim = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  };

  CampusMap.prototype.animateTo = function (target) {
    this.cancelAnim();
    if (reduceMotion) { this.vb = target; this.apply(); return; }
    const from = Object.assign({}, this.vb);
    const t0 = performance.now(), dur = 420;
    const self = this;
    function step(now) {
      const t = clamp((now - t0) / dur, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      self.vb = {
        x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e,
        w: from.w + (target.w - from.w) * e, h: from.h + (target.h - from.h) * e
      };
      self.apply();
      if (t < 1) self.raf = requestAnimationFrame(step); else self.raf = null;
    }
    this.raf = requestAnimationFrame(step);
  };

  /* ---------- Interaction ---------- */
  CampusMap.prototype.idAt = function (x, y) {
    const el = document.elementFromPoint(x, y);
    const g = el && el.closest ? el.closest('.room[data-id]') : null;
    return g && this.svg.contains(g) ? g.getAttribute('data-id') : null;
  };

  CampusMap.prototype.bindClicks = function () {
    const self = this;
    this.svg.addEventListener('click', function (e) {
      const g = e.target.closest('.room[data-id]');
      if (g && self.o.onSelect) self.o.onSelect(g.getAttribute('data-id'));
    });
  };

  CampusMap.prototype.bindKeys = function () {
    const self = this;
    this.svg.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const g = e.target.closest && e.target.closest('.room[data-id]');
      if (g && self.o.onSelect) { e.preventDefault(); self.o.onSelect(g.getAttribute('data-id')); }
    });
  };

  CampusMap.prototype.bindGestures = function () {
    const self = this, svg = this.svg;
    const pts = new Map();
    let down = null, moved = false, pinch = null;

    function pinchInfo() {
      const a = Array.from(pts.values());
      return { d: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1, mx: (a[0].x + a[1].x) / 2, my: (a[0].y + a[1].y) / 2 };
    }

    svg.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button > 0) return;
      try { svg.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      self.cancelAnim();
      if (pts.size === 1) { down = { x: e.clientX, y: e.clientY }; moved = false; }
      if (pts.size === 2) { pinch = pinchInfo(); moved = true; }
      svg.classList.add('is-dragging');
    });

    svg.addEventListener('pointermove', function (e) {
      if (!pts.has(e.pointerId)) return;
      const prev = pts.get(e.pointerId);
      const cur = { x: e.clientX, y: e.clientY };
      pts.set(e.pointerId, cur);
      const sz = self.size();
      const k = self.vb.w / sz.w;
      if (pts.size === 1) {
        if (!moved && Math.hypot(cur.x - down.x, cur.y - down.y) < 6) return;
        if (!moved) { moved = true; }
        self.vb.x -= (cur.x - prev.x) * k;
        self.vb.y -= (cur.y - prev.y) * k;
        self.clampCenter();
        self.apply();
      } else if (pts.size === 2 && pinch) {
        const p = pinchInfo();
        self.vb.x -= (p.mx - pinch.mx) * k;
        self.vb.y -= (p.my - pinch.my) * k;
        self.zoomAt(p.d / pinch.d, p.mx, p.my);
        pinch = p;
      }
    });

    function end(e) {
      if (!pts.has(e.pointerId)) return;
      const tap = pts.size === 1 && !moved && e.type === 'pointerup';
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = null;
      if (pts.size === 1) { const r = pts.values().next().value; down = { x: r.x, y: r.y }; }
      if (pts.size === 0) svg.classList.remove('is-dragging');
      if (tap) {
        const id = self.idAt(e.clientX, e.clientY);
        if (id && self.o.onSelect) self.o.onSelect(id);
        else if (!id && self.o.onBackground) self.o.onBackground();
      }
    }
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);

    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      self.cancelAnim();
      const f = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018));
      self.zoomAt(f, e.clientX, e.clientY);
    }, { passive: false });
  };

  /* ---------- Selection, filters, routes ---------- */
  CampusMap.prototype.ring = function (e, cls) {
    const r = e.rect, p = e.type === 'building' ? 10 : 2;
    s('rect', { x: r[0] - p, y: r[1] - p, width: r[2] + p * 2, height: r[3] + p * 2, class: 'ring-casing ' + (cls || '') }, this.ringLayer);
    s('rect', { x: r[0] - p, y: r[1] - p, width: r[2] + p * 2, height: r[3] + p * 2, class: 'ring ' + (cls || '') }, this.ringLayer);
  };

  CampusMap.prototype.select = function (id, opt) {
    opt = opt || {};
    this.groups.forEach(function (g) { g.classList.remove('is-selected'); });
    while (this.ringLayer.firstChild) this.ringLayer.removeChild(this.ringLayer.firstChild);
    if (!opt.keepRoute) this.clearRoute();
    this.selected = id || null;
    if (!id) return;
    const e = D.entity(id);
    if (!e) return;
    const g = this.groups.get(id);
    if (g) g.classList.add('is-selected');
    this.ring(e);
    if (opt.focus) {
      if (e.type === 'building') this.focusRect(e.rect, 50);
      else {
        const b = e.b ? D.buildings.find(function (x) { return x.id === e.b; }) : null;
        this.focusRect(b ? b.bbox : e.rect, 40);
      }
    }
  };

  CampusMap.prototype.setFilter = function (cats) {
    const on = cats && cats.size > 0;
    this.svg.classList.toggle('has-filter', !!on);
    this.groups.forEach(function (g, id) {
      const e = D.entity(id);
      g.classList.toggle('is-match', !!on && cats.has(e.cat));
    });
  };

  CampusMap.prototype.marker = function (p, cls, text) {
    const g = s('g', { class: 'mk ' + cls }, this.markerLayer);
    if (cls === 'mk-end') {
      s('circle', { r: 16, class: 'mk-pulse' }, g);
      s('path', { d: 'M0 0c-2-6-11-10.5-11-19a11 11 0 0 1 22 0c0 8.5-9 13-11 19z', class: 'mk-pin' }, g);
      s('circle', { cx: 0, cy: -19, r: 4.2, class: 'mk-hole' }, g);
    } else {
      s('circle', { r: 9, class: 'mk-dot' }, g);
      s('circle', { r: 3.5, class: 'mk-core' }, g);
    }
    if (text) { const t = s('title', null, g); t.textContent = text; }
    this.markers.push({ g: g, x: p.x, y: p.y });
    return g;
  };

  CampusMap.prototype.clearRoute = function () {
    while (this.routeLayer.firstChild) this.routeLayer.removeChild(this.routeLayer.firstChild);
    while (this.markerLayer.firstChild) this.markerLayer.removeChild(this.markerLayer.firstChild);
    this.markers = [];
    this.svg.classList.remove('has-route');
  };

  CampusMap.prototype.showRoute = function (fromId, toId) {
    const a = D.entity(fromId), b = D.entity(toId);
    if (!a || !b) return null;
    this.select(null);
    const pa = D.center(a), pb = D.center(b);
    const r = Router.route(pa, pb);
    const L = this.routeLayer;
    const pts = r.walk.map(function (p) { return p.x + ',' + p.y; }).join(' ');

    this.ring(a, 'ring--from');
    this.ring(b);
    const gb = this.groups.get(toId);
    if (gb) gb.classList.add('is-selected');

    const first = r.walk[0], last = r.walk[r.walk.length - 1];
    [[pa, first], [last, pb]].forEach(function (seg) {
      if (Math.hypot(seg[0].x - seg[1].x, seg[0].y - seg[1].y) < 2) return;
      s('line', { x1: seg[0].x, y1: seg[0].y, x2: seg[1].x, y2: seg[1].y, class: 'route-link-casing' }, L);
      s('line', { x1: seg[0].x, y1: seg[0].y, x2: seg[1].x, y2: seg[1].y, class: 'route-link' }, L);
    });
    s('polyline', { points: pts, class: 'route-casing' }, L);
    s('polyline', { points: pts, class: 'route-line' }, L);
    s('polyline', { points: pts, class: 'route-flow' }, L);

    this.marker(pa, 'mk-start', 'Start: ' + a.name);
    this.marker(pb, 'mk-end', 'Destination: ' + b.name);
    this.svg.classList.add('has-route');

    // frame the whole route
    const xs = r.walk.map(function (p) { return p.x; }).concat([a.rect[0], a.rect[0] + a.rect[2], b.rect[0], b.rect[0] + b.rect[2]]);
    const ys = r.walk.map(function (p) { return p.y; }).concat([a.rect[1], a.rect[1] + a.rect[3], b.rect[1], b.rect[1] + b.rect[3]]);
    const x1 = Math.min.apply(null, xs), y1 = Math.min.apply(null, ys);
    const rect = [x1, y1, Math.max.apply(null, xs) - x1, Math.max.apply(null, ys) - y1];
    if (a.type === 'building' || a.id === 'court') { rect[0] = Math.min(rect[0], pa.x - 40); }
    this.focusRect(rect, 50, 520);
    this.apply();
    return r;
  };

  CampusMap.prototype.destroy = function () {
    this.cancelAnim();
    if (this.ro) this.ro.disconnect();
    if (this.svg.parentNode) this.svg.parentNode.removeChild(this.svg);
  };

  window.CampusMap = CampusMap;
  window.CampusRouter = Router;
})();
