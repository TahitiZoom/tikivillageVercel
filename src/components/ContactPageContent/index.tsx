import { FormBlock } from '@/blocks/Form/Component'
import { contactForm as seedContactForm } from '@/endpoints/seed/contact-form'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Form, FormBlock as FormBlockType, Page } from '@/payload-types'
import Link from 'next/link'

type Props = {
  locale: string
  page: {
    layout: Page['layout']
  }
}

const getFormBlock = (layout: Page['layout']) =>
  layout.find((block): block is FormBlockType => block.blockType === 'formBlock')

const copy = {
  fr: {
    title: "N'HESITEZ PAS A NOUS CONTACTER POUR PLUS D'INFORMATIONS.",
    submit: 'ENVOYER',
    fields: {
      name: 'Nom Prenom',
      phone: 'Telephone',
      email: 'E-mail',
      message: 'Message',
    },
    lead:
      'Les informations que vous nous communiquez par mail sont collectees et traitees par TIKI VILLAGE en tant que responsable du traitement, conformement au Reglement UE 2016/679 du 26 avril 2016 (reglement general sur la protection des donnees « RGPD ») et a la loi N°78-17 du 6 janvier 1978 modifiee (loi « Informatique et libertes »).',
    tail:
      'Leur utilisation a pour finalite la gestion de votre demande. Pour connaitre les details des traitements realises par TIKI VILLAGE ainsi que sur vos droits, nous vous invitons a consulter la ',
    link: 'Politique de protection des donnees personnelles.',
  },
  en: {
    title: 'DO NOT HESITATE TO CONTACT US FOR MORE INFORMATION.',
    submit: 'SEND',
    fields: {
      name: 'Full Name',
      phone: 'Phone',
      email: 'E-mail',
      message: 'Message',
    },
    lead:
      'The information you send us by email is collected and processed by TIKI VILLAGE as data controller, in accordance with Regulation EU 2016/679 of 26 April 2016 (GDPR) and applicable data protection laws.',
    tail:
      'It is used solely to manage your request. To learn more about the processing carried out by TIKI VILLAGE and your rights, please consult our ',
    link: 'Personal Data Protection Policy.',
  },
  ja: {
    title: 'オトイアワセハオキガルニドウゾ。',
    submit: 'ソウシン',
    fields: {
      name: 'オナマエ',
      phone: 'デンワ',
      email: 'Eメール',
      message: 'メッセージ',
    },
    lead:
      'メールでお送りいただく情報は、TIKI VILLAGE が管理者として取得・処理し、EU一般データ保護規則および適用される個人情報保護法令に従って取り扱います。',
    tail:
      'この情報は、お問い合わせ対応のためにのみ利用されます。処理内容およびお客様の権利の詳細については、',
    link: '個人情報保護方針',
  },
} as const

const localizeForm = (
  form: Form,
  localeCopy: (typeof copy)[keyof typeof copy],
): Form => {
  const labels = localeCopy.fields

  return {
    ...form,
    submitButtonLabel: localeCopy.submit,
    fields:
      form.fields?.map((field, index) => {
        if (!('name' in field)) return field

        const fallbackName =
          index === 0
            ? labels.name
            : index === 1
              ? labels.phone
              : index === 2
                ? labels.email
                : labels.message

        const fieldName = field.name.toLowerCase()
        const localizedLabel = fieldName.includes('mail')
          ? labels.email
          : fieldName.includes('phone') || fieldName.includes('tel')
            ? labels.phone
            : fieldName.includes('message')
              ? labels.message
              : labels.name

        return {
          ...field,
          label: localizedLabel || fallbackName,
          width: 100,
        }
      }) ?? [],
  }
}

export async function ContactPageContent({ locale, page }: Props) {
  const formBlock = getFormBlock(page.layout)
  const text = copy[(locale as keyof typeof copy) || 'fr'] ?? copy.fr
  let populatedFormBlock = formBlock

  if (formBlock && typeof formBlock.form === 'number') {
    const payload = await getPayload({ config: configPromise })
    const form = await payload.findByID({
      collection: 'forms',
      id: formBlock.form,
      depth: 0,
    })

    if (form) {
      populatedFormBlock = {
        ...formBlock,
        form: localizeForm(form, text),
      }
    }
  } else if (formBlock && typeof formBlock.form === 'object' && formBlock.form) {
    populatedFormBlock = {
      ...formBlock,
      form: localizeForm(formBlock.form as Form, text),
    }
  }

  if (!populatedFormBlock) {
    populatedFormBlock = {
      blockType: 'formBlock',
      enableIntro: false,
      form: localizeForm(seedContactForm as Form, text),
    }
  }

  return (
    <main>
      <section className="relative min-h-[1100px] overflow-hidden bg-[#f5f5f5]">
        <div className="absolute inset-0">
          <img
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-[22%_center]"
            src="/images/contact-page.jpg"
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[1100px] w-full max-w-[1720px] items-center px-6 py-16 md:px-10 xl:px-16">
          <div className="ml-auto w-full max-w-[880px] bg-white px-8 py-8 md:px-14 md:py-10">
            <img
              alt=""
              aria-hidden
              className="mb-6 h-auto w-[108px]"
              src="/images/bg-frise-horiz-v2-1280.svg"
            />
            <h1 className="mb-6 font-[Dosis,sans-serif] text-[32px] font-normal uppercase leading-[1.15] text-[#0e4850] md:text-[35px]">
              {text.title}
            </h1>

            {populatedFormBlock && (
              <FormBlock {...populatedFormBlock} appearance="contact" enableIntro={false} />
            )}

            <p className="mt-6 font-[Dosis,sans-serif] text-[17px] leading-[1.9] text-[#8a8a8a]">
              {text.lead} {text.tail}
              <Link
                className="text-[#c05b84] underline underline-offset-2"
                href={`/${locale}/confidentialite`}
              >
                {text.link}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
