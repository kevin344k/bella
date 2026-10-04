"use client"

import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  const base = 'px-4 py-2 rounded-xl-24 font-semibold transition-transform '
  const v = variant === 'primary' ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[#242424] shadow-md' : 'bg-transparent border border-black/5 text-[#242424]'
  return (
    <button className={base + ' ' + v + ' ' + className} {...rest}>{children}</button>
  )
}
