'use client'

import type { Product } from '@/payload-types'
import { formatXPF, type SupportedLocale } from '@/data/commerceProducts'
import { useEffect, useState } from 'react'

type Labels = {
  adults: string
  children: string
  bookingDate: string
  transferAdults: string
  transferChildren: string
  reserve: string
  available: string
  reservationCost: string
}

type Props = {
  locale: SupportedLocale
  labels: Labels
  product: Product
}

const calendarLabels: Record<SupportedLocale, { weekdays: string[]; months: string[] }> = {
  fr: {
    weekdays: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    months: [
      'JANVIER',
      'FEVRIER',
      'MARS',
      'AVRIL',
      'MAI',
      'JUIN',
      'JUILLET',
      'AOUT',
      'SEPTEMBRE',
      'OCTOBRE',
      'NOVEMBRE',
      'DECEMBRE',
    ],
  },
  en: {
    weekdays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    months: [
      'JANUARY',
      'FEBRUARY',
      'MARCH',
      'APRIL',
      'MAY',
      'JUNE',
      'JULY',
      'AUGUST',
      'SEPTEMBER',
      'OCTOBER',
      'NOVEMBER',
      'DECEMBER',
    ],
  },
  ja: {
    weekdays: ['月', '火', '水', '木', '金', '土', '日'],
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  },
}

const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
const addMonths = (date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1)
const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const fromBlockedDate = (value: string | null | undefined) => {
  if (!value) return null
  return value.slice(0, 10)
}

const getMonthGrid = (month: Date) => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const start = addDays(first, -offset)

  return Array.from({ length: 42 }).map((_, index) => addDays(start, index))
}

