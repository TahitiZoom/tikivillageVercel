'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Form as PayloadForm } from '@/payload-types'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'

export type FormBlockType = {
  blockName?: string | null
  blockType?: 'formBlock'
  enableIntro: boolean
  form: number | PayloadForm
  introContent?: DefaultTypedEditorState | null
  appearance?: 'default' | 'contact'
}

export const FormBlock: React.FC<
  {
    id?: string | null
  } & FormBlockType
> = (props) => {
  const {
    appearance = 'default',
    enableIntro,
    form: formFromProps,
    introContent,
  } = props

  const form =
    formFromProps && typeof formFromProps === 'object' ? (formFromProps as PayloadForm) : undefined
  const formID = form?.id
  const confirmationMessage = form?.confirmationMessage
  const confirmationType = form?.confirmationType
  const redirect = form?.redirect
  const submitButtonLabel = form?.submitButtonLabel

  const formMethods = useForm({
    defaultValues: (form?.fields as unknown as Record<string, unknown>) || undefined,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Record<string, unknown>) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className={appearance === 'contact' ? 'w-full' : 'container lg:max-w-[48rem]'}>
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div
        className={
          appearance === 'contact'
            ? 'border-0 p-0 rounded-none'
            : 'p-4 lg:p-6 border border-border rounded-[0.8rem]'
        }
      >
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && confirmationMessage && (
            <RichText data={confirmationMessage} />
          )}
          {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
          {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
          {!hasSubmitted && (
            <form id={formID ? String(formID) : undefined} onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 last:mb-0">
                {form &&
                  form.fields &&
                  form.fields?.map((field, index) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                    if (Field) {
                      return (
                        <div className="mb-6 last:mb-0" key={index}>
                          <Field
                            appearance={appearance}
                            form={form as unknown as FormType}
                            {...field}
                            {...formMethods}
                            control={control}
                            errors={errors}
                            register={register}
                          />
                        </div>
                      )
                    }
                    return null
                  })}
              </div>

              <Button
                className={
                  appearance === 'contact'
                    ? 'h-[42px] w-full rounded-none bg-[#9d567c] px-6 text-[17px] font-normal uppercase text-white shadow-none hover:bg-[#87486b]'
                    : undefined
                }
                form={formID ? String(formID) : undefined}
                type="submit"
                variant="default"
              >
                {submitButtonLabel}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
