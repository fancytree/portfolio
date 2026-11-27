/* @ds-bundle: {"format":4,"namespace":"BeautySupply","components":[{"name":"Button"},{"name":"IconButton"},{"name":"Chip"},{"name":"SegmentedControl"},{"name":"SearchBar"},{"name":"Field"},{"name":"Checkbox"},{"name":"Stepper"},{"name":"Message"},{"name":"ProductCard"},{"name":"CollectionCard"},{"name":"BrandCard"},{"name":"VideoCard"},{"name":"OfferCard"},{"name":"Banner"},{"name":"PageHeader"},{"name":"ActionBar"},{"name":"TabBar"},{"name":"ListGroup"},{"name":"OptionGrid"},{"name":"UnitOptions"},{"name":"LineItem"},{"name":"SummaryCard"},{"name":"ProfileHeader"},{"name":"BalanceSummary"},{"name":"MoneyCard"},{"name":"OrderOverview"},{"name":"CategoryTile"},{"name":"ProductShelf"},{"name":"ArticleCard"},{"name":"FavouriteButton"},{"name":"KeyFacts"},{"name":"DetailImage"},{"name":"Disclosure"},{"name":"ProductGallery"},{"name":"PriceRow"},{"name":"ProductTags"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  function link(p, attrs) { if (p.href && !p.disabled) { attrs.href = p.href; delete attrs.type; return 'a'; } return 'button'; }
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  var PATHS = {
    home: ['M4 11c0-.9.4-1.7 1.1-2.3l5.1-4a2.9 2.9 0 0 1 3.6 0l5.1 4c.7.6 1.1 1.4 1.1 2.3v6a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 17z', 'M10 15h4'],
    heart: ['M12 20s-8-4.7-8-10.4A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.6C20 15.3 12 20 12 20z'],
    bag: ['M8.5 8h7a2 2 0 0 1 2 1.8l.9 7.8a2.6 2.6 0 0 1-2.6 2.9H8.2a2.6 2.6 0 0 1-2.6-2.9l.9-7.8a2 2 0 0 1 2-1.8z', 'M9 8V6.8a3 3 0 0 1 6 0V8'],
    user: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'M7 17.6c1-1.9 2.8-2.9 5-2.9s4 1 5 2.9'],
    search: ['M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z', 'm16 16 4 4'],
    bell: ['M6.5 16v-5.5a5.5 5.5 0 0 1 11 0V16l1.5 1.8H5z', 'M10 20.8h4'],
    filter: ['M4 7h9m5 0h2M4 17h2m5 0h9', 'M15.5 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z', 'M8.5 14.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'],
    back: ['m15 5-7 7 7 7'],
    close: ['m6.5 6.5 11 11m0-11-11 11'],
    next: ['M5 12h14m-6-6 6 6-6 6'],
    minus: ['M6 12h12'],
    plus: ['M12 6v12M6 12h12'],
    down: ['m6 9 6 6 6-6'],
    play: ['M8 6.5v11a1 1 0 0 0 1.5.9l8.7-5.5a1 1 0 0 0 0-1.8L9.5 5.6A1 1 0 0 0 8 6.5z'],
    check: ['m6 12.4 4 4 8-8.8'],
    sparkle: ['M12 4c.6 4.2 2.8 6.4 7 8-4.2 1.6-6.4 3.8-7 8-.6-4.2-2.8-6.4-7-8 4.2-1.6 6.4-3.8 7-8z'],
    dryer: ['M4 9.5A5.5 5.5 0 0 1 9.5 4H11l9 2v7l-9 2H9.5A5.5 5.5 0 0 1 4 9.5z', 'M9.5 7.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', 'm9.5 15 1.3 5h3.4l-1.4-5.2'],
    scissors: ['M6 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z', 'M6 14.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z', 'M8 8.5 20 17', 'M8 15.5 20 7'],
    lipstick: ['M9.5 11V7l5-3v7', 'M8.5 11h7v3.5h-7z', 'M7 14.5h10V19a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19z'],
    polish: ['M10 4.5A1.5 1.5 0 0 1 11.500 3h1A1.500 1.500 0 0 1 14 4.5V10h-4z', 'M10 10c-2 .4-3 1.8-3 3.800V18a2.500 2.500 0 0 0 2.500 2.500h5A2.500 2.500 0 0 0 17 18v-4.200c0-2-1-3.400-3-3.800'],
    lotus: ['M12 5c2.4 2.2 3.5 4.8 3.5 7.400S14.2 17.200 12 19c-2.2-1.8-3.500-4-3.500-6.600S9.600 7.200 12 5z', 'M3.500 10.500c.2 5.2 3.2 8.300 8.500 8.500', 'M20.500 10.500c-.2 5.2-3.200 8.300-8.500 8.500', 'M3.500 10.500c2 0 3.600.600 5 1.700', 'M20.500 10.500c-2 0-3.600.600-5 1.700'],
    settings: ['M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'M10.4 3.5h3.2l.5 2.3 1.9 1.1 2.2-.7 1.6 2.8-1.7 1.6v2.8l1.7 1.6-1.6 2.8-2.2-.7-1.9 1.1-.5 2.3h-3.2l-.5-2.3-1.9-1.1-2.2.7-1.6-2.8 1.7-1.6v-2.8L4.2 9l1.6-2.8 2.2.7 1.9-1.1z']
  };
  var TAB_ICONS = { home: true };
  function Icon(p) {
    var size = p.size || 20;
    return h('svg', { className: 'bs-icon', width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: p.stroke || 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
      (PATHS[p.name] || []).map(function (d, i) { return h('path', { key: i, d: d }); }));
  }

  // Adding to the bag: a thumbnail of the product is thrown into the bag, and the bag takes the hit.
  var ADDS = /^Add(?: (\d+)(?: items?)?| \[qty\]| set)?(?: to Bag)?$/;
  function isBagLink(href) { return !href || /Bag\.dc\.html$/.test(href); }
  function flyToBag(from, qty) {
    var root = from.closest('[data-theme]') || document.body;
    function say(name) { root.dispatchEvent(new CustomEvent(name, { detail: { qty: qty } })); }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { say('bs:bag-start'); say('bs:bag-land'); return 0; }
    if (getComputedStyle(root).position === 'static') root.style.position = 'relative';
    var frame = root.getBoundingClientRect(), scale = frame.width / root.offsetWidth || 1;
    function centre(el) { var r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - frame.left) / scale, y: (r.top + r.height / 2 - frame.top) / scale }; }
    // the picture that belongs to this button: its card or row, its sheet, or the first ticked line
    var card = from.closest('article, .bs-line, [role="dialog"]');
    var picture = card && card.querySelector('img');
    if (!picture) { var ticked = root.querySelector('.bs-line input:checked'); picture = ticked && ticked.closest('.bs-line').querySelector('img'); }
    var start = centre(picture && picture.getBoundingClientRect().width ? picture : from);
    var target = root.querySelector('.bs-tab[aria-label="Bag"]:not(.is-on) .bs-icon'), bubble = null;
    if (!target) {
      // no tab bar on this page: a bag appears just long enough to receive the item
      bubble = root.querySelector(':scope > .bs-flybag');
      if (!bubble) {
        bubble = document.createElement('div'); bubble.className = 'bs-flybag';
        bubble.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="' + PATHS.bag.join(' ') + '"/></svg><b class="bs-tab__badge"></b>';
        var bar = root.querySelector('.bs-floating');
        // in a sheet it sits just above the button, never on top of it
        bubble.style.bottom = (bar ? bar.offsetHeight + 8 : from.closest('[role="dialog"]') ? (frame.bottom - from.getBoundingClientRect().top) / scale + 56 : 24) + 'px';
        root.appendChild(bubble);
        bubble.bsCount = 0;
      }
      clearTimeout(bubble.bsTimer);
      bubble.classList.remove('is-leaving');
      target = bubble.firstChild;
    }
    var end = centre(bubble || target);
    var flyer = document.createElement('div'); flyer.className = 'bs-flyer';
    if (picture) { var copy = document.createElement('img'); copy.src = picture.currentSrc || picture.src; copy.alt = ''; flyer.appendChild(copy); }
    root.appendChild(flyer);
    say('bs:bag-start');
    var dx = end.x - start.x, dy = end.y - start.y, far = Math.sqrt(dx * dx + dy * dy);
    var time = Math.min(0.72, 0.44 + far / 2000), lift = Math.max(56, Math.min(130, far * 0.26)), t0 = null;
    function place(t) {
      // steady sideways, gravity up and down: a thrown object's path
      var x = start.x + dx * t, y = start.y + dy * t - lift * 4 * t * (1 - t), s = 1 - 0.68 * t * t;
      flyer.style.transform = 'translate(' + (x - 32) + 'px,' + (y - 32) + 'px) scale(' + s.toFixed(3) + ')';
      flyer.style.opacity = t > 0.88 ? String(1 - (t - 0.88) * 4) : '1';
    }
    place(0);
    requestAnimationFrame(function step(now) {
      if (t0 === null) t0 = now;
      var t = Math.min(1, (now - t0) / 1000 / time);
      place(t);
      if (t < 1) return requestAnimationFrame(step);
      flyer.remove();
      say('bs:bag-land');
      var hit = bubble || target;
      if (hit.animate) hit.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(5px)', offset: 0.28 }, { transform: 'translateY(-3px)', offset: 0.6 }, { transform: 'translateY(1px)', offset: 0.82 }, { transform: 'translateY(0)' }], { duration: 440, easing: 'ease-out' });
      if (bubble) {
        bubble.bsCount += qty;
        var badge = bubble.lastChild; badge.textContent = bubble.bsCount > 99 ? '99+' : bubble.bsCount;
        if (badge.animate) badge.animate([{ transform: 'scale(.5)' }, { transform: 'scale(1.18)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 320, easing: 'ease-out' });
        bubble.bsTimer = setTimeout(function () { bubble.classList.add('is-leaving'); bubble.bsTimer = setTimeout(function () { bubble.remove(); }, 300); }, 1800);
      }
    });
    return time * 1000;
  }
  function Button(p) {
    var label = typeof p.children === 'string' ? p.children.trim() : '', add = label.match(ADDS), adds = !!add && isBagLink(p.href);
    function click(e) {
      if (!adds) { if (p.onClick) p.onClick(e); return; }
      var el = e.currentTarget;
      if (el.bsGo) return;
      var sheet = el.closest('[role="dialog"]'), picked = sheet && sheet.querySelector('.bs-stepper output');
      var wait = flyToBag(el, p.bagQuantity || +(add[1] || (picked && picked.textContent) || 1));
      if (p.onClick) p.onClick(e);
      // a button that also opens the bag does so once the item has landed
      if (p.href) { e.preventDefault(); setTimeout(function () { el.bsGo = true; el.click(); el.bsGo = false; }, wait + 280); }
    }
    var a = { type: 'button', className: cx('bs-btn', 'bs-btn--' + (p.variant || 'primary'), p.size === 'small' && 'bs-btn--small', p.block && 'bs-btn--block'), disabled: p.disabled, onClick: click };
    return h(link(p, a), a, p.children);
  }
  function IconButton(p) {
    var a = { type: 'button', className: cx('bs-iconbtn', p.variant === 'primary' && 'bs-iconbtn--primary'), 'aria-label': p.label, onClick: p.label === 'Add to Bag' && isBagLink(p.href) ? function (e) { flyToBag(e.currentTarget, 1); if (p.onClick) p.onClick(e); } : p.onClick };
    return h(link(p, a), a, h(Icon, { name: p.icon }));
  }
  // Glide a horizontal row so that the item sits in the middle, or as near as the ends allow.
  function reveal(el) {
    var box = el.parentNode;
    while (box && box.nodeType === 1 && !(/(auto|scroll)/.test(getComputedStyle(box).overflowX) && box.scrollWidth > box.clientWidth + 1)) box = box.parentNode;
    if (!box || box.nodeType !== 1) return;
    var b = box.getBoundingClientRect(), r = el.getBoundingClientRect(), scale = b.width / box.offsetWidth || 1;
    var from = box.scrollLeft, to = from + (r.left + r.width / 2 - b.left - b.width / 2) / scale;
    to = Math.max(0, Math.min(box.scrollWidth - box.clientWidth, to));
    if (Math.abs(to - from) < 1) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { box.scrollLeft = to; return; }
    var x = from, v = 0, last = null, frame;
    function stop() { cancelAnimationFrame(frame); box.removeEventListener('pointerdown', stop); box.removeEventListener('wheel', stop); }
    function step(now) {
      var left = last === null ? 1 / 60 : Math.min((now - last) / 1000, 1 / 20), w = 13;
      last = now;
      while (left > 0) { var dt = Math.min(left, 1 / 240); left -= dt; v += (w * w * (to - x) - 2 * w * v) * dt; x += v * dt; }
      if (Math.abs(to - x) < 0.5 && Math.abs(v) < 8) { box.scrollLeft = to; stop(); return; }
      box.scrollLeft = x; frame = requestAnimationFrame(step);
    }
    // the finger always wins
    box.addEventListener('pointerdown', stop, { passive: true }); box.addEventListener('wheel', stop, { passive: true });
    frame = requestAnimationFrame(step);
    return stop;
  }
  function Chip(p) {
    var el = React.useRef(null), first = React.useRef(true);
    React.useEffect(function () {
      var mounted = first.current; first.current = false;
      if (mounted || !p.selected || !el.current) return;
      return reveal(el.current);
    }, [!!p.selected]);
    var a = { ref: el, type: 'button', className: cx('bs-chip', p.icon === 'heart' && 'bs-chip--saved', p.icon && 'has-icon', p.shape === 'option' && 'is-option', p.onSurface && 'on-surface', p.selected && 'is-on'), 'aria-pressed': p.href ? undefined : !!p.selected, disabled: p.disabled, onClick: p.onClick };
    return h(link(p, a), a, p.icon ? h(Icon, { name: p.icon, size: 18, stroke: 1.6 }) : null, p.children);
  }
  function SegmentedControl(p) {
    var s = React.useState(p.defaultValue || p.options[0]);
    // a linked segment slides first, then follows its link
    var going = React.useState(null);
    var value = going[0] !== null ? going[0] : p.value !== undefined ? p.value : s[0];
    var index = p.options.indexOf(value);
    return h('div', { className: 'bs-segment', role: 'tablist' },
      index < 0 ? null : h('span', { key: 'thumb', className: 'bs-segment__thumb', 'aria-hidden': true, style: { width: 'calc((100% - 2 * var(--space-1)) / ' + p.options.length + ')', transform: 'translateX(' + index * 100 + '%)' } }),
      p.options.map(function (o, i) {
        var href = p.hrefs && p.hrefs[i];
        var a = { key: o, type: 'button', role: 'tab', 'aria-selected': o === value, className: cx('bs-seg', o === value && 'is-on'), onClick: function (e) {
          s[1](o); if (p.onChange) p.onChange(o);
          if (!href || o === value) return;
          var el = e.currentTarget;
          if (el.bsGo || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
          e.preventDefault(); going[1](o);
          setTimeout(function () { el.bsGo = true; el.click(); el.bsGo = false; going[1](null); }, 320);
        } };
        return h(link({ href: href }, a), a, o);
      }));
  }
  function SearchBar(p) {
    return h('div', { className: 'bs-search' },
      p.href
        ? h('a', { className: 'bs-search__field', href: p.href }, h(Icon, { name: 'search' }), h('span', null, p.placeholder || 'Search brands, products…'))
        : h('label', { className: 'bs-search__field' }, h(Icon, { name: 'search' }), h('input', { type: 'search', 'aria-label': p.placeholder || 'Search brands, products', placeholder: p.placeholder || 'Search brands, products…', defaultValue: p.defaultValue, onChange: function (e) { if (p.onChange) p.onChange(e.target.value); } })),
      p.filter === false ? null : h(IconButton, { icon: 'filter', label: 'Filters', onClick: p.onFilter, href: p.filterHref }));
  }
  var uid = 0;
  function Select(p) {
    // a first option such as "Select a country" is the placeholder, not a choice
    var hint = /^(select|choose)\b/i.test(p.options[0] || '') ? p.options[0] : null;
    var list = hint ? p.options.slice(1) : p.options;
    var v = React.useState(p.defaultValue !== undefined ? p.defaultValue : hint ? null : list[0]);
    var open = React.useState(false);
    var root = React.useRef(null);
    React.useEffect(function () {
      if (!open[0]) return;
      function outside(e) { if (root.current && !root.current.contains(e.target)) open[1](false); }
      document.addEventListener('pointerdown', outside, true);
      // bring the whole menu into view inside its own scroll area
      var timer = setTimeout(function () {
        var menu = root.current.lastChild, box = menu.parentNode;
        while (box && box !== document.body && !/(auto|scroll)/.test(getComputedStyle(box).overflowY)) box = box.parentNode;
        if (!box || box === document.body) return;
        var m = menu.getBoundingClientRect(), b = box.getBoundingClientRect(), scale = b.height / box.offsetHeight || 1;
        if (m.bottom > b.bottom) box.scrollBy({ top: (m.bottom - b.bottom) / scale + 8, behavior: 'smooth' });
      }, 300);
      return function () { document.removeEventListener('pointerdown', outside, true); clearTimeout(timer); };
    }, [open[0]]);
    function items() { return root.current.querySelectorAll('[role="option"]'); }
    function button() { return root.current.firstChild; }
    function keys(e) {
      if (e.key === 'Escape' && open[0]) { e.preventDefault(); open[1](false); button().focus(); return; }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      if (!open[0]) { open[1](true); return; }
      var all = items(), at = Array.prototype.indexOf.call(all, document.activeElement);
      var next = at < 0 ? Math.max(0, list.indexOf(v[0])) : (at + (e.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length;
      all[next].focus();
    }
    return h('div', { ref: root, className: cx('bs-select', open[0] && 'is-open'), onKeyDown: keys, onBlur: function (e) { if (e.relatedTarget && !root.current.contains(e.relatedTarget)) open[1](false); } },
      h('button', { type: 'button', id: p.id, className: 'bs-input bs-select__button', disabled: p.disabled, 'aria-haspopup': 'listbox', 'aria-expanded': open[0], 'aria-invalid': !!p.error, onClick: function () { open[1](!open[0]); } },
        h('span', { className: cx('bs-select__value', v[0] === null && 'is-hint') }, v[0] === null ? hint : v[0]), h(Icon, { name: 'down' })),
      h('div', { className: 'bs-menu' }, h('div', { className: 'bs-menu__clip' }, h('div', { className: 'bs-menu__list', role: 'listbox', 'aria-labelledby': p.id }, list.map(function (o) {
        var on = o === v[0];
        return h('button', { type: 'button', key: o, role: 'option', className: cx('bs-menu__item', on && 'is-on'), 'aria-selected': on, tabIndex: open[0] ? 0 : -1, onClick: function (e) {
          v[1](o); open[1](false); if (p.onChange) p.onChange(o);
          if (e.detail) e.currentTarget.blur(); else button().focus();
        } }, h('span', null, o), on ? h(Icon, { name: 'check', size: 16 }) : null);
      })))));
  }
  function Field(p) {
    var id = React.useState(function () { uid += 1; return 'bs-field-' + uid; })[0];
    var control = p.multiline
      ? h('textarea', { id: id, className: 'bs-input bs-input--area', placeholder: p.placeholder, defaultValue: p.defaultValue, disabled: p.disabled, 'aria-invalid': !!p.error })
      : p.options
      ? h(Select, { id: id, options: p.options, defaultValue: p.defaultValue, disabled: p.disabled, error: p.error, onChange: p.onChange })
      : h('input', { id: id, className: 'bs-input', placeholder: p.placeholder, defaultValue: p.defaultValue, disabled: p.disabled, 'aria-invalid': !!p.error });
    return h('div', { className: cx('bs-field', p.error && 'is-error') }, h('label', { htmlFor: id }, p.label), control, p.error ? h('span', { className: 'bs-field__error' }, p.error) : null);
  }
  function Checkbox(p) {
    return h('label', { className: cx('bs-check', p.disabled && 'is-disabled') },
      h('input', { type: p.radio ? 'radio' : 'checkbox', name: p.name, defaultChecked: p.checked, disabled: p.disabled, onChange: function (e) { if (p.onChange) p.onChange(e.target.checked); } }),
      h('span', null, p.label));
  }
  function Stepper(p) {
    var s = React.useState(p.defaultValue === undefined ? 1 : p.defaultValue);
    var v = p.value !== undefined ? p.value : s[0];
    var min = p.min === undefined ? 0 : p.min;
    function set(n) { if (n < min || (p.max !== undefined && n > p.max)) return; s[1](n); if (p.onChange) p.onChange(n); }
    return h('div', { className: cx('bs-stepper', p.error && 'is-error') },
      h('button', { type: 'button', className: 'bs-stepbtn', 'aria-label': 'Decrease', disabled: v <= min, onClick: function () { set(v - (p.step || 1)); } }, h(Icon, { name: 'minus' })),
      h('output', null, v),
      h('button', { type: 'button', className: 'bs-stepbtn', 'aria-label': 'Increase', disabled: p.max !== undefined && v >= p.max, onClick: function () { set(v + (p.step || 1)); } }, h(Icon, { name: 'plus' })));
  }
  function Message(p) {
    return h(p.badge ? 'span' : 'div', { className: cx(p.badge ? 'bs-badge' : 'bs-message', 'bs-tone--' + (p.tone || 'success')), role: p.tone === 'danger' ? 'alert' : undefined }, p.children);
  }
  function photo(src, cls) { return h('div', { className: cls }, src ? h('img', { src: src, alt: '' }) : null); }
  function addButton(p) {
    // adding stays on the page; only a link that leads somewhere else is followed
    var stays = isBagLink(p.actionHref);
    var a = { type: 'button', className: 'bs-add', 'aria-label': 'Add ' + p.name + ' to Bag', disabled: p.soldOut, onClick: stays ? function (e) { flyToBag(e.currentTarget, 1); if (p.onAction) p.onAction(); } : p.onAction };
    return h(link({ href: stays ? undefined : p.actionHref, disabled: p.soldOut }, a), a, h(Icon, { name: 'plus' }));
  }
  function FavouriteButton(p) {
    var s = React.useState(!!p.saved);
    // follow the page when what is selected changes
    React.useEffect(function () { s[1](!!p.saved); }, [!!p.saved]);
    var cls = cx('bs-act', p.plain && 'bs-act--plain', p.large && 'bs-act--large', s[0] && 'is-saved');
    var what = p.name || 'product';
    // a product with options cannot be saved as a whole: the heart opens the sheet where one is chosen
    if (p.href) return h('a', { className: cls, href: p.href, 'aria-label': 'Choose which option of ' + what + ' to save', onClick: function (e) { e.stopPropagation(); } }, h(Icon, { name: 'heart', size: 18 }));
    return h('button', { type: 'button', className: cls, 'aria-label': (s[0] ? 'Remove from favourites: ' : 'Add to favourites: ') + what, 'aria-pressed': s[0],
      onClick: function (e) { if (e) { e.preventDefault(); e.stopPropagation(); } s[1](!s[0]); if (p.onSave) p.onSave(!s[0]); } }, h(Icon, { name: 'heart', size: 18 }));
  }
  var TAG_ORDER = ['expiry', 'limited', 'discount', 'new', 'hot', 'custom'];
  function sortTags(p, max) {
    var list = (p.tags || []).slice();
    var offer = p.badge || p.discount;
    if (offer) list.push({ type: 'discount', label: offer });
    if (p.guest) list = list.filter(function (t) { return t.type !== 'discount' && t.type !== 'limited'; });
    list.sort(function (a, b) { return TAG_ORDER.indexOf(a.type) - TAG_ORDER.indexOf(b.type); });
    return max ? list.slice(0, max) : list;
  }
  function ProductTags(p) {
    var list = sortTags(p, p.max);
    if (!list.length) return null;
    return h('span', { className: 'bs-tags' }, list.map(function (t) { return h('span', { key: t.type + t.label, className: 'bs-tag bs-tag--' + t.type }, t.label); }));
  }
  function media(p, el) {
    var actions = p.actions === false || p.layout === 'row' ? null : h(FavouriteButton, { name: p.name, saved: p.favourite, onSave: p.onSave, href: p.favouriteHref });
    var flags = sortTags(p, 2).length ? h(ProductTags, { tags: p.tags, badge: p.badge, discount: p.discount, guest: p.guest, max: 2 }) : null;
    if (!flags && !actions) return el;
    return h('div', { className: 'bs-product__media' }, el, flags, actions);
  }
  function priceBlock(p) {
    if (p.guest) return h('span', { className: 'bs-product__meta' }, 'Verify to see price');
    if (!p.original) return h('span', { className: 'bs-product__price' }, p.price);
    return h('span', { className: 'bs-product__pricecol' }, h('span', { className: 'bs-product__price' }, p.price), h('s', { className: 'bs-price__was', 'aria-label': 'Original price ' + p.original }, p.original));
  }
  function ProductCard(p) {
    var row = p.layout === 'row';
    return h('article', { className: cx('bs-product', row && 'bs-product--row') },
      media(p, p.href ? h('a', { className: 'bs-product__photo', href: p.href, 'aria-label': 'View ' + p.name }, p.image ? h('img', { src: p.image, alt: '' }) : null) : photo(p.image, 'bs-product__photo')),
      h('div', { className: 'bs-product__info' },
        row && p.actions !== false
          ? h('span', { className: 'bs-product__head' }, h('span', { className: 'bs-product__brand' }, p.brand), h(FavouriteButton, { plain: true, name: p.name, saved: p.favourite, onSave: p.onSave, href: p.favouriteHref }))
          : h('span', { className: 'bs-product__brand' }, p.brand),
        h('span', { className: 'bs-product__name' }, p.name),
        p.meta ? h('span', { className: 'bs-product__meta' }, p.meta) : null,
        p.status ? h('span', { className: cx('bs-product__status', p.soldOut && 'is-out') }, p.status) : null,
        h('div', { className: cx('bs-product__buy', p.noAction && 'is-bare') },
          priceBlock(p),
          p.guest || p.noAction ? null : p.quantity > 0
            ? h(Stepper, { value: p.quantity, min: 0, onChange: p.onQuantity })
            : p.action
            ? h(Button, { disabled: p.soldOut, onClick: p.onAction, href: ADDS.test(p.action) && isBagLink(p.actionHref) ? undefined : p.actionHref, variant: p.actionVariant }, p.action)
            : addButton(p))));
  }
  function CollectionCard(p) {
    var imgs = p.images || [];
    var mosaic = p.layout === 'mosaic';
    var cells = mosaic ? [0, 1, 2] : [0, 1, 2, 3];
    var a = { type: 'button', className: cx('bs-collection', mosaic && 'bs-collection--mosaic'), onClick: p.onClick };
    return h(link(p, a), a,
      h('span', { className: 'bs-collection__grid' }, cells.map(function (i) {
        return h('span', { key: i }, imgs[i] ? h('img', { src: imgs[i], alt: '' }) : null, i === cells.length - 1 && p.more ? h('span', { className: 'bs-collection__more' }, '+' + p.more) : null);
      })),
      h('span', { className: 'bs-collection__text' }, p.title, h('span', { className: 'bs-product__meta' }, p.meta)));
  }
  function BrandCard(p) {
    var a = { type: 'button', className: 'bs-brandcard', onClick: p.onClick };
    return h(link(p, a), a,
      p.image ? h('img', { className: 'bs-brandcard__cover', src: p.image, alt: '' }) : null,
      h('span', { className: 'bs-brandcard__bar' },
        h('span', { className: 'bs-brandcard__logo' }, p.logo ? h('img', { src: p.logo, alt: '' }) : p.name.charAt(0)),
        h('span', { className: 'bs-brandcard__text' }, h('span', { className: 'bs-heading' }, p.name), h('span', { className: 'bs-product__meta' }, p.meta)),
        h(Icon, { name: 'next' })));
  }
  function VideoCard(p) {
    var a = { type: 'button', className: 'bs-video', 'aria-label': 'Play ' + p.title, onClick: p.onClick };
    return h(link(p, a), a,
      // nothing is drawn over the cover: title, length and play sit underneath it
      h('span', { className: 'bs-video__media' }, p.poster ? h('img', { className: 'bs-video__poster', src: p.poster, alt: '' }) : null),
      h('span', { className: 'bs-video__caption' },
        h('span', { className: 'bs-video__title' }, p.title),
        h('span', { className: 'bs-video__foot' },
          h('span', { className: 'bs-video__text' }, p.product ? h('span', { className: 'bs-video__price' }, p.product) : null, h('span', { className: 'bs-product__meta' }, p.duration)),
          h('span', { className: 'bs-video__play' }, h(Icon, { name: 'play', size: 18 })))));
  }
  function OfferCard(p) {
    var tiers = p.tiers || [];
    var a = { type: 'button', className: 'bs-offer', onClick: p.onClick };
    return h(link(p, a), a,
      h('span', { className: 'bs-offer__head' }, photo(p.image, 'bs-offer__photo'), h('span', { className: 'bs-brandcard__text' }, h('span', { className: 'bs-heading' }, p.title), h('span', { className: 'bs-product__meta' }, p.meta || 'Buy more, pay less'))),
      p.guest ? h('span', { className: 'bs-product__meta' }, 'Verify to see volume prices')
        : h('span', { className: 'bs-offer__tiers' }, tiers.map(function (t, i) { return h('span', { key: t.from, className: i === tiers.length - 1 ? 'is-best' : '' }, h('span', null, t.from), h('span', null, t.price)); })));
  }
  function Banner(p) {
    var list = p.slides || [], i;
    if (!list.length) for (i = 0; i < (p.count || 1); i++) list.push({ image: i ? undefined : p.image, alt: p.alt, href: p.href, placeholder: p.placeholder });
    var n = list.length, c = useCarousel(n, list[0].image);
    var slides = list.map(function (b, i) {
      var a = { key: i, type: 'button', className: 'bs-banner__slide', draggable: false, onClick: p.onAction ? function () { p.onAction(i); } : undefined, 'aria-label': (b.alt || 'Banner') + (n > 1 ? ', ' + (i + 1) + ' of ' + n : '') };
      return h(link(b, a), a, b.image ? h('img', { src: b.image, alt: '', draggable: false }) : h('span', { className: 'bs-banner__placeholder' }, b.placeholder || p.placeholder));
    });
    return h('div', { className: 'bs-banner', role: 'group', 'aria-roledescription': 'carousel', 'aria-label': 'Banners' },
      h('div', { className: 'bs-banner__track', ref: c.track, onScroll: c.onScroll }, slides),
      n > 1 ? h('div', { className: 'bs-banner__dots' }, slideDots(c, n, 'Show banner ')) : null);
  }

  function Capsule() {
    function dot(x, r) { return h('circle', { key: x, cx: x, cy: 16, r: r }); }
    return h('svg', { className: 'bs-header__capsule', width: 87, height: 32, viewBox: '0 0 87 32', fill: 'currentColor', 'aria-hidden': true },
      dot(14.5, 2.2), dot(21.5, 3.6), dot(28.5, 2.2),
      h('path', { d: 'M43.5 8v16', stroke: 'currentColor', strokeOpacity: 0.25, strokeLinecap: 'round' }),
      h('circle', { cx: 65, cy: 16, r: 7, fill: 'none', stroke: 'currentColor', strokeWidth: 2.2 }), dot(65, 2.8));
  }
  function PageHeader(p) {
    var searching = p.search !== undefined;
    return h('header', { className: cx('bs-header', searching && 'bs-header--search', p.favourite !== undefined && 'bs-header--fav') },
      p.leftIcon ? h(IconButton, { icon: p.leftIcon, label: p.leftLabel || p.leftIcon, href: p.leftHref })
        : p.back === false ? null : h(IconButton, { icon: 'back', label: 'Back', onClick: p.onBack, href: p.backHref }),
      searching ? h(p.searchHref ? 'a' : 'span', { className: 'bs-header__search', href: p.searchHref }, p.search) : h('h1', null, p.title),
      p.favourite === undefined ? null : h('span', { className: 'bs-header__fav' }, h(FavouriteButton, { name: p.favouriteName, saved: p.favourite, href: p.favouriteHref })),
      h(Capsule));
  }
  function ListGroup(p) {
    return h('div', { className: 'bs-list' }, (p.items || []).map(function (it) {
      return h(it.href ? 'a' : 'div', { key: it.label, className: 'bs-list__row', href: it.href },
        h('span', null, it.label),
        h('span', { className: 'bs-list__end' },
          it.badge ? h(Message, { badge: true, tone: it.tone }, it.badge) : null,
          it.value ? h('span', { className: 'bs-product__meta' }, it.value) : null,
          it.chevron === false ? null : h(Icon, { name: 'next' })));
    }));
  }
  function OptionGrid(p) {
    var cols = p.columns || 4;
    var total = (p.items || []).length;
    var limit = p.collapsedCount && p.collapsedCount < total ? p.collapsedCount : 0;
    var open = React.useState(false);
    var height = React.useState(null);
    var ref = React.useRef(null);
    React.useLayoutEffect(function () {
      var grid = ref.current;
      if (!limit || !grid) return;
      function measure() {
        var kids = grid.children;
        var last = kids[open[0] ? kids.length - 1 : limit - 1];
        height[1](last.offsetTop + last.offsetHeight - kids[0].offsetTop);
      }
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      var ro = new ResizeObserver(measure);
      ro.observe(grid);
      return function () { ro.disconnect(); };
    }, [limit, open[0], total]);
    var grid = h('div', { ref: ref,  className: cx('bs-options', cols > 3 && 'bs-options--dense'), style: { gridTemplateColumns: 'repeat(' + cols + ',minmax(0,1fr))' } }, (p.items || []).map(function (o, i) {
      var on = !p.readOnly && o.selected;
      var attrs = p.readOnly
        ? { key: o.label, className: cx('bs-option', 'is-static', o.out && 'is-out'), 'aria-hidden': limit && !open[0] && i >= limit ? true : undefined }
        : { type: 'button', key: o.label, className: cx('bs-option', o.selected && 'is-on', o.out && 'is-out'), 'aria-label': o.out ? o.label + ', out of stock' : undefined, 'aria-pressed': !!o.selected, disabled: o.disabled, onClick: function () { if (p.onSelect) p.onSelect(i); } };
      return h(p.readOnly ? 'div' : 'button', attrs,
        h('span', { className: cx('bs-option__frame', p.ratio === 'portrait' && 'is-portrait') },
          h('span', { className: 'bs-option__photo', style: o.color ? { background: o.color } : undefined }, o.image ? h('img', { src: o.image, alt: '' }) : o.placeholder || null),
          on ? h('span', { className: 'bs-option__check' }, h(Icon, { name: 'check', size: 16 })) : null,
          o.saved ? h('span', { className: 'bs-option__saved', role: 'img', 'aria-label': 'saved' }, h(Icon, { name: 'heart', size: 12 })) : null,
          o.count ? h('span', { className: 'bs-option__count', role: 'img', 'aria-label': o.count + ' in bag' }, h(Icon, { name: 'bag', size: 12 }), o.count > 99 ? '99+' : o.count) : null),
        h('span', { className: 'bs-option__label' }, o.label, p.readOnly && o.out ? h('span', { className: 'bs-sr' }, ', out of stock') : null),
        o.sub ? h('span', { className: cx('bs-option__sub', o.tone && 'is-' + o.tone) }, o.sub) : null);
    }));
    if (!limit) return grid;
    return h('div', { className: cx('bs-fold', open[0] && 'is-open') },
      h('div', { className: 'bs-fold__clip', style: height[0] === null ? undefined : { height: height[0] } }, grid),
      h('button', { type: 'button', className: 'bs-fold__toggle', 'aria-expanded': open[0], onClick: function () { open[1](!open[0]); } },
        h('span', null, open[0] ? 'Show less' : 'Show all ' + total), h(Icon, { name: 'down', size: 16 })));
  }
  function UnitOptions(p) {
    return h('div', { className: 'bs-units' }, (p.items || []).map(function (u, i) {
      return h('button', { type: 'button', key: u.label, className: cx('bs-unit', u.selected && 'is-on'), 'aria-pressed': !!u.selected, disabled: u.disabled, onClick: function () { if (p.onSelect) p.onSelect(i); } },
        h('span', null, u.label), h('span', { className: 'bs-unit__sub' }, u.sub), u.price ? h('span', { className: 'bs-unit__sub' }, u.price) : null);
    }));
  }
  function LineItem(p) {
    // a row with its own stepper must not toggle the checkbox when the stepper is tapped
    var tag = p.selectable && (p.quantity === undefined || p.quantity === null) ? 'label' : p.href ? 'a' : 'div';
    var qty = p.quantity === undefined || p.quantity === null ? null : h(Stepper, p.onQuantity ? { value: p.quantity, min: p.quantityMin, error: p.error, onChange: p.onQuantity } : { defaultValue: p.quantity, min: p.quantityMin, error: p.error });
    var box = { type: 'checkbox', disabled: p.disabled, 'aria-label': 'Select ' + p.title };
    if (p.onCheck) { box.checked = !!p.checked; box.onChange = function (e) { p.onCheck(e.target.checked); }; } else box.defaultChecked = p.checked;
    return h(tag, { className: cx('bs-line', p.plain && 'bs-line--plain', p.small && 'bs-line--small', p.disabled && 'is-disabled'), href: tag === 'a' ? p.href : undefined },
      p.selectable ? h('span', { className: 'bs-check' }, h('input', box)) : null,
      p.photo === false ? null : photo(p.image, 'bs-line__photo'),
      h('span', { className: 'bs-line__text' },
        h('span', null, p.title),
        p.meta ? h('span', { className: 'bs-product__meta' }, p.meta) : null,
        p.price ? h('span', null, p.price) : null,
        p.tags ? h(ProductTags, { tags: p.tags }) : null,
        p.note ? h('span', { className: cx('bs-line__note', p.noteTone && 'is-' + p.noteTone) }, p.note) : null),
      qty,
      p.value ? h('span', { className: 'bs-line__value' }, p.value) : null,
      p.actions ? h(FavouriteButton, { plain: true, name: p.title, saved: p.favourite }) : null,
      p.action ? h(Button, { variant: 'outline', size: 'small', href: p.actionHref, onClick: p.onAction }, p.action) : null);
  }
  function SummaryCard(p) {
    return h('dl', { className: 'bs-summary' }, (p.rows || []).map(function (r) {
      return h('div', { key: r.label, className: cx(r.strong && 'is-strong', r.muted && 'is-muted') }, h('dt', null, r.label), h('dd', null, r.value));
    }));
  }
  function ProfileHeader(p) {
    return h(p.href ? 'a' : 'div', { className: 'bs-profile', href: p.href },
      photo(p.image, 'bs-profile__photo'),
      h('span', { className: 'bs-profile__text' }, h('span', { className: 'bs-profile__name' }, p.name),
        h('span', { className: 'bs-profile__meta' }, p.badge ? h(Message, { badge: true }, p.badge) : null, h('span', { className: 'bs-product__meta' }, p.meta))),
      p.href ? h(Icon, { name: 'next' }) : null);
  }
  function BalanceSummary(p) {
    return h('section', { className: 'bs-balance' },
      h('div', { className: 'bs-balance__main' }, h('span', { className: 'bs-balance__eyebrow' }, 'ACCOUNT BALANCE'), h('strong', null, p.balance)),
      p.dueAmount ? h('div', { className: 'bs-balance__due' }, h('span', null, p.dueLabel || 'To pay', h('span', { className: 'bs-heading' }, p.dueAmount)),
        p.action ? h(Button, { variant: 'secondary', size: 'small', href: p.href, onClick: p.onAction }, p.action) : null) : null);
  }

  function MoneyCard(p) {
    if (!p.amount) return null;
    var details = (p.details || []).filter(function (d) { return d && d.value; });
    return h('section', { className: 'bs-money' },
      h('div', { className: 'bs-money__top' },
        h('div', { className: 'bs-money__main' }, h('span', { className: 'bs-money__eyebrow' }, p.label), h('strong', null, p.amount), p.note ? h('span', { className: 'bs-money__eyebrow' }, p.note) : null),
        p.action ? h(Button, { variant: 'secondary', size: 'small', href: p.href, onClick: p.onAction }, p.action) : null),
      details.length ? h('dl', { className: 'bs-money__details' }, details.map(function (d) {
        return h('div', { key: d.label }, h('dt', null, d.label), h('dd', null, d.value));
      })) : null);
  }

  function OrderOverview(p) {
    return h('section', { className: 'bs-orders' },
      h('div', { className: 'bs-orders__head' }, h('span', { className: 'bs-heading' }, p.title || 'Orders'), h('span', { className: 'bs-orders__more' }, p.more || 'View all', h(Icon, { name: 'next', size: 16 }))),
      h('div', { className: 'bs-orders__stats' }, (p.stats || []).map(function (s) { return h('span', { key: s.label }, h('strong', null, s.count), s.label); })),
      p.orderTitle ? h(LineItem, { plain: true, small: true, image: p.orderImage, title: p.orderTitle, note: p.orderStatus, noteTone: 'success', action: p.action }) : null);
  }
  function CategoryTile(p) {
    return h(p.href ? 'a' : 'button', { className: 'bs-category', href: p.href, type: p.href ? undefined : 'button' },
      p.image ? h('img', { src: p.image, alt: '' }) : null, h('span', null, p.label));
  }
  function ProductShelf(p) {
    return h('section', { className: 'bs-shelf' },
      h('div', { className: 'bs-shelf__head' }, h('span', { className: 'bs-heading' }, p.title), h(p.moreHref ? 'a' : 'span', { className: 'bs-shelf__more', href: p.moreHref }, 'View all')),
      h('div', { className: 'bs-shelf__row' }, (p.items || []).map(function (it, i) {
        return h('div', { key: i, className: 'bs-shelf__item' },
          h(it.href ? 'a' : 'span', { className: 'bs-shelf__link', href: it.href },
            h('div', { className: 'bs-shelf__photo' }, it.image ? h('img', { src: it.image, alt: '' }) : null, h(ProductTags, { tags: it.tags, discount: it.discount, max: 1 })),
            h('span', null, it.name), h('span', null, it.price), it.original ? h('s', { className: 'bs-price__was' }, it.original) : null),
          p.actions === false ? null : h(FavouriteButton, { name: it.name, saved: it.favourite }));
      })));
  }
  function ArticleCard(p) {
    var tile = p.layout === 'tile';
    return h(p.href ? 'a' : 'article', { className: cx('bs-article', tile && 'bs-article--tile'), href: p.href },
      h('span', { className: 'bs-article__text' }, h('span', { className: 'bs-product__brand' }, p.eyebrow), h('span', { className: 'bs-heading' }, p.title), p.meta ? h('span', { className: 'bs-product__meta' }, p.meta) : null),
      photo(p.image, 'bs-article__photo'));
  }
  function KeyFacts(p) {
    return h('dl', { className: cx('bs-facts', p.dense && 'bs-facts--dense') }, (p.items || []).slice(0, 5).map(function (f) {
      return h('div', { key: f.label }, h('dt', null, f.label), h('dd', null, f.value));
    }));
  }
  // Shared by the banner and the product cover: a swipeable row whose dots follow the finger.
  function useCarousel(n, first) {
    // position in slides, fractional while moving
    var s = React.useState(0), pos = Math.max(0, Math.min(n - 1, s[0])), track = React.useRef(null);
    React.useEffect(function () { s[1](0); if (track.current) track.current.scrollLeft = 0; }, [first]);
    return { pos: pos, at: Math.round(pos), track: track,
      go: function (i) { var el = track.current; if (el) el.scrollTo({ left: ((i + n) % n) * el.clientWidth, behavior: 'smooth' }); },
      onScroll: function (e) { var el = e.target; if (el.clientWidth) s[1](el.scrollLeft / el.clientWidth); } };
  }
  function slideDots(c, n, label) {
    var dots = [];
    for (var i = 0; i < n; i++) (function (i) {
      var near = Math.max(0, 1 - Math.abs(c.pos - i));
      dots.push(h('button', { key: i, type: 'button', 'aria-label': label + (i + 1), 'aria-current': i === c.at ? 'true' : undefined, onClick: function () { c.go(i); } },
        h('span', { style: { width: (6 + 12 * near) + 'px', opacity: 0.55 + 0.45 * near } })));
    })(i);
    return dots;
  }
  function ProductGallery(p) {
    var imgs = p.images || [], n = imgs.length || p.count || 1;
    var c = useCarousel(n, imgs[0]);
    var slides = [];
    for (var i = 0; i < n; i++) (function (i) {
      slides.push(h('button', { key: i, type: 'button', className: 'bs-gallery__slide', 'aria-label': 'Photo ' + (i + 1) + ' of ' + n + (n > 1 ? ', show next' : ''), onClick: function () { c.go(c.at + 1); } },
        imgs[i] ? h('img', { src: imgs[i], alt: (p.alt || 'Product') + ', photo ' + (i + 1), draggable: false }) : h('span', null, (p.placeholder || '[Photo]') + ' ' + (i + 1) + '/' + n)));
    })(i);
    return h('div', { className: 'bs-gallery' },
      h('div', { className: 'bs-gallery__track', ref: c.track, onScroll: c.onScroll }, slides),
      n > 1 ? h('div', { className: 'bs-gallery__dots' }, slideDots(c, n, 'Show photo ')) : null);
  }

  function Disclosure(p) {
    var s = React.useState(!!p.open), open = s[0];
    return h('div', { className: cx('bs-disclosure', p.plain && 'bs-disclosure--plain', open && 'is-open') },
      h('button', { type: 'button', className: 'bs-disclosure__head', 'aria-expanded': open, onClick: function () { s[1](!open); } },
        h('span', null, p.title), h(Icon, { name: 'down' })),
      open ? h('div', { className: 'bs-disclosure__body' }, p.text) : null);
  }

  function DetailImage(p) {
    var imgs = p.images || [];
    return h('figure', { className: 'bs-detail', 'aria-label': p.alt || 'Product details', style: imgs.length ? undefined : { height: (p.height || 720) + 'px' } },
      imgs.length ? imgs.map(function (src, i) { return h('img', { key: i, src: src, alt: '' }); }) : h('span', null, p.placeholder || '[Detail image]'));
  }
  function PriceRow(p) {
    return h('div', { className: 'bs-price' },
      h('span', { className: 'bs-price__main' }, h('strong', null, p.price), p.unit ? h('span', { className: 'bs-product__meta' }, '/ ' + p.unit) : null,
        p.original ? h('s', { className: 'bs-price__was', 'aria-label': 'Original price ' + p.original }, p.original) : null),
      p.discount ? h(Message, { badge: true, tone: 'warning' }, p.discount) : null);
  }
  function ActionBar(p) {
    if (!p.amount) return h('div', { className: 'bs-actionbar bs-actionbar--single' }, h(Button, { block: true, disabled: p.disabled, onClick: p.onAction, href: p.href }, p.action));
    return h('div', { className: cx('bs-actionbar', p.stacked && 'bs-actionbar--stacked') }, h('span', null, (p.label || 'Total') + ' ', h('strong', null, p.amount)), h(Button, { disabled: p.disabled, onClick: p.onAction, href: p.href, bagQuantity: p.bagQuantity }, p.action));
  }
  // one critically damped spring per tab; they share a clock, so the widths always add up
  function useSprings(targets) {
    var st = React.useRef(null);
    if (!st.current) st.current = { x: targets.slice(), v: targets.map(function () { return 0; }) };
    var tick = React.useState(0);
    var key = targets.join(',');
    React.useEffect(function () {
      var m = st.current;
      var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (still) { m.x = targets.slice(); m.v = targets.map(function () { return 0; }); tick[1](function (n) { return n + 1; }); return; }
      if (m.x.every(function (x, i) { return x === targets[i] && m.v[i] === 0; })) return;
      var last = null, frame;
      function step(now) {
        var left = last === null ? 1 / 60 : Math.min((now - last) / 1000, 1 / 20), w = 14, moving = false;
        last = now;
        while (left > 0) {
          var dt = Math.min(left, 1 / 240); left -= dt;
          for (var i = 0; i < targets.length; i++) { m.v[i] += (w * w * (targets[i] - m.x[i]) - 2 * w * m.v[i]) * dt; m.x[i] += m.v[i] * dt; }
        }
        for (var j = 0; j < targets.length; j++) if (Math.abs(targets[j] - m.x[j]) > 0.002 || Math.abs(m.v[j]) > 0.02) moving = true;
        if (!moving) { m.x = targets.slice(); m.v = targets.map(function () { return 0; }); }
        tick[1](function (n) { return n + 1; });
        if (moving) frame = requestAnimationFrame(step);
      }
      frame = requestAnimationFrame(step);
      return function () { cancelAnimationFrame(frame); };
    }, [key]);
    return st.current.x;
  }
  function TabBar(p) {
    var tabs = [['Home', 'home'], ['Saved', 'heart'], ['Bag', 'bag'], ['Account', 'user']];
    var s = React.useState('Home');
    // a linked tab moves first, then follows its link
    var going = React.useState(null);
    var current = going[0] !== null ? going[0] : p.current !== undefined ? p.current : s[0];
    var index = Math.max(0, tabs.map(function (t) { return t[0]; }).indexOf(current));
    var w = useSprings(tabs.map(function (t, i) { return i === index ? 1 : 0; }));
    var nav = React.useRef(null);
    var bag = React.useState({ air: 0, landed: 0 });
    React.useEffect(function () {
      var root = nav.current && (nav.current.closest('[data-theme]') || document.body);
      if (!root) return;
      function start(e) { var q = e.detail.qty; bag[1](function (b) { return { air: b.air + q, landed: b.landed }; }); }
      function land(e) { var q = e.detail.qty; bag[1](function (b) { return { air: Math.max(0, b.air - q), landed: b.landed + q }; }); }
      root.addEventListener('bs:bag-start', start); root.addEventListener('bs:bag-land', land);
      return function () { root.removeEventListener('bs:bag-start', start); root.removeEventListener('bs:bag-land', land); };
    }, []);
    // with a count from the page, hold back what is still in the air
    var inBag = p.bagCount !== undefined ? Math.max(0, p.bagCount - bag[0].air) : bag[0].landed;
    var labels = React.useRef([]);
    var widths = React.useState([]);
    React.useLayoutEffect(function () {
      function measure() {
        var next = labels.current.map(function (el) { return el ? el.offsetWidth : 0; });
        widths[1](function (old) { return old.join() === next.join() ? old : next; });
      }
      measure();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    });
    return h('nav', { ref: nav, className: cx('bs-tabbar', p.variant && 'bs-tabbar--' + p.variant), 'aria-label': 'Main' },
      tabs.map(function (t, i) {
        var on = t[0] === current, href = p.hrefs && p.hrefs[i], k = Math.max(0, Math.min(1, w[i]));
        // width, fill, colour and label all follow the same spring value, in place
        var pct = (k * 100).toFixed(2) + '%';
        var a = { key: t[0], type: 'button', className: cx('bs-tab', on && 'is-on'), 'aria-label': t[0], 'aria-current': on ? 'page' : undefined,
          style: { flexGrow: 1 + Math.max(0, w[i]), color: 'color-mix(in srgb, var(--ink) ' + pct + ', var(--ink-muted))' },
          onClick: function (e) {
            s[1](t[0]); if (p.onChange) p.onChange(t[0]);
            if (!href || on) return;
            var el = e.currentTarget;
            if (el.bsGo || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
            e.preventDefault(); going[1](t[0]);
            setTimeout(function () { el.bsGo = true; el.click(); el.bsGo = false; going[1](null); }, 380);
          } };
        return h(link({ href: href }, a), a,
          h('span', { className: 'bs-tab__fill', 'aria-hidden': true, style: { opacity: k } }),
          h(Icon, { name: t[1], size: 24, stroke: 1.5 }),
          t[0] === 'Bag' && inBag > 0 ? h('b', { key: 'badge' + inBag, className: 'bs-tab__badge', 'aria-label': inBag + ' in bag' }, inBag > 99 ? '99+' : inBag) : null,
          h('span', { className: 'bs-tab__label', 'aria-hidden': true, style: { width: widths[0][i] === undefined ? (k ? 'auto' : 0) : k * widths[0][i], marginLeft: 'calc(var(--space-2) * ' + k.toFixed(4) + ')', opacity: k * k } },
            h('span', { ref: function (el) { labels.current[i] = el; } }, t[0])));
      }));
  }

  window.BeautySupply = { Icon: Icon, Button: Button, IconButton: IconButton, Chip: Chip, SegmentedControl: SegmentedControl, SearchBar: SearchBar, Field: Field, Checkbox: Checkbox, Stepper: Stepper, Message: Message, ProductCard: ProductCard, CollectionCard: CollectionCard, BrandCard: BrandCard, VideoCard: VideoCard, OfferCard: OfferCard, Banner: Banner, PageHeader: PageHeader, ActionBar: ActionBar, TabBar: TabBar, ListGroup: ListGroup, OptionGrid: OptionGrid, UnitOptions: UnitOptions, LineItem: LineItem, SummaryCard: SummaryCard, ProfileHeader: ProfileHeader, BalanceSummary: BalanceSummary, MoneyCard: MoneyCard, OrderOverview: OrderOverview, CategoryTile: CategoryTile, ProductShelf: ProductShelf, ArticleCard: ArticleCard, FavouriteButton: FavouriteButton, KeyFacts: KeyFacts, DetailImage: DetailImage, Disclosure: Disclosure, ProductGallery: ProductGallery, PriceRow: PriceRow, ProductTags: ProductTags };
})();
