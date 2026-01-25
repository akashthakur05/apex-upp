'use client'

import { useMemo, useEffect, useRef } from 'react'
import renderMathInElement from 'katex/contrib/auto-render'
import 'katex/dist/katex.min.css'

interface Props {
  html: string
}

export default function HTMLRenderer({ html }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const cleanHtml = useMemo(() => {
    if (!html) return ''

    // Remove style tags
    let cleaned = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

    // Remove script tags
    cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')

    // Remove inline JS & styles
    cleaned = cleaned.replace(/style="[^"]*"/gi, '')
    cleaned = cleaned.replace(/onclick="[^"]*"/gi, '')

    return cleaned
  }, [html])

  useEffect(() => {
    if (!ref.current) return

    renderMathInElement(ref.current, {
      delimiters: [
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true }
      ],
      throwOnError: false
    })
  }, [cleanHtml])

  return (
    <div
      ref={ref}
      className="prose prose-sm dark:prose-invert max-w-none text-foreground
        prose-p:my-2 prose-p:leading-relaxed
        prose-li:my-1
        prose-strong:font-semibold
        prose-em:italic
        prose-img:max-w-full prose-img:h-auto
        prose-table:my-4 prose-table:w-full
        prose-th:bg-muted prose-th:p-2
        prose-td:border prose-td:border-border prose-td:p-2"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  )
}
