import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Email: React.FC<
  EmailField & {
    appearance?: 'default' | 'contact'
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ appearance = 'default', name, defaultValue, errors, label, register, required, width }) => {
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
      <Input
        className={
          appearance === 'contact'
            ? 'h-[48px] rounded-none border-[#7f7f7f] bg-white px-4 text-[16px] text-[#555] placeholder:text-[#b7b7b7] focus-visible:ring-0 focus-visible:outline-[#7f7f7f]'
            : undefined
        }
        defaultValue={defaultValue}
        id={name}
        placeholder={appearance === 'contact' ? `${label || ''}${required ? '*' : ''}` : undefined}
        type="text"
        {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required })}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
