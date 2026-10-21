/**
 * Generates clean, offline-safe SVG placeholder "packages" as data-URIs.
 * Used until you provide real product photos (see data/products.ts).
 */

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** "Lucky Me! Pancit Canton" -> "LM" */
export function initialsOf(text: string): string {
  return text
    .split(/\s+/)
    .map((word) => Array.from(word).find((ch) => /\p{L}/u.test(ch)) ?? '')
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function placeholderImage(label: string, hue = 150): string {
  const bg = `hsl(${hue}, 38%, 93%)`;
  const blob = `hsl(${hue}, 42%, 84%)`;
  const pack = `hsl(${hue}, 52%, 36%)`;
  const packLight = `hsl(${hue}, 58%, 46%)`;

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
<rect width='400' height='400' fill='${bg}'/>
<circle cx='200' cy='210' r='140' fill='${blob}'/>
<rect x='125' y='95' width='150' height='210' rx='22' fill='${pack}'/>
<rect x='125' y='95' width='150' height='46' rx='22' fill='${packLight}'/>
<rect x='145' y='180' width='110' height='70' rx='14' fill='white' fill-opacity='0.92'/>
<text x='200' y='228' font-family='Georgia, serif' font-size='40' font-weight='700' text-anchor='middle' fill='${pack}'>${escapeXml(label)}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
