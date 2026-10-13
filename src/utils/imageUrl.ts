export function imageUrl(source: string): string {
  if (!source || source.startsWith('/') || /^https?:\/\//.test(source)) return source;
  return `/${source}`;
}
