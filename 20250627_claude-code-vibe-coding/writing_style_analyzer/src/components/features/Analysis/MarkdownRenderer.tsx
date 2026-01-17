/**
 * Markdownレンダラーコンポーネント
 * 分析結果のMarkdownを美しく表示
 */

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/design-utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

/**
 * Markdown形式のテキストをレンダリング
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-gray max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // カスタムスタイリング
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-gray-900 mb-6 mt-8 first:mt-0 leading-relaxed">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-gray-800 mb-5 mt-8 first:mt-0 leading-relaxed">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-6 leading-relaxed">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold text-gray-700 mb-3 mt-5 leading-relaxed">
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-gray-700 mb-5 leading-8 text-base">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mb-5 space-y-2 [&>li]:list-disc [&>li]:ml-6 [&>li>ul>li]:list-circle [&>li>ul>li]:ml-6 [&>li>ul>li>ul>li]:list-square [&>li>ul>li>ul>li]:ml-6">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-5 space-y-2 [&>li]:list-decimal [&>li]:ml-6 [&>li>ol>li]:list-[lower-alpha] [&>li>ol>li]:ml-6 [&>li>ol>li>ol>li]:list-[lower-roman] [&>li>ol>li>ol>li]:ml-6">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-700 leading-7 text-base mb-2 pl-2">
            {children}
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-300 bg-blue-50/50 pl-6 pr-4 py-4 italic text-gray-700 my-6 rounded-r-lg">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono mx-1">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto mb-6 text-sm font-mono leading-6">
            {children}
          </pre>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-gray-900">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-700">
            {children}
          </em>
        ),
        hr: () => (
          <hr className="my-8 border-gray-200" />
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-300 rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-white divide-y divide-gray-200">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-gray-50">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 last:border-r-0">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-r-0">
            {children}
          </td>
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}