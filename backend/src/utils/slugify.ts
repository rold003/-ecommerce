const COMBINING_DIACRITICS_START = 0x0300;
const COMBINING_DIACRITICS_END = 0x036f;

function stripDiacritics(text: string): string {
  return Array.from(text.normalize('NFD'))
    .filter((char) => {
      const code = char.codePointAt(0) ?? 0;
      return code < COMBINING_DIACRITICS_START || code > COMBINING_DIACRITICS_END;
    })
    .join('');
}

export function slugify(text: string): string {
  return stripDiacritics(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
