import { submitCheckout } from '@/app/(frontend)/actions/bookingCart'
import { formatXPF, type SupportedLocale } from '@/data/commerceProducts'
import type { BookingCartItem } from '@/utilities/bookingCart'
import type { Product } from '@/payload-types'
import { calculateCartItemTotal } from '@/utilities/bookingCart'
import { resolveLocalizedValue } from '@/utilities/localizedValue'

type Props = {
  locale: SupportedLocale
  cart: BookingCartItem | null
  product: Product | null
}

const copy = {
  fr: {
    title: 'Détails de facturation',
    notes: 'Informations complémentaires',
    order: 'Votre commande',
    submit: 'Commander',
    company: "Nom de l'entreprise (facultatif)",
    terms: "J'ai lu et j'accepte les conditions générales",
    payment: 'Paiement par carte bancaire',
  },
  en: {
    title: 'Billing details',
    notes: 'Additional information',
    order: 'Your order',
    submit: 'Place order',
    company: 'Company name (optional)',
    terms: 'I have read and accept the terms and conditions',
    payment: 'Payment by credit card',
  },
  ja: {
    title: '請求情報',
    notes: '追加情報',
    order: 'ご注文内容',
    submit: '注文する',
    company: '会社名（任意）',
    terms: '利用規約に同意します',
    payment: 'クレジットカード決済',
  },
} as const

export function CheckoutPageContent({ locale, cart, product }: Props) {
  const text = copy[locale]

  if (!cart || !product) {
    return null
  }

  const totals = calculateCartItemTotal(product, cart)
  const productName = resolveLocalizedValue(product.name, locale, product.slug)

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-18">
      <form action={submitCheckout}>
        <input type="hidden" name="locale" value={locale} />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h1 className="mb-6 text-[42px] font-normal text-[#7a7a7a]">{text.title}</h1>
                <div className="grid gap-4">
                  <input className="border border-[#a5a5a5] px-4 py-3 text-[22px]" name="firstName" placeholder="Prénom" required />
                  <input className="border border-[#a5a5a5] px-4 py-3 text-[22px]" name="lastName" placeholder="Nom" required />
                  <input className="border border-[#a5a5a5] px-4 py-3 text-[22px]" name="company" placeholder={text.company} />
                  <input className="border border-[#a5a5a5] px-4 py-3 text-[22px]" defaultValue="Polynésie Française" name="country" placeholder="Pays / région" required />
                  <input className="border border-[#a5a5a5] px-4 py-3 text-[22px]" name="address1" placeholder="Numéro et nom de rue" />
                  <input className="border border-[#a5a5a5] px-4 py-3 text-[22px]" name="address2" placeholder="Bâtiment, appartement, lot..." />
                  <input className="border border-[#a5a5a5] px-4 py-3 text-[22px]" name="city" placeholder="Ville" />
                  <input className="border border-[#a5a5a5] px-4 py-3 text-[22px]" name="region" placeholder="Région / Département" />
                  <input className="border border-[#a5a5a5] px-4 py-3 text-[22px]" name="postalCode" placeholder="Code postal" />
                  <input className="border border-[#a5a5a5] px-4 py-3 text-[22px]" name="phone" placeholder="Téléphone" />
                  <input className="border border-[#a5a5a5] px-4 py-3 text-[22px]" name="email" placeholder="Adresse e-mail" required type="email" />
                </div>
              </div>

              <div>
                <h2 className="mb-6 text-[42px] font-normal text-[#7a7a7a]">{text.notes}</h2>
                <textarea className="min-h-[220px] w-full border border-[#a5a5a5] px-4 py-3 text-[22px]" name="orderNotes" placeholder="Commentaires concernant votre commande" />
              </div>
            </div>
          </section>

          <aside>
            <h2 className="mb-6 text-[42px] font-normal text-[#7a7a7a]">{text.order}</h2>
            <div className="border border-[#d1d1d1]">
              <div className="grid grid-cols-[1fr_180px] border-b border-[#d1d1d1] bg-[#fafafa] px-5 py-4 text-[22px] font-semibold text-[#5b5b5b]">
                <span>Produit</span>
                <span>Sous-total</span>
              </div>
              <div className="grid grid-cols-[1fr_180px] border-b border-[#d1d1d1] px-5 py-5 text-[20px] text-[#7a7a7a]">
                <div>
                  <div>{productName} × 1</div>
                  <div>Date de réservation : {cart.date}</div>
                  <div>Adulte : {cart.adults}</div>
                  {product.pricing?.hasPersonTypes ? <div>Enfant - 12 ans : {cart.children}</div> : null}
                </div>
                <div>{formatXPF(totals.total)}</div>
              </div>
              <div className="grid grid-cols-[1fr_180px] border-b border-[#d1d1d1] px-5 py-4 text-[22px] font-semibold text-[#5b5b5b]">
                <span>Sous-total</span>
                <span>{formatXPF(totals.total)}</span>
              </div>
              <div className="grid grid-cols-[1fr_180px] px-5 py-4 text-[24px] font-semibold text-[#5b5b5b]">
                <span>Total</span>
                <span>{formatXPF(totals.total)}</span>
              </div>
            </div>

            <div className="mt-8 border border-[#ebe6ef] bg-[#f7f4fa] p-5">
              <div className="text-[22px] text-[#7a7a7a]">{text.payment}</div>
              <div className="mt-4 bg-[#ece7f0] px-4 py-5 text-[20px] text-[#8a8a8a]">
                Vous allez saisir les informations de paiement après confirmation de la commande.
              </div>
              <label className="mt-6 flex items-start gap-3 text-[20px] leading-[1.5] text-[#8a8a8a]">
                <input className="mt-1" name="terms" required type="checkbox" value="accepted" />
                <span>{text.terms}</span>
              </label>
              <button className="mt-8 inline-flex bg-[#8f73c8] px-8 py-4 font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-white transition hover:bg-[#7c63b0]" type="submit">
                {text.submit}
              </button>
            </div>
          </aside>
        </div>
      </form>
    </main>
  )
}
