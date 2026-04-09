import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div className="w-10 h-10 bg-gradient-to-br from-tiki-primary to-tiki-secondary rounded-full flex items-center justify-center text-white font-semibold text-lg">
        TV
      </div>
      <span className="hidden sm:inline font-display font-semibold text-lg text-tiki-primary">
        Tiki Village
      </span>
    </Link>
  )
}
