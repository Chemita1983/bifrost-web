import { Gamepad2, Monitor, Store } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CatalogPage } from '@/features/catalogs/CatalogPage'
import { SteamSyncButton } from '@/features/steam/SteamSyncButton'
import { GamesPage } from '@/features/videogames/GamesPage'

// Single page: a header plus three tabs. No router needed yet.
export default function App() {
  return (
    <Tabs defaultValue="games" className="min-h-dvh gap-0">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="h-0.5 bifrost-gradient" aria-hidden="true" />
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-lg bifrost-gradient text-white shadow-lg">
              <Gamepad2 className="size-5" aria-hidden="true" />
            </div>
            <span className="bg-clip-text text-xl font-black tracking-tight text-transparent bifrost-gradient">Bifröst</span>
          </div>
          <TabsList className="order-last w-full sm:order-none sm:ml-6 sm:w-auto">
            <TabsTrigger value="games"><Gamepad2 /> Juegos</TabsTrigger>
            <TabsTrigger value="platforms"><Monitor /> Plataformas</TabsTrigger>
            <TabsTrigger value="stores"><Store /> Tiendas</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-1">
            <SteamSyncButton />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        <TabsContent value="games"><GamesPage /></TabsContent>
        <TabsContent value="platforms"><CatalogPage type="platforms" /></TabsContent>
        <TabsContent value="stores"><CatalogPage type="stores" /></TabsContent>
      </main>
    </Tabs>
  )
}
