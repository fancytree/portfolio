/* Standing player figure for the character creator.
   Mirrors person() in game.js (same blocks, sizes, materials) so the preview matches what ends up in the office.
   If you change the character there, change it here too. */
(function () {
  'use strict';
  var lin = function (c) { return new THREE.Color(c).convertSRGBToLinear(); };
  var matCache = {}, geoCache = {};
  function M(color) {
    if (matCache[color]) return matCache[color];
    var m = new THREE.MeshStandardMaterial({ color: lin(color), roughness: 0.86, metalness: 0 });
    m.emissive = lin(color).multiplyScalar(0.05);
    return (matCache[color] = m);
  }
  function rboxGeo(w, h, d, r) {
    r = Math.max(0.002, Math.min(r, w * 0.45, h * 0.45, d * 0.45));
    var key = [w, h, d, r].map(function (v) { return v.toFixed(3); }).join('|');
    if (geoCache[key]) return geoCache[key];
    var sw = w - 2 * r, sh = h - 2 * r;
    var r0 = Math.max(0, Math.min(r * 0.9, sw / 2 - 0.001, sh / 2 - 0.001));
    var s = new THREE.Shape(), x0 = -sw / 2, y0 = -sh / 2;
    s.moveTo(x0 + r0, y0); s.lineTo(x0 + sw - r0, y0); s.quadraticCurveTo(x0 + sw, y0, x0 + sw, y0 + r0);
    s.lineTo(x0 + sw, y0 + sh - r0); s.quadraticCurveTo(x0 + sw, y0 + sh, x0 + sw - r0, y0 + sh);
    s.lineTo(x0 + r0, y0 + sh); s.quadraticCurveTo(x0, y0 + sh, x0, y0 + sh - r0);
    s.lineTo(x0, y0 + r0); s.quadraticCurveTo(x0, y0, x0 + r0, y0);
    var depth = Math.max(0.001, d - 2 * r);
    var g = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 3, curveSegments: 4 });
    g.translate(0, 0, -depth / 2);
    return (geoCache[key] = g);
  }
  function B(parent, w, h, d, color, x, y, z, r) {
    var m = new THREE.Mesh(rboxGeo(w, h, d, r === undefined ? 0.06 : r), M(color));
    m.position.set(x, y + h / 2, z); parent.add(m); return m;
  }
  function S(parent, r, color, x, y, z, seg) {
    seg = seg || 20;
    var key = 's' + r + '|' + seg;
    if (!geoCache[key]) geoCache[key] = new THREE.SphereGeometry(r, seg, Math.round(seg * 0.7));
    var m = new THREE.Mesh(geoCache[key], M(color));
    m.position.set(x, y, z); parent.add(m); return m;
  }
  var hairGeo = null;

  window.HQAvatar = {
    /** o: { body, pants, hair, skin, bun } — returns a Group standing on y = 0, facing +z. */
    build: function (o) {
      hairGeo = hairGeo || new THREE.SphereGeometry(0.33, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.52);
      var g = new THREE.Group(), indigo = '#2e2470';
      [-0.13, 0.13].forEach(function (x) {
        var l = new THREE.Group(); l.position.set(x, 0.5, 0); g.add(l);
        B(l, 0.21, 0.5, 0.24, o.pants, 0, -0.5, 0, 0.08);
      });
      var up = new THREE.Group(); up.position.y = 0.44; g.add(up);
      B(up, 0.6, 0.64, 0.44, o.body, 0, 0, 0, 0.2);
      [-0.38, 0.38].forEach(function (x) {
        var a = new THREE.Group(); a.position.set(x, 0.56, 0.02); up.add(a);
        B(a, 0.15, 0.46, 0.17, o.body, 0, -0.46, 0, 0.07);
        S(a, 0.075, o.skin, 0, -0.48, 0.01, 12);
      });
      var hd = new THREE.Group(); hd.position.y = 0.95; up.add(hd);
      S(hd, 0.31, o.skin, 0, 0, 0);
      var h = new THREE.Mesh(hairGeo, M(o.hair));
      h.position.set(0, 0.02, -0.02); h.rotation.x = -0.32; hd.add(h);
      if (o.bun) S(hd, 0.13, o.hair, 0, 0.33, -0.1, 14);
      S(hd, 0.038, indigo, -0.1, 0.01, 0.285, 10);
      S(hd, 0.038, indigo, 0.1, 0.01, 0.285, 10);
      var c1 = S(hd, 0.05, '#ff9fc4', -0.18, -0.08, 0.245, 10); c1.scale.z = 0.4;
      var c2 = S(hd, 0.05, '#ff9fc4', 0.18, -0.08, 0.245, 10); c2.scale.z = 0.4;
      return g;
    }
  };
})();
