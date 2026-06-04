// The museum-card title for the current selection. Shared by the gallery label
// (MuseumLabel) and the export filename so the two never drift.
//
// Unions are inlined rather than imported from the *.vue components: a plain .ts
// module can't see a Vue SFC's named type exports (the *.vue shim only exposes a
// default). They mirror ContentType / Shape.
export interface ArtworkMeta {
  content: 'shape' | 'text' | 'image'
  shape: 'circle' | 'yinyang' | 'illuminati' | 'pentagram'
  text: string
  imageName: string
}

// Curator-ish titles for the primitive shapes.
const SHAPE_TITLES: Record<ArtworkMeta['shape'], string> = {
  circle: 'Tondo',
  yinyang: 'Taijitu',
  illuminati: 'Illuminatus',
  pentagram: 'Pentaculum',
}

export function artworkTitle(m: Readonly<ArtworkMeta>): string {
  if (m.content === 'shape') return SHAPE_TITLES[m.shape]
  if (m.content === 'text') {
    const t = m.text.trim()
    return t ? `“${t}”` : 'Untitled'
  }
  // Image: use the file name (extension stripped) as the title.
  const name = m.imageName.replace(/\.[^.]+$/, '').trim()
  return name || 'Empty Promises'
}

// Filename-safe snake_case of an arbitrary title, e.g. “Hello World” -> hello_world.
export function snakeCase(s: string): string {
  return s
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '_')
    .replaceAll(/^_+|_+$/g, '')
}
