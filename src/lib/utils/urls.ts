export function ensureValidURL(url: string): string {
  if (!url) return ''

  // Check if URL already has a protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Add https:// if the URL starts with www. or doesn't have a protocol
  return `https://${url.startsWith('www.') ? '' : 'www.'}${url}`
}
