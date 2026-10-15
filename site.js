/* Collapsible main menu for small screens. Without JavaScript the menu simply stays open. */
(function () {
  var header = document.querySelector('.site-header');
  var btn = header && header.querySelector('.menu-toggle');
  if (!btn) return;

  function setOpen(open) {
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
  }

  btn.addEventListener('click', function () { setOpen(!header.classList.contains('menu-open')); });

  // Close with Escape, or when a menu link is chosen.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) { setOpen(false); btn.focus(); }
  });
  header.querySelectorAll('nav a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });

  // Reset when the screen widens past the phone layout.
  var wide = window.matchMedia('(min-width: 861px)');
  var onChange = function () { if (wide.matches) setOpen(false); };
  if (wide.addEventListener) wide.addEventListener('change', onChange); else wide.addListener(onChange);
})();

/* Social profile links, from social.js */
(function () {
  var cfg = window.SOCIAL || {};
  var names = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', linkedin: 'LinkedIn' };
  var links = Object.keys(names).filter(function (k) {
    return typeof cfg[k] === 'string' && /^https:\/\//.test(cfg[k]);
  });
  document.querySelectorAll('[data-social]').forEach(function (ul) {
    links.forEach(function (k) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = cfg[k];
      a.rel = 'noopener me';
      a.target = '_blank';
      a.title = names[k];
      a.setAttribute('aria-label', 'Appalachian Wasabi on ' + names[k] + ' (opens in a new tab)');
      var img = document.createElement('img');
      img.src = 'icons/' + k + '.png';
      img.alt = '';
      img.width = 40; img.height = 40;
      img.className = k;
      a.appendChild(img);
      li.appendChild(a);
      ul.appendChild(li);
    });
    if (!links.length) ul.hidden = true;
  });
  document.querySelectorAll('[data-social-section]').forEach(function (el) { el.hidden = !links.length; });
})();

/* Share button on journal posts */
(function () {
  document.querySelectorAll('[data-share]').forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var data = { title: document.title, url: window.location.href };
      if (navigator.share) { navigator.share(data).catch(function () {}); return; }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(data.url).then(function () {
          btn.textContent = 'Link copied';
          setTimeout(function () { btn.textContent = label; }, 2000);
        });
      }
    });
  });
})();

/* Thank-you notes after a form service redirect (?subscribed=1 / ?sent=1) */
(function () {
  var q = new URLSearchParams(window.location.search);
  if (q.get('subscribed') === '1') {
    var t = document.getElementById('notify-thanks'), f = document.getElementById('notify-form');
    if (t && f) { t.hidden = false; f.hidden = true; }
  }
})();

/* Collaboration form: show the order number field only for order questions */
(function () {
  var type = document.getElementById('type');
  var field = document.getElementById('order-field');
  if (!type || !field) return;
  function sync() { field.hidden = type.value !== 'Customer with an order question'; }
  type.addEventListener('change', sync);
  sync();
})();

/* Journal post cards, from posts.js (loaded after this file, so wait for the page) */
document.addEventListener('DOMContentLoaded', function () {
  var posts = Array.isArray(window.POSTS) ? window.POSTS.slice() : [];
  posts.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  document.querySelectorAll('[data-posts]').forEach(function (grid) {
    var limit = parseInt(grid.getAttribute('data-limit'), 10) || posts.length;
    var list = posts.slice(0, limit);
    if (!list.length) {
      var section = grid.closest('.latest');
      if (section) section.hidden = true;
      else grid.innerHTML = '<p>No posts yet. Check back soon.</p>';
      return;
    }
    list.forEach(function (p) {
      if (typeof p.slug !== 'string' || !/^[\w-]+\.html$/.test(p.slug)) return;
      var a = document.createElement('a');
      a.className = 'post-card';
      a.href = p.slug;
      var art = document.createElement('div');
      art.className = 'art';
      if (p.image) {
        var img = document.createElement('img');
        img.src = p.image; img.alt = ''; img.loading = 'lazy';
        art.appendChild(img);
      } else {
        art.classList.add('plain');
        art.textContent = p.tag || 'Journal';
      }
      a.appendChild(art);
      var body = document.createElement('div');
      body.className = 'body';
      var meta = document.createElement('p');
      meta.className = 'eyebrow';
      var d = p.date ? new Date(p.date + 'T12:00:00') : null;
      meta.textContent = (p.tag ? p.tag + ' · ' : '') + (d ? d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '');
      var h = document.createElement('h3');
      h.textContent = p.title || '';
      var ex = document.createElement('p');
      ex.textContent = p.excerpt || '';
      body.appendChild(meta); body.appendChild(h); body.appendChild(ex);
      a.appendChild(body);
      grid.appendChild(a);
    });
  });
});
