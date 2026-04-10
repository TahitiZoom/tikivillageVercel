import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Textarea: React.FC<
  TextField & {
    appearance?: 'default' | 'contact'
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    rows?: number
  }
> = ({
  appearance = 'default',
  name,
  defaultValue,
  errors,
  label,
  register,
  required,
  rows = 3,
  width,
}) => {
  return (
    <Width width={width}>
      {appearance !== 'contact' && (
        <Label htmlFor={name}>
          {label}

          {required && (
            <span className="required">
              * <span className="sr-only">(required)</span>
            </span>
          )}
        </Label>
      )}

      <TextAreaComponent
        className={
          appearance === 'contact'
            ? 'min-h-[84px] rounded-none border-[#7f7f7f] bg-white px-4 py-3 text-[16px] text-[#555] placeholder:text-[#b7b7b7] focus-visible:ring-0 focus-visible:outline-[#7f7f7f]'
            : undefined
        }
        defaultValue={defaultValue}
        id={name}
        placeholder={appearance === 'contact' ? `${label || ''}${required ? '*' : ''}` : undefined}
        rows={appearance === 'contact' ? 4 : rows}
        {...register(name, { required: required })}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
