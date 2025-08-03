// lib/trainWebsite.ts

import * as cheerio from 'cheerio'

export interface QAItem {
  question:   string
  answer:     string
  source_url: string
  user_id:    string
  agent_id:   string
}

/**
 * Scrape a URL, build QA pairs, then bulk-insert into Supabase.
 * Returns number of inserted rows.
 */
export async function trainWebsite(
  url: string,
  userId: string,
  agentId: string
): Promise<number> {
  // 1) fetch HTML
  const res  = await fetch(url)
  if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`)
  const html = await res.text()

  // 2) parse with Cheerio
  const $ = cheerio.load(html)

  // 3) build site overview QA
  const title = $('h1').first().text().trim() || 'Untitled'
  const intro = $('p').first().text().trim() || ''
  const siteQA: QAItem[] = [{
    question:   'What is this site about?',
    answer:     `${title} – ${intro}`,
    source_url: url,
    user_id:    userId,
    agent_id:   agentId
  }]

  // 4) extract products under <h2>
  type Product = { name: string; desc: string; price: string; cta: string }
  const products: Product[] = []

  $('h2').each((_, el) => {
    const name = $(el).text().trim()
    if (!name) return

    const desc = $(el).next('p').text().trim() || 'Description not found'
    const price = $(el)
      .nextAll()
      .filter((i, e) => /\$\s*\d/.test($(e).text()))
      .first()
      .text()
      .trim() || 'Price not found'
    const cta = $(el)
      .nextAll('a, button')
      .first()
      .text()
      .trim() || 'Learn More'

    products.push({ name, desc, price, cta })
  })

  // 5) fallback if no <h2>
  if (products.length === 0) {
    const snippet = $('body').text().trim().slice(0, 200)
    siteQA.push({
      question:   'Show me the main content',
      answer:     snippet + '…',
      source_url: url,
      user_id:    userId,
      agent_id:   agentId
    })
  }

  // 6) prepare list QA and detail QAs
  const listQA: QAItem = {
    question:   'What products do you have?',
    answer:     products.map(p => p.name).join(', ') || 'None',
    source_url: url,
    user_id:    userId,
    agent_id:   agentId
  }

  // <--- FIXED: use userId/agentId as values for user_id and agent_id
  const detailQAs: QAItem[] = products.flatMap(p => [
    {
      question:   `What is ${p.name}?`,
      answer:     p.desc,
      source_url: url,
      user_id:    userId,
      agent_id:   agentId
    },
    {
      question:   `What is the price of ${p.name}?`,
      answer:     p.price,
      source_url: url,
      user_id:    userId,
      agent_id:   agentId
    },
    {
      question:   `How do I purchase ${p.name}?`,
      answer:     `Click “${p.cta}”`,
      source_url: url,
      user_id:    userId,
      agent_id:   agentId
    }
  ])

  const allQA = [...siteQA, listQA, ...detailQAs]

  // 7) Lazy-load Supabase admin client, then bulk‐insert
  const { createClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data, error } = await supabaseAdmin
    .from('qa_pairs')
    .insert(
      allQA.map(({ question, answer, source_url, user_id, agent_id }) => ({
        question,
        answer,
        source_url,
        user_id,
        agent_id
      }))
    )
    .select()   // get the inserted rows back

  if (error) throw error
  if (!data) throw new Error('No data returned from insert')

  return data.length
}
