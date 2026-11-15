// Picks a logo and brand colour from the platform/store NAME (never from its id),
// so new platforms or stores get a logo automatically when the name matches.
// The first matching rule wins, so the specific ones go first.
const BRANDS = [
  // Same PlayStation logo for every generation; the colour tells them apart.
  { match: /psp|playstation portable/i, icon: 'playstation', color: '#2B2D42' },
  { match: /playstation\s*5|\bps5\b/i, icon: 'playstation', color: '#0070D1' },
  { match: /playstation\s*4|\bps4\b/i, icon: 'playstation', color: '#003791' },
  { match: /playstation\s*3|\bps3\b/i, icon: 'playstation', color: '#1F1F1F' },
  { match: /playstation\s*2|\bps2\b/i, icon: 'playstation', color: '#0B1E6B' },
  { match: /playstation\s*store|\bpsn\b/i, icon: 'playstation', color: '#0070D1' },
  { match: /playstation/i, icon: 'playstation', color: '#5B6770' },
  { match: /switch/i, icon: 'nintendo-switch', color: '#E60012' },
  { match: /wii\s*u/i, icon: 'wiiu', color: '#009AC7' },
  { match: /\bwii\b/i, icon: 'wii', color: '#34BEED' },
  { match: /3ds/i, icon: 'nintendo-3ds', color: '#CE181E' },
  { match: /xbox/i, icon: 'xbox', color: '#107C10' },
  { match: /steam/i, icon: 'steam', color: '#1B2838' },
  { match: /epic/i, icon: 'epicgames', color: '#313131' },
  { match: /\bgog\b/i, icon: 'gogdotcom', color: '#86328A' },
  { match: /battle\.?net|blizzard/i, icon: 'battledotnet', color: '#148EFF' },
  { match: /microsoft/i, icon: 'microsoft', color: '#0078D4' },
  { match: /nintendo|\bds\b|eshop/i, icon: 'nintendo', color: '#E60012' },
  { match: /^pc$|windows/i, icon: 'windows', color: '#0078D4' },
]

export function findBrand(name) {
  return BRANDS.find((brand) => brand.match.test(name ?? '')) ?? null
}

// Name whose logo represents a game. On PC the store says more than the
// Windows logo, so digital PC games use their store (Steam, Epic, GOG…).
export function gameBrandName(game) {
  const platform = game.platform?.platformName
  const store = game.isDigital ? game.digitalPlatform?.digitalPlatformName : undefined
  return store && /^pc$|windows/i.test(platform ?? '') && findBrand(store) ? store : platform
}
