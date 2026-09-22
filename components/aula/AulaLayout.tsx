export function AulaLayout({
  nav,
  video,
  painel,
}: {
  nav: React.ReactNode
  video: React.ReactNode
  painel: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] lg:items-start">
      <div className="order-2 border-border lg:order-1 lg:h-[calc(100vh-65px)] lg:overflow-y-auto lg:border-r">
        {nav}
      </div>
      <div className="order-1 p-4 lg:order-2">{video}</div>
      <div className="order-3 border-border lg:h-[calc(100vh-65px)] lg:overflow-y-auto lg:border-l">
        {painel}
      </div>
    </div>
  )
}
