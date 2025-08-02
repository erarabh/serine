// frontend/lib/scraper.ts
import * as cheerio from 'cheerio'

//–– No import of node-fetch; use global fetch in Next.js route

export async function scrapeSite(url: string): Promise<string> {
  const res  = await fetch(url)
  const html = await res.text()
  const $    = cheerio.load(html)

  const content = $('p, h1, h2, h3')
    .map((_, el) => $(el).text().trim())
    .get()

  return content.filter(Boolean).join('\n')
}
