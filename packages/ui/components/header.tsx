'use client'

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-semibold">Card Top-Up</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Automatically top up your card when balance drops below threshold
        </p>
      </div>
    </header>
  )
}
