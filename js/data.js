/*
 * LEGASCI Directory: campus data for Legazpi City Science High School (S.Y. 2026–2027).
 *
 * Every room, office, lab and facility comes from the official vicinity map.
 * Coordinates are in map units that follow that layout; rect = [x, y, width, height].
 * To update the directory, edit this file only.
 */
window.LCSHS = (function () {
  'use strict';

  const school = {
    name: 'Legazpi City Science High School',
    short: 'LCSHS',
    app: 'LEGASCI Directory',
    sy: 'S.Y. 2026–2027'
  };

  /* ---------- Categories (match the map legend) ---------- */
  const categories = {
    g7:       { label: 'Grade 7',      short: 'G7',  kind: 'classroom', color: '#1f9d63', grad: ['#0b5e36', '#3cc996'] },
    g8:       { label: 'Grade 8',      short: 'G8',  kind: 'classroom', color: '#d9a21b', grad: ['#cf9712', '#f0cb55'] },
    g9:       { label: 'Grade 9',      short: 'G9',  kind: 'classroom', color: '#d63a4b', grad: ['#b51d2c', '#ec95a4'] },
    g10:      { label: 'Grade 10',     short: 'G10', kind: 'classroom', color: '#2462b4', grad: ['#123f86', '#2f80d1'] },
    g11:      { label: 'Grade 11',     short: 'G11', kind: 'classroom', color: '#7d1024', grad: ['#7d1024', '#1c0307'] },
    g12:      { label: 'Grade 12',     short: 'G12', kind: 'classroom', color: '#2b2b2e', grad: ['#46464a', '#0f0f10'] },
    faculty:  { label: 'Faculty Room', short: 'Faculty',    kind: 'faculty',  color: '#76737b' },
    office:   { label: 'Office',       short: 'Offices',    kind: 'other',    color: '#5f6b7a' },
    lab:      { label: 'Laboratory',   short: 'Labs',       kind: 'other',    color: '#5f6b7a' },
    facility: { label: 'Facility',     short: 'Facilities', kind: 'other',    color: '#5f6b7a' },
    place:    { label: 'Open area',    short: 'Open areas', kind: 'place',    color: '#5f6b7a' }
  };
  const catOrder = ['office', 'faculty', 'lab', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'facility', 'place'];

  /* ---------- Buildings ---------- */
  const buildings = [
    {
      id: 'aristotle',
      name: 'Aristotle',
      color: '#d9a21b',
      tagline: 'Administration & Junior High',
      summary: 'Main offices, the Junior High faculty rooms, all Grade 8 rooms and three Grade 7 rooms.',
      description:
        'The administrative center of LCSHS. It houses the Office of the School Head, the Finance, Supply & Property Office, ' +
        'the Research Center and the Faculty Rooms of the Junior High Department, together with all five Grade 8 classrooms ' +
        '(Brown, Hooke, Linnaeus, Mendel, Pasteur) and three Grade 7 classrooms (Copernicus, Hubble, Kepler). ' +
        'It runs along one full side of the Covered Court.',
      directions:
        'Stand at the center of the Covered Court and face the Center Stage. The Aristotle Building is the long building on your right. ' +
        'Its offices (School Head, Finance, Research Center) are at the end near the Center Stage; the Junior High faculty rooms are at the other end, next to the Canteen.',
      label: { x: 1128, y: 112 },
      entry: [1230, 343],
      rows: { 33: 'Office wing', 131: 'Back row', 230: 'Front row, facing the Covered Court' },
      halls: [[828, 131, 218, 99], [1413, 131, 27, 99], [984, 230, 62, 102]]
    },
    {
      id: 'lapus',
      name: 'Lapus',
      color: '#1f9d63',
      tagline: 'Canteen, Comfort Rooms & Grade 7',
      summary: 'The Canteen, the comfort rooms and the Grade 7 Richter and Wegener rooms.',
      description:
        'A slim building on the side of the Covered Court opposite the Center Stage. It holds the school Canteen, ' +
        'the comfort rooms and two Grade 7 classrooms (Richter and Wegener). More comfort rooms are at its back.',
      directions:
        'Stand at the center of the Covered Court and face the Center Stage, then turn around. The Lapus Building is straight ahead, ' +
        'across the court from the stage. The Canteen is at its corner nearest the Aristotle Building.',
      label: { x: 1676, y: 372, vertical: true },
      entry: [1518, 497],
      vertical: true,
      halls: [[1549, 668, 100, 62]]
    },
    {
      id: 'einstein',
      name: 'Einstein',
      color: '#2462b4',
      tagline: 'Grade 9 & 10, Robotics & Offices',
      summary: 'All Grade 10 rooms, three Grade 9 rooms, two Robotics Labs, the PSDS Office and Academic Management Office 1.',
      description:
        'Home of all five Grade 10 classrooms (Maxwell, Hawking, Faraday, Compton, Volta) and three Grade 9 classrooms ' +
        '(Dalton, Curie, Boyle). It also has the two Robotics Laboratories, the PSDS Office and Academic Management Office 1. ' +
        'It sits along the side of the Covered Court opposite the Aristotle Building.',
      directions:
        'Stand at the center of the Covered Court and face the Center Stage. The Einstein Building is on your left, along the side of the court opposite the Aristotle Building. ' +
        'The PSDS Office and the Grade 9 rooms face the court; the Grade 10 rooms and the Robotics Laboratories are in the rows behind them.',
      label: { x: 1092, y: 716 },
      entry: [1240, 660],
      rows: { 732: 'Front row, facing the Covered Court', 832: 'Middle row', 933: 'Back row' },
      halls: [[999, 732, 59, 100], [1487, 732, 162, 98], [999, 832, 59, 101], [1428, 832, 59, 101], [999, 933, 59, 100], [1428, 933, 59, 100]]
    },
    {
      id: 'newton',
      name: 'Newton',
      color: '#7d1024',
      tagline: 'Science Labs & Senior High',
      summary: 'Computer, Physics and Biochemistry Labs, the Senior High faculty room, three Grade 11 rooms and two Grade 9 rooms.',
      description:
        'The laboratory building. It holds the Computer Laboratory, the Physics Laboratory and the Biochemistry Laboratory, ' +
        'the Faculty Room of the Senior High Department, three Grade 11 classrooms (Taylor, Fayol, Riemann) and two Grade 9 ' +
        'classrooms (Mendeleev, Priestley). It stands directly behind the Center Stage.',
      directions:
        'From the Covered Court, walk past the Center Stage. The Newton Building is directly behind the stage. ' +
        'The Grade 11 rooms (Taylor, Fayol, Riemann) are on the side facing the stage; the laboratories are on the far side.',
      label: { x: 380, y: 248 },
      entry: [705, 497],
      rows: { 268: 'First row (farthest from Da Vinci)', 369: 'Second row', 469: 'Third row', 570: 'Fourth row (nearest Da Vinci)' },
      halls: (function () {
        const out = [];
        [[268, 101], [369, 100], [469, 101], [570, 100]].forEach(function (r) {
          [[286, 60], [346, 39], [686, 39], [725, 60]].forEach(function (c) { out.push([c[0], r[0], c[1], r[1]]); });
        });
        return out;
      })()
    },
    {
      id: 'davinci',
      name: 'Da Vinci',
      color: '#2b2b2e',
      tagline: 'Senior High: Grade 11 & 12',
      summary: 'All seven Grade 12 rooms and three Grade 11 rooms.',
      description:
        'The Senior High building with all seven Grade 12 classrooms (Smith, Pacioli, Tesla, Lavoisier, Feynman, Franklin, Democritus) ' +
        'and three Grade 11 classrooms (Pascal, Gosset, Euler). It stands next to the Newton Building, past the Center Stage.',
      directions:
        'From the Covered Court, walk past the Center Stage toward the Newton Building, then turn left. ' +
        'Follow the walkway past the end of the Newton Building; Da Vinci is the building right after it.',
      label: { x: 392, y: 768 },
      entry: [542, 722],
      rows: { 775: 'Front row, facing the Newton Building', 876: 'Back row' },
      halls: [[250, 775, 63, 101], [250, 876, 63, 100], [772, 775, 61, 101], [772, 876, 61, 100]]
    }
  ];

  /* ---------- Rooms ---------- */
  const CR = ['cr', 'comfort room', 'restroom', 'toilet', 'bathroom', 'washroom', 'banyo'];
  const ROBO_DESC = 'Robotics laboratory for building, programming and testing robots, and other robotics and engineering activities.';
  const ROBO = ['robot', 'robotics', 'engineering', 'stem', 'lab'];

  const rooms = [];
  function add(b, list) {
    list.forEach(function (row) {
      const r = Object.assign({ id: row[0], name: row[1], cat: row[2], b: b, rect: row[3] }, row[4] || {});
      if (categories[r.cat].kind === 'classroom') {
        r.section = r.name.split('-')[1];
        r.grade = r.name.split('-')[0];
      }
      rooms.push(r);
    });
  }

  add('aristotle', [
    ['finance', 'Finance, Supply & Property Office', 'office', [828, 33, 110, 98], {
      icon: 'coins', lines: ['Finance, Supply', '& Property', 'Office'], fs: 11.5,
      desc: 'Handles the school’s finances, supplies and property: requests for supplies and equipment, property records and financial transactions.',
      aliases: ['finance', 'supply', 'supplies', 'property', 'equipment', 'custodian', 'accounting', 'budget'],
      note: 'In the office wing at the Center Stage end of the building.'
    }],
    ['research', 'Research Center', 'office', [938, 33, 108, 98], {
      icon: 'book', lines: ['Research', 'Center'],
      desc: 'The school’s research hub: research consultations, references and support for research classes and projects.',
      aliases: ['research', 'thesis', 'study', 'investigatory', 'capstone', 'library'],
      note: 'In the office wing at the Center Stage end of the building.'
    }],
    ['8-brown', '8-Brown', 'g8', [1046, 131, 92, 99]],
    ['8-hooke', '8-Hooke', 'g8', [1138, 131, 91, 99]],
    ['8-linnaeus', '8-Linnaeus', 'g8', [1229, 131, 92, 99]],
    ['8-mendel', '8-Mendel', 'g8', [1321, 131, 92, 99]],
    ['osh', 'Office of the School Head', 'office', [828, 230, 156, 102], {
      icon: 'user', lines: ['Office of the', 'School Head'],
      desc: 'Office of the School Head (Principal). Go here for official concerns, approvals and permits, and appointments with the School Head.',
      aliases: ['principal', 'school head', 'head', 'admin', 'administration', 'office of the principal'],
      note: 'At the end of the building nearest the Center Stage.'
    }],
    ['8-pasteur', '8-Pasteur', 'g8', [1046, 230, 92, 102]],
    ['7-copernicus', '7-Copernicus', 'g7', [1138, 230, 91, 102]],
    ['7-hubble', '7-Hubble', 'g7', [1229, 230, 92, 102]],
    ['7-kepler', '7-Kepler', 'g7', [1321, 230, 92, 102]],
    ['fr-jhs', 'Faculty Rooms – Junior High Department', 'faculty', [1413, 230, 136, 102], {
      icon: 'users', lines: ['Faculty Rooms –', 'Junior High', 'Department'], fs: 11.5,
      desc: 'Faculty rooms of the Junior High School (Grade 7–10) teachers. Go here to see a JHS teacher or adviser, or to submit requirements.',
      aliases: ['teacher', 'teachers', 'faculty', 'adviser', 'jhs', 'junior high'],
      note: 'At the end of the building next to the Canteen.'
    }]
  ]);

  add('lapus', [
    ['canteen', 'Canteen', 'facility', [1549, 230, 100, 137], {
      icon: 'food', rot: 90, fs: 20, weight: 800, upper: true,
      desc: 'The school canteen: meals, snacks and drinks during breaks.',
      aliases: ['food', 'eat', 'lunch', 'snack', 'snacks', 'merienda', 'cafeteria', 'drinks'],
      note: 'At the corner where the Lapus Building meets the Aristotle Building.'
    }],
    ['cr-1', 'Comfort Rooms', 'facility', [1549, 367, 100, 65], {
      icon: 'restroom', lines: ['Comfort', 'Rooms'], hint: 'near the Canteen',
      desc: 'Restrooms for students and visitors.', aliases: CR
    }],
    ['7-richter', '7-Richter', 'g7', [1549, 432, 100, 82], { rot: 90 }],
    ['7-wegener', '7-Wegener', 'g7', [1549, 514, 100, 83], { rot: 90 }],
    ['cr-2', 'Comfort Rooms', 'facility', [1549, 597, 100, 71], {
      icon: 'restroom', lines: ['Comfort', 'Rooms'], hint: 'near 7-Wegener',
      desc: 'Restrooms for students and visitors.', aliases: CR,
      note: 'At the end of the Lapus Building nearest the Einstein Building.'
    }],
    ['cr-3', 'Comfort Rooms', 'facility', [1712, 410, 36, 190], {
      icon: 'restroom', rot: 90, fs: 12, dashed: true, hint: 'behind Lapus',
      desc: 'More restrooms, at the back of the Lapus Building.', aliases: CR,
      note: 'Behind the Lapus Building.'
    }]
  ]);

  add('einstein', [
    ['psds', 'PSDS Office', 'office', [1058, 732, 91, 100], {
      icon: 'shield',
      desc: 'Office of the Public Schools District Supervisor (PSDS), for district-level supervision and coordination concerns.',
      aliases: ['psds', 'district', 'supervisor', 'district supervisor', 'public schools district supervisor']
    }],
    ['9-dalton', '9-Dalton', 'g9', [1149, 732, 92, 100]],
    ['9-curie', '9-Curie', 'g9', [1241, 732, 92, 100]],
    ['9-boyle', '9-Boyle', 'g9', [1333, 732, 95, 100]],
    ['amo1', 'Academic Management Office 1', 'office', [1428, 732, 59, 100], {
      icon: 'clipboard', lines: ['Acad.', 'Manage-', 'ment', 'Office 1'], fs: 10,
      desc: 'Academic Management Office 1, for academic concerns such as class programs, schedules and other academic matters.',
      aliases: ['academic', 'management', 'amo', 'schedule', 'class program', 'curriculum']
    }],
    ['10-maxwell', '10-Maxwell', 'g10', [1058, 832, 91, 101]],
    ['10-hawking', '10-Hawking', 'g10', [1149, 832, 92, 101]],
    ['10-faraday', '10-Faraday', 'g10', [1241, 832, 92, 101]],
    ['10-compton', '10-Compton', 'g10', [1333, 832, 95, 101]],
    ['robotics-1', 'Robotics Laboratory', 'lab', [1058, 933, 183, 100], {
      icon: 'cpu', hint: 'near 10-Maxwell', desc: ROBO_DESC, aliases: ROBO
    }],
    ['10-volta', '10-Volta', 'g10', [1241, 933, 92, 100]],
    ['robotics-2', 'Robotics Laboratory', 'lab', [1333, 933, 95, 100], {
      icon: 'cpu', lines: ['Robotics', 'Laboratory'], hint: 'near 10-Compton', desc: ROBO_DESC, aliases: ROBO
    }]
  ]);

  add('newton', [
    ['comp-lab', 'Computer Laboratory', 'lab', [385, 268, 202, 101], {
      icon: 'monitor',
      desc: 'Computer laboratory for ICT classes, programming, research work and other computer-based activities.',
      aliases: ['computer', 'comlab', 'com lab', 'ict', 'programming', 'computers', 'lab']
    }],
    ['11-taylor', '11-Taylor', 'g11', [587, 268, 99, 101]],
    ['phys-lab', 'Physics Laboratory', 'lab', [385, 369, 202, 100], {
      icon: 'atom',
      desc: 'Laboratory for physics experiments, demonstrations and practicals.',
      aliases: ['physics', 'science lab', 'experiment', 'lab']
    }],
    ['11-fayol', '11-Fayol', 'g11', [587, 369, 99, 100]],
    ['biochem-lab', 'Biochemistry Laboratory', 'lab', [385, 469, 202, 101], {
      icon: 'flask',
      desc: 'Laboratory for biology and chemistry experiments, specimen work and practicals.',
      aliases: ['biology', 'chemistry', 'biochem', 'chem lab', 'bio lab', 'science lab', 'experiment', 'lab']
    }],
    ['11-riemann', '11-Riemann', 'g11', [587, 469, 99, 101]],
    ['fr-shs', 'Faculty Room – Senior High Department', 'faculty', [385, 570, 104, 100], {
      icon: 'users', lines: ['Faculty Room –', 'Senior High', 'Department'], fs: 10.5,
      desc: 'Faculty room of the Senior High School (Grade 11–12) teachers. Go here to see an SHS teacher or adviser, or to submit requirements.',
      aliases: ['teacher', 'teachers', 'faculty', 'adviser', 'shs', 'senior high']
    }],
    ['9-mendeleev', '9-Mendeleev', 'g9', [489, 570, 98, 100]],
    ['9-priestley', '9-Priestley', 'g9', [587, 570, 99, 100]]
  ]);

  add('davinci', [
    ['12-smith', '12-Smith', 'g12', [313, 775, 93, 101]],
    ['12-pacioli', '12-Pacioli', 'g12', [406, 775, 92, 101]],
    ['11-pascal', '11-Pascal', 'g11', [498, 775, 92, 101]],
    ['11-gosset', '11-Gosset', 'g11', [590, 775, 90, 101]],
    ['11-euler', '11-Euler', 'g11', [680, 775, 92, 101]],
    ['12-tesla', '12-Tesla', 'g12', [313, 876, 92, 100]],
    ['12-lavoisier', '12-Lavoisier', 'g12', [405, 876, 92, 100]],
    ['12-feynman', '12-Feynman', 'g12', [497, 876, 92, 100]],
    ['12-franklin', '12-Franklin', 'g12', [589, 876, 89, 100]],
    ['12-democritus', '12-Democritus', 'g12', [678, 876, 94, 100]]
  ]);

  /* ---------- Open areas ---------- */
  const places = [
    {
      id: 'court', name: 'Covered Court Area', short: 'Covered Court', cat: 'place', rect: [1055, 355, 432, 285], entry: [1271, 590],
      icon: 'court', fs: 30, weight: 800, upper: true,
      desc: 'The central open area of the campus, used for assemblies, P.E. classes, sports and school events. ' +
        'The Aristotle, Lapus and Einstein Buildings line three of its sides and the Center Stage the fourth, so it is the best landmark for finding your way.',
      where: 'At the center of the campus, between the Aristotle, Lapus and Einstein Buildings and the Center Stage.',
      aliases: ['court', 'covered court', 'gym', 'gymnasium', 'assembly', 'pe', 'sports', 'events']
    },
    {
      id: 'stage', name: 'Center Stage', cat: 'place', rect: [960, 355, 77, 285], entry: [998, 622],
      icon: 'star', rot: -90, fs: 28, weight: 800, upper: true,
      desc: 'The stage of the Covered Court, used for programs, performances, ceremonies and assemblies.',
      where: 'On the side of the Covered Court facing the Lapus Building. The Newton Building is directly behind it.',
      aliases: ['stage', 'program', 'programs', 'performance', 'ceremony']
    }
  ];

  /* ---------- Walkways (used to draw routes) ---------- */
  // [x1, y1, x2, y2]: horizontal or vertical lanes between and through the buildings.
  const walkways = [
    [870, 343, 1518, 343],   // Aristotle front walkway
    [870, 343, 870, 722],    // Newton / Center Stage walkway
    [1518, 343, 1518, 1050], // Court / Lapus walkway
    [870, 660, 1518, 660],   // Court / Einstein walkway
    [282, 722, 870, 722],    // Newton / Da Vinci walkway
    [1271, 343, 1271, 660],  // across the court
    [1046, 560, 1518, 560],  // across the court
    [1046, 343, 1046, 660],  // between Center Stage and court
    [1015, 181, 1015, 343],  // Aristotle hall
    [860, 181, 1015, 181],   // Aristotle office wing hall
    [365, 300, 365, 722],    // Newton hall (lab side)
    [705, 300, 705, 722],    // Newton hall (Grade 11 side)
    [705, 497, 870, 497],    // Newton side entrance
    [282, 722, 282, 1000],   // Da Vinci end hall
    [802, 722, 802, 1000],   // Da Vinci end hall
    [282, 1000, 802, 1000],  // behind Da Vinci
    [1028, 660, 1028, 1050], // Einstein hall
    [1028, 1050, 1518, 1050] // behind Einstein
  ];

  /* ---------- "Where do I go?" guide ---------- */
  const guide = [
    {
      id: 'offices', title: 'Offices & services', items: [
        { q: 'I need to see the School Head (Principal).', to: 'osh' },
        { q: 'I have a concern about my class program, schedule or other academic matters.', to: 'amo1' },
        { q: 'I need supplies or equipment, or I have a finance or property concern.', to: 'finance' },
        { q: 'I need help or references for a research paper or project.', to: 'research' },
        { q: 'I have business with the District Supervisor.', to: 'psds' }
      ]
    },
    {
      id: 'teachers', title: 'Teachers & advisers', items: [
        { q: 'I want to see a Junior High teacher (Grade 7–10).', to: 'fr-jhs' },
        { q: 'I want to see a Senior High teacher (Grade 11–12).', to: 'fr-shs' }
      ]
    },
    {
      id: 'labs', title: 'Laboratories', items: [
        { q: 'I have a computer or ICT class.', to: 'comp-lab' },
        { q: 'I have a physics experiment.', to: 'phys-lab' },
        { q: 'I have a biology or chemistry experiment.', to: 'biochem-lab' },
        { q: 'I have a robotics class or activity.', to: 'robotics-1', a: 'There are two Robotics Laboratories in the back row of the Einstein Building, on both sides of 10-Volta.' }
      ]
    },
    {
      id: 'daily', title: 'Daily needs', items: [
        { q: 'I want to buy food or snacks.', to: 'canteen' },
        { q: 'I need a comfort room.', to: 'cr-1', a: 'Comfort rooms are in the Lapus Building: one beside the Canteen and one beside 7-Wegener, plus more at the back of the building.' }
      ]
    },
    {
      id: 'events', title: 'Assemblies & events', items: [
        { q: 'There is an assembly, P.E. class or school event.', to: 'court' },
        { q: 'There is a program, performance or ceremony.', to: 'stage' }
      ]
    }
  ];

  /* ---------- Derived data & lookups ---------- */
  function union(rects) {
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    rects.forEach(function (r) {
      x1 = Math.min(x1, r[0]); y1 = Math.min(y1, r[1]);
      x2 = Math.max(x2, r[0] + r[2]); y2 = Math.max(y2, r[1] + r[3]);
    });
    return [x1, y1, x2 - x1, y2 - y1];
  }

  buildings.forEach(function (b) {
    b.rooms = rooms.filter(function (r) { return r.b === b.id; });
    b.bbox = union(b.rooms.map(function (r) { return r.rect; }).concat(b.halls));
  });

  const index = new Map();
  places.forEach(function (p) { p.type = 'place'; index.set(p.id, p); });
  rooms.forEach(function (r) { r.type = 'room'; index.set(r.id, r); });
  buildings.forEach(function (b) {
    index.set('b-' + b.id, {
      id: 'b-' + b.id, type: 'building', name: b.name + ' Building', b: b.id,
      cat: 'building', icon: 'building', rect: b.bbox, entry: b.entry
    });
  });

  function entity(id) { return index.get(id) || null; }
  function center(e) {
    if (e.entry) return { x: e.entry[0], y: e.entry[1] };
    return { x: e.rect[0] + e.rect[2] / 2, y: e.rect[1] + e.rect[3] / 2 };
  }

  return {
    school: school,
    categories: categories,
    catOrder: catOrder,
    buildings: buildings,
    rooms: rooms,
    places: places,
    walkways: walkways,
    guide: guide,
    map: { bounds: [230, 14, 1540, 1056] },
    entity: entity,
    center: center
  };
})();
