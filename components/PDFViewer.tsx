"use client"

import dynamic from 'next/dynamic'
import React from 'react'

// Dynamically import the client-only PDF component to avoid server-side pdfjs import
const ClientPDF = dynamic(() => import('./ClientPDF'), { ssr: false })

type Props = { file: string }

export default function PDFViewer({ file }: Props) {
  return (
    <div>
      <ClientPDF file={file} />
    </div>
  )
}
