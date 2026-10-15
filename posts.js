/*
  JOURNAL POSTS: the Journal page and the home page build their post lists from this file.

  To publish a new post:
    1. Copy one of the journal-*.html files, give it a new name (e.g. journal-spring-harvest.html),
       and change its title, date, words and photo.
    2. Add an entry for it at the TOP of the list below (newest first).

  Fields:
    slug     The post's file name, e.g. "journal-spring-harvest.html"
    title    Post title
    date     "YYYY-MM-DD"
    tag      A short label, e.g. "Farm notes", "Kitchen", "Shipping", "Growing"
    excerpt  One sentence shown on the cards
    image    Photo file for the card (optional; leave "" for none)
*/

window.POSTS = [
  { slug: "journal-grating-fresh-wasabi.html", title: "Grating fresh wasabi, start to finish", date: "2026-10-15", tag: "Kitchen", excerpt: "A fine grater, slow circles and a fifteen-minute window: how to get the most out of a fresh rhizome.", image: "" },
  { slug: "journal-why-we-ship-on-mondays.html", title: "Why fresh orders ship on Mondays", date: "2026-10-15", tag: "Shipping", excerpt: "Living plants and fresh rhizomes don’t belong in a warehouse over the weekend. Here’s how our weekly schedule works.", image: "grow-site-2.jpg" },
  { slug: "journal-it-started-with-a-question.html", title: "It started with a question", date: "2026-10-15", tag: "Farm notes", excerpt: "“I wonder if we can grow wasabi in the holler?” How a curious experiment turned into a farm.", image: "grow-site-1.jpg" }
];
