/* Appalachian Wasabi shipping calendar.
   Rules (keep in sync with shipping.html):
   - Fresh rhizomes and plant starts ship on Monday, or Tuesday when Monday is a federal holiday.
   - Orders received by Friday 6:00 p.m. Eastern ship the following Monday.
   - Fresh items ship in spring (March-May) and fall (September-November) only.
   - No fresh shipments during the weeks of Thanksgiving, Christmas and New Year's Day.
   All dates are worked out on the Eastern Time calendar, whatever the visitor's own time zone. */
(function () {
  var TZ = 'America/New_York';
  var DAY = 86400000;
  var CUTOFF_MIN = 18 * 60;                 // Friday 6:00 p.m.
  var SEASON_MONTHS = [3, 4, 5, 9, 10, 11]; // fresh shipping months (by the Monday's month)

  // Dates are UTC-midnight timestamps standing for Eastern calendar days.
  function d(y, m, day) { return Date.UTC(y, m - 1, day); }
  function dow(t) { return new Date(t).getUTCDay(); }
  function month(t) { return new Date(t).getUTCMonth() + 1; }
  function nthWeekday(y, m, wd, n) {        // n = 1..4, or -1 for last
    if (n > 0) {
      var first = d(y, m, 1);
      return first + (((wd - dow(first) + 7) % 7) + (n - 1) * 7) * DAY;
    }
    var last = d(y, m + 1, 1) - DAY;
    return last - ((dow(last) - wd + 7) % 7) * DAY;
  }
  function mondayOf(t) { return t - ((dow(t) + 6) % 7) * DAY; }

  // Federal holidays that land on (or are observed on) a Monday.
  function isMondayHoliday(t) {
    var y = new Date(t).getUTCFullYear();
    var list = [
      nthWeekday(y, 1, 1, 3),   // Martin Luther King Jr. Day
      nthWeekday(y, 2, 1, 3),   // Washington's Birthday
      nthWeekday(y, 5, 1, -1),  // Memorial Day
      nthWeekday(y, 9, 1, 1),   // Labor Day
      nthWeekday(y, 10, 1, 2)   // Columbus Day / Indigenous Peoples' Day
    ];
    [[1, 1], [6, 19], [7, 4], [11, 11], [12, 25]].forEach(function (md) {
      var h = d(y, md[0], md[1]);
      if (dow(h) === 1) list.push(h);
      if (dow(h) === 0) list.push(h + DAY);   // Sunday holiday observed Monday
    });
    return list.indexOf(t) !== -1;
  }

  // Mondays of the weeks we pause fresh shipments.
  function isPauseWeek(mon) {
    var y = new Date(mon).getUTCFullYear();
    var weeks = [];
    [y - 1, y, y + 1].forEach(function (yr) {
      weeks.push(nthWeekday(yr, 11, 4, 4) - 3 * DAY);   // Thanksgiving week
      weeks.push(mondayOf(d(yr, 12, 25)));              // Christmas week
      weeks.push(mondayOf(d(yr, 1, 1)));                // New Year's week
    });
    return weeks.indexOf(mon) !== -1;
  }

  function inSeason(mon) { return SEASON_MONTHS.indexOf(month(mon)) !== -1; }

  function nowEastern(now) {
    var parts = {};
    new Intl.DateTimeFormat('en-US', {
      timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
    }).formatToParts(now || new Date()).forEach(function (p) { parts[p.type] = p.value; });
    return { day: d(+parts.year, +parts.month, +parts.day), minutes: (+parts.hour % 24) * 60 + (+parts.minute) };
  }

  /* Next n fresh shipments: [{ ship, orderBy, holiday, afterBreak, newSeason }]
     orderBy  = the Friday cutoff for that shipment.
     newSeason = true when this is the first shipment of a season (the off-season was skipped). */
  function upcoming(n, now) {
    var e = nowEastern(now);
    var toFri = (5 - dow(e.day) + 7) % 7;
    if (toFri === 0 && e.minutes >= CUTOFF_MIN) toFri = 7;
    var mon = e.day + (toFri + 3) * DAY;
    var out = [], paused = false, offSeason = false, guard = 0;
    while (out.length < n && guard++ < 200) {
      if (!inSeason(mon)) { offSeason = true; mon += 7 * DAY; continue; }
      if (isPauseWeek(mon)) { paused = true; mon += 7 * DAY; continue; }
      var ship = isMondayHoliday(mon) ? mon + DAY : mon;
      out.push({ ship: ship, orderBy: mon - 3 * DAY, holiday: ship !== mon, afterBreak: paused && !offSeason, newSeason: offSeason });
      paused = offSeason = false;
      mon += 7 * DAY;
    }
    return out;
  }

  // Can a fresh item be ordered right now? (false between a season's last cutoff and the next season)
  function freshOpen(now) { return !upcoming(1, now)[0].newSeason; }

  function fmt(t, opts) {
    var o = { timeZone: 'UTC' };
    for (var k in opts) o[k] = opts[k];
    return new Date(t).toLocaleDateString('en-US', o);
  }
  var LONG = { weekday: 'long', month: 'long', day: 'numeric' };
  var SHORT = { weekday: 'short', month: 'short', day: 'numeric' };
  var MONTH_YEAR = { month: 'long', year: 'numeric' };

  window.AWShip = { upcoming: upcoming, freshOpen: freshOpen, inSeason: inSeason,
                    isMondayHoliday: isMondayHoliday, isPauseWeek: isPauseWeek, fmt: fmt,
                    LONG: LONG, SHORT: SHORT };

  if (typeof document === 'undefined') return;

  function render() {
    var list = upcoming(6);
    var next = list[0];
    var open = !next.newSeason;
    var NB = ' ';

    // One-line bar
    document.querySelectorAll('[data-ship-next]').forEach(function (el) {
      el.innerHTML = open
        ? 'Next fresh shipment: <strong>' + fmt(next.ship, LONG) + '</strong>. Order by '
          + fmt(next.orderBy, { weekday: 'long', month: 'short', day: 'numeric' }) + ', 6&nbsp;p.m. Eastern.'
        : 'Fresh rhizomes and plant starts are out of season. <strong>Shipping resumes '
          + fmt(next.ship, LONG) + '</strong>.';
    });

    // Panel figures
    document.querySelectorAll('[data-ship-date]').forEach(function (el) { el.textContent = fmt(next.ship, LONG); });
    document.querySelectorAll('[data-ship-orderby]').forEach(function (el) {
      var box = el.parentNode;
      var label = box.querySelector('.label'), sub = box.querySelector('.sub');
      if (open) {
        el.textContent = fmt(next.orderBy, LONG) + ', 6' + NB + 'p.m.' + NB + 'ET';
      } else {
        // Ordering for a season's first shipment opens at the cutoff one week earlier.
        if (label) label.textContent = 'Ordering opens';
        el.textContent = fmt(next.orderBy - 7 * DAY, LONG) + ', 6' + NB + 'p.m.' + NB + 'ET';
        if (sub) sub.textContent = 'For the first shipment of the season';
      }
    });
    document.querySelectorAll('[data-ship-season]').forEach(function (el) {
      el.textContent = open ? 'In season now' : 'Resumes ' + fmt(next.ship, MONTH_YEAR);
    });

    // Upcoming shipments table
    document.querySelectorAll('[data-ship-table]').forEach(function (tbody) {
      tbody.innerHTML = '';
      list.forEach(function (r, i) {
        var notes = [];
        if (r.newSeason) notes.push(i === 0 ? 'First shipment of the new season' : 'Next season begins');
        if (r.holiday) notes.push('Tuesday because Monday is a federal holiday');
        if (r.afterBreak) notes.push('First shipment after the holiday break');
        var tr = document.createElement('tr');
        if (r.newSeason && i > 0) tr.className = 'season-break';
        tr.innerHTML = '<td>' + fmt(r.orderBy, SHORT) + ', 6' + NB + 'p.m.</td><td><strong>' + fmt(r.ship, SHORT)
          + '</strong></td><td>' + (notes.join('. ') || '&nbsp;') + '</td>';
        tbody.appendChild(tr);
      });
    });

    // Highlight this month on season strips
    var m = new Date(nowEastern().day).getUTCMonth();
    document.querySelectorAll('.season-strip').forEach(function (strip) {
      strip.querySelectorAll('.months').forEach(function (ul) {
        var cells = ul.querySelectorAll('li');
        if (cells[m]) { cells[m].classList.add('now'); cells[m].setAttribute('aria-current', 'date'); }
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
