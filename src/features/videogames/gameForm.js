// Converts between the API game, the form state and the request body.

export function toFormValues(game) {
  return {
    videogameName: game?.videogameName ?? '',
    videogameType: game?.videogameType ?? '',
    videogameYear: game?.videogameYear ?? '',
    companyName: game?.companyName ?? '',
    platformId: game?.platform?.id ? String(game.platform.id) : '',
    isDigital: game?.isDigital ?? false,
    digitalPlatformId: game?.digitalPlatform?.id ? String(game.digitalPlatform.id) : '',
    isCompleted: game?.isCompleted ?? false,
    isPlatinum: game?.isPlatinum ?? false,
    multiplayer: game?.multiplayer ?? false,
    hoursPlayed: game?.hoursPlayed ?? '',
    coverUrl: game?.coverUrl ?? '',
  }
}

export function validate(values) {
  const errors = {}
  if (!values.videogameName.trim()) errors.videogameName = 'El nombre es obligatorio.'
  if (!values.platformId) errors.platformId = 'Elige una plataforma.'
  if (values.isDigital && !values.digitalPlatformId) errors.digitalPlatformId = 'Un juego digital necesita una tienda.'
  if (values.videogameYear.trim() && !/^\d{4}$/.test(values.videogameYear.trim()))
    errors.videogameYear = 'Usa 4 cifras, por ejemplo 2019.'
  const hours = String(values.hoursPlayed).trim()
  if (hours && !/^\d+$/.test(hours)) errors.hoursPlayed = 'Un número entero de 0 en adelante (o vacío = desconocidas).'
  const cover = values.coverUrl.trim()
  if (cover && (!isHttpUrl(cover) || cover.length > 2048))
    errors.coverUrl = 'Debe ser una dirección http:// o https:// (máximo 2048 caracteres).'
  return errors
}

// Same rule as the backend: http(s):// followed by no spaces.
export const isHttpUrl = (text) => /^https?:\/\/\S+$/.test(text)

// Full body as the API expects it: 0/1 for isDigital/isCompleted/isPlatinum,
// boolean for multiplayer, null for "unknown hours" or "no store".
function toBody(values) {
  const hours = String(values.hoursPlayed).trim()
  return {
    videogameName: values.videogameName.trim(),
    videogameType: values.videogameType.trim(),
    videogameYear: values.videogameYear.trim(),
    companyName: values.companyName.trim(),
    platformId: Number(values.platformId),
    isDigital: values.isDigital ? 1 : 0,
    digitalPlatformId: values.isDigital ? Number(values.digitalPlatformId) : null,
    isCompleted: values.isCompleted ? 1 : 0,
    isPlatinum: values.isPlatinum ? 1 : 0,
    multiplayer: values.multiplayer,
    hoursPlayed: hours === '' ? null : Number(hours),
    coverUrl: values.coverUrl.trim() || null, // null clears it on PATCH
  }
}

// POST: leave out empty optional fields. id and steamAppId are never sent.
export function toCreateBody(values) {
  return Object.fromEntries(
    Object.entries(toBody(values)).filter(([, value]) => value !== null && value !== ''),
  )
}

// PATCH: send only what changed (omitted fields are kept by the backend).
export function toPatchBody(values, game) {
  const before = toBody(toFormValues(game))
  return Object.fromEntries(Object.entries(toBody(values)).filter(([key, value]) => value !== before[key]))
}
