'use client'
import { FC } from 'react'

interface Item {
  question: string
  count: number
}

interface Props {
  items: Item[]
}

export const UnansweredList: FC<Props> = ({ items }) => (
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-2">Top 10 Unanswered Questions</h2>
    <ol className="list-decimal list-inside space-y-1">
      {items.map((item, idx) => (
        <li key={idx} className="flex justify-between">
          <span>{item.question}</span>
          <span className="text-sm text-gray-500">({item.count})</span>
        </li>
      ))}
    </ol>
  </div>
)
