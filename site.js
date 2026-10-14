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
