import { createAvatar } from '@dicebear/core';
import { AVATAR_COLOR_PALATE } from './constants';
import { identicon } from '@dicebear/collection';

export function generateAvatar(seed: string) {
  const colorIndex =
    Math.abs(seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) %
    AVATAR_COLOR_PALATE.length;
  let svg = createAvatar(identicon, { seed, size: 64 }).toString();
  svg = svg.replace(
    /fill="[^"]*"/g,
    `fill="${AVATAR_COLOR_PALATE[colorIndex]}"`
  );
  const utf8 = new TextEncoder().encode(svg);
  const base64 = btoa(String.fromCharCode(...utf8));
  return `data:image/svg+xml;base64,${base64}`;
}
