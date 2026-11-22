// Glyph sets for the ASCII globe (src/components/Globe.astro).
// Clicking the globe cycles through them in this order, and the first one is
// the default. To add a script, add an entry here; nothing else needs changing.
//
//  id:     short name, saved for the tab session and used in the aria-label
//  glyphs: the characters to shuffle. Standalone characters only: combining
//          vowel signs or virama (e.g. ा ি ্) attach to their neighbour and
//          would break the grid.
//  label:  the Kolkata pin label in this script
//  numerals: digit style for the Kolkata clock beside the label, as a Unicode
//          numbering system ("latn" = 0-9, "deva" = ०-९, "beng" = ০-৯)
//  font:   Google Fonts family for scripts JetBrains Mono doesn't cover, or
//          null. These glyphs are drawn slightly smaller inside the mono cell
//          so the disc stays round. astro.config.mjs self-hosts the fonts.
//  subset: Google Fonts subset holding this script's glyphs (with `font`)
export const GLYPH_SETS = [
  {
    id: "default",
    glyphs:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" +
      "ÀÂÄÃÅÆÇÉÊËÌÎÏÑÕÖØÙÛÜÝßàâäãåæçéêëîïñõöøûüýÿĀăĞğİŁłŒœŞşŦŧŽž" +
      "ΓΔΘΛΞΠΣΦΨΩαβγδεζηθλμξπσφψω" +
      "БГДЖЗИЙЛПФЦЧШЩЪЫЬЭЮЯбвгджзийклмнптфцчшщъыьэюяѣѲ",
    label: "kolkata",
    numerals: "latn",
    font: null,
  },
  {
    id: "hindi",
    glyphs: "अआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह०१२३४५६७८९",
    label: "कोलकाता",
    numerals: "deva",
    font: "Noto Sans Devanagari",
    subset: "devanagari",
  },
  {
    id: "bengali",
    glyphs: "অআইঈউঊএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়ৎ০১২৩৪৫৬৭৮৯",
    label: "কলকাতা",
    numerals: "beng",
    font: "Noto Sans Bengali",
    subset: "bengali",
  },
];

// CSS variable Astro's Fonts API exposes for a glyph set's font,
// e.g. "Noto Sans Bengali" -> "--font-noto-sans-bengali".
export const fontVar = (font) =>
  `--font-${font.toLowerCase().replaceAll(" ", "-")}`;
