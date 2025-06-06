// components/PricingCard.tsx
import Link from 'next/link'

interface Props {
  title: string
  price: string
  features: string[]
  buttonLabel: string
  buttonHref?: string
}

export default function PricingCard({
  title,
  price,
  features,
  buttonLabel,
  buttonHref = '/chatbot',
}: Props) {
  return (
    <div className="border rounded p-6 shadow-md bg-white">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-2xl text-purple-600 font-bold">{price}</p>
      <ul className="my-4 space-y-1 text-sm text-gray-600">
        {features.map((f, i) => <li key={i}>✅ {f}</li>)}
      </ul>
      <Link
        href={buttonHref}
        className="block mt-4 text-center bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
      >
        {buttonLabel}
      </Link>
    </div>
  )
}
