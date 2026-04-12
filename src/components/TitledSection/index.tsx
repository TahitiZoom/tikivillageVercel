import { ReactNode } from 'react'

interface TitledSectionProps {
  title: ReactNode
  children?: ReactNode
  width?: number
  level?: 'h1' | 'h2' | 'h3'
  className?: string
  width_frize?: number
}

export const TitledSection = ({
  title,
  children,
  width = 520,
  level = 'h2',
  className = '',
  width_frize = width,
}: TitledSectionProps) => {
  const FriezeBand = ({ width = 520, height = 50 }: { width?: number; height?: number }) => {
    return (
      <div
        aria-hidden
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: `${width}px`,
          height: `${height}px`,
          marginBottom: '1.6rem',
        }}
      >
        <img
          src="/images/bg-frise-horiz-v2-1280.svg"
          alt=""
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'left center',
          }}
        />
        <img
          src="/images/birds-turquoise.svg"
          alt=""
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'left center',
            zIndex: 10,
          }}
        />
      </div>
    )
  }

  const TitleTag = level

  return (
    <div>
      <FriezeBand width={width_frize} />
      {/* @ts-ignore */}
      <TitleTag className={className}>{title}</TitleTag>
      {children}
    </div>
  )
}