export function ProductBookingForm({ locale, labels, product }: Props) {
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [transferAdults, setTransferAdults] = useState(0)
  const [transferChildren, setTransferChildren] = useState(0)

  const today = startOfDay(new Date())
  const minDate = addDays(today, product.booking?.minAdvanceDays ?? 0)
  const maxMonth = addMonths(minDate, Math.max((product.booking?.maxAdvanceMonths ?? 12) - 1, 0))
  const blockedDates = new Set((product.booking?.blockedDates ?? []).map((item) => fromBlockedDate(item?.date)).filter(Boolean))
  const availableDays = new Set(product.booking?.availableDays ?? [])
  const labelsForLocale = calendarLabels[locale]

  const isBookableDate = (date: Date) => {
    const day = startOfDay(date)

    if (day < minDate) return false
    if (day > new Date(maxMonth.getFullYear(), maxMonth.getMonth() + 1, 0)) return false
    if (availableDays.size && !availableDays.has(dayMap[day.getDay()])) return false
    if (blockedDates.has(toDateKey(day))) return false

    return true
  }

  const findFirstBookableDate = (month: Date) => {
    for (const day of getMonthGrid(month)) {
      if (day.getMonth() !== month.getMonth()) continue
      if (isBookableDate(day)) return day
    }

    return null
  }

  const [visibleMonth, setVisibleMonth] = useState(new Date(minDate.getFullYear(), minDate.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState<string>('')

  useEffect(() => {
    if (selectedDate) return
    const firstBookableDate = findFirstBookableDate(visibleMonth)
    if (firstBookableDate) {
      setSelectedDate(toDateKey(firstBookableDate))
      return
    }

    for (let index = 1; index < 12; index += 1) {
      const nextMonth = addMonths(visibleMonth, index)
      const nextBookableDate = findFirstBookableDate(nextMonth)

      if (nextBookableDate) {
        setVisibleMonth(nextMonth)
        setSelectedDate(toDateKey(nextBookableDate))
        return
      }
    }
  }, [selectedDate, visibleMonth])

  const total =
    adults * (product.pricing?.priceAdult ?? 0) +
    children * (product.pricing?.priceChild ?? 0) +
    transferAdults * (product.transferOptions?.transferPriceAdult ?? 0) +
    transferChildren * (product.transferOptions?.transferPriceChild ?? 0)

  const monthGrid = getMonthGrid(visibleMonth)
  const canGoPrev = visibleMonth > new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  const canGoNext = visibleMonth < maxMonth

  return (
    <div className="mt-12 border border-[#e5e5e5] p-8">
      <input name="date" type="hidden" value={selectedDate} />

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-[#303030]">
            {labels.adults}
          </span>
          <select
            className="w-full border border-[#b4b4b4] px-4 py-3 text-[22px] text-[#444]"
            name="adults"
            onChange={(event) => setAdults(Number(event.target.value))}
            value={adults}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-[#303030]">
            {labels.children}
          </span>
          <select
            className="w-full border border-[#b4b4b4] px-4 py-3 text-[22px] text-[#444]"
            name="children"
            onChange={(event) => setChildren(Number(event.target.value))}
            value={children}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <option key={index} value={index}>
                {index}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8">
        <div className="mb-2 font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-[#303030]">
          {labels.bookingDate}
        </div>

        <div className="overflow-hidden border border-[#d9d9d9] bg-white">
          <div className="grid grid-cols-[64px_1fr_64px] items-center bg-[#b8b8b8] text-white">
            <button
              className="h-[72px] text-[24px] transition hover:bg-[#a5a5a5] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canGoPrev}
              onClick={() => canGoPrev && setVisibleMonth(addMonths(visibleMonth, -1))}
              type="button"
            >
              ‹
            </button>
            <div className="text-center font-[Roboto_Condensed,sans-serif] text-[32px] uppercase tracking-[0.04em]">
              {labelsForLocale.months[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
            </div>
            <button
              className="h-[72px] text-[24px] transition hover:bg-[#a5a5a5] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canGoNext}
              onClick={() => canGoNext && setVisibleMonth(addMonths(visibleMonth, 1))}
              type="button"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-[#ececec] bg-white">
            {labelsForLocale.weekdays.map((weekday) => (
              <div
                key={weekday}
                className="py-5 text-center font-[Roboto_Condensed,sans-serif] text-[20px] uppercase text-[#b7b7b7]"
              >
                {weekday}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {monthGrid.map((day) => {
              const key = toDateKey(day)
              const isCurrentMonth = day.getMonth() === visibleMonth.getMonth()
              const isAvailable = isCurrentMonth && isBookableDate(day)
              const isSelected = selectedDate === key

              return (
                <button
                  key={key}
                  className={[
                    'flex aspect-square items-center justify-center border-b border-r border-[#ececec] font-[Roboto_Condensed,sans-serif] text-[22px] transition',
                    isSelected ? 'bg-[#10b765] text-white' : '',
                    !isSelected && isAvailable ? 'bg-[#35cf72] text-white hover:bg-[#27bf62]' : '',
                    !isAvailable ? 'bg-white text-[#c7c7c7]' : '',
                    !isCurrentMonth ? 'opacity-55' : '',
                  ].join(' ')}
                  disabled={!isAvailable}
                  onClick={() => setSelectedDate(key)}
                  type="button"
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        {product.booking?.availableDays?.length ? (
          <p className="mt-4 text-[20px] leading-[1.6] text-[#8a8a8a]">
            {labels.available}:{' '}
            {product.booking.availableDays
              .map((day) => {
                const index = dayMap.indexOf(day as (typeof dayMap)[number])
                return labelsForLocale.weekdays[(index + 6) % 7] ?? day
              })
              .join(', ')}
          </p>
        ) : null}
      </div>

      {product.transferOptions?.hasTransfer ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-[#303030]">
              {labels.transferAdults} (+{formatXPF(product.transferOptions.transferPriceAdult ?? 0)})
            </span>
            <select
              className="w-full border border-[#b4b4b4] px-4 py-3 text-[22px] text-[#444]"
              name="transferAdults"
              onChange={(event) => setTransferAdults(Number(event.target.value))}
              value={transferAdults}
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <option key={index} value={index}>
                  {index}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-[#303030]">
              {labels.transferChildren} (+{formatXPF(product.transferOptions.transferPriceChild ?? 0)})
            </span>
            <select
              className="w-full border border-[#b4b4b4] px-4 py-3 text-[22px] text-[#444]"
              name="transferChildren"
              onChange={(event) => setTransferChildren(Number(event.target.value))}
              value={transferChildren}
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <option key={index} value={index}>
                  {index}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <>
          <input name="transferAdults" type="hidden" value="0" />
          <input name="transferChildren" type="hidden" value="0" />
        </>
      )}

      <p className="mt-8 font-[Dosis,sans-serif] text-[28px] font-normal text-[#0b4b54]">
        {labels.reservationCost}: {formatXPF(total)}
      </p>

      <button
        className="mt-8 inline-flex bg-[#a984cf] px-8 py-4 font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-white transition hover:bg-[#8b68b5] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!selectedDate}
        type="submit"
      >
        {labels.reserve}
      </button>
    </div>
  )
}
