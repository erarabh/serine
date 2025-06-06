'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [lang, setLang] = useState('en')

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '#' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm flex justify-between items-center sticky top-0 z-50">
      <div className="text-2xl font-bold text-purple-700">
        <Link href="/">Serine AI</Link>
      </div>

      <div className="flex gap-6 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm hover:text-purple-700 transition ${
              pathname === link.href ? 'font-semibold text-purple-700' : 'text-gray-700'
            }`}
          >
            {link.label}
          </Link>
        ))}

        {/* Language dropdown (for future) */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="ar">العربية</option>
        </select>

        <Link href="/dashboard" className="text-sm hover:text-purple-600">
          Sign In
        </Link>
        <button
          onClick={() => router.push('/pricing')}
          className="bg-purple-600 text-white text-sm px-4 py-2 rounded hover:bg-purple-700"
        >
          Get Started
        </button>
      </div>
    </nav>
  )
}
