import clsx from 'clsx'
import React from 'next/link'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <div className="w-10 h-10 bg-gradient-to-br from-[#D4504A] to-[#FFA500] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        TV
      </div>
      <span className="hidden sm:inline font-serif font-bold text-lg text-[#D4504A]">
        Tiki Village
      </span>
    </div>
  )
}
