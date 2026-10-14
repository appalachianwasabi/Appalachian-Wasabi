/*
  PRODUCTS: the shop page builds itself from this list.

  To add a product, copy one block below, remove the two slashes (//) at the
  start of each line, and fill it in. To hide a product, delete its block.
  While this list is empty, the shop page shows a "opening soon" message.

  Fields:
    name        Product name
    price       Shown as text, e.g. "$24"  (set the real price in Square too)
    description One or two short sentences
    image       Photo file in the repo, e.g. "product-rhizome.jpg" (optional)
    link        The Square payment link for this product (starts with https://square.link/)
    soldOut     true to show "Sold out" and disable the button (optional)
    fresh       true for fresh rhizomes and plant starts (optional)
                  - The card shows a green "Fresh · ships Mon, Oct 19" tag with the
                    order-by deadline, worked out automatically from ship.js.
                  - Outside the spring and fall seasons the button changes to
                    "Out of season" by itself. Ordering reopens the week before
                    each season's first shipment.
                Leave it out (or false) for everything else; those cards say
                "Ships in 2–3 business days".

  Examples:

  {
    name: "Fresh wasabi rhizome",
    price: "$00",
    description: "Whole rhizome, harvested to order and shipped cold.",
    image: "product-rhizome.jpg",
    link: "https://square.link/u/PASTE-YOUR-LINK-HERE",
    fresh: true,
    soldOut: false
  },

  {
    name: "Wasabi plant start",
    price: "$00",
    description: "A young plant, shipped bare-root with cold packs. See our Growing Guide.",
    image: "product-start.jpg",
    link: "https://square.link/u/PASTE-YOUR-LINK-HERE",
    fresh: true
  },

  {
    name: "Sharkskin grater",
    price: "$00",
    description: "The traditional tool for a fine, fluffy grate.",
    link: "https://square.link/u/PASTE-YOUR-LINK-HERE"
  },
*/

window.PRODUCTS = [

];
