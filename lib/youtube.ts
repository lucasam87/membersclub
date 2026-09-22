// Extrai o ID de video de varios formatos de URL do YouTube:
// watch?v=ID, youtu.be/ID, embed/ID, shorts/ID.
export function getYoutubeId(url: string): string | null {
  try {
    const u = new URL(url)

    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1) || null
    }

    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v

      const match = u.pathname.match(/\/(embed|shorts)\/([^/?]+)/)
      if (match) return match[2]
    }

    return null
  } catch {
    return null
  }
}

export function getYoutubeThumbnail(url: string): string | null {
  const id = getYoutubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
