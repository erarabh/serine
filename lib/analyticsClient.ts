// frontend/lib/analyticsClient.ts

/**
 * Fetch daily chat metrics for a given user & agent between two dates.
 */
export async function fetchMetrics(
  userId: string,
  agentId: string,
  start: string, // 'YYYY-MM-DD'
  end: string    // 'YYYY-MM-DD'
): Promise<
  Array<{
    day: string
    total_chats: number
    user_messages: number
    bot_messages: number
    positive: number
    neutral: number
    negative: number
    avg_response_ms: number
    satisfaction_score: number
  }>
> {
  const params = new URLSearchParams({ userId, agentId, start, end })
  const res = await fetch(`/api/metrics?${params}`)

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`fetchMetrics failed: ${text || res.statusText}`)
  }

  // API returns { data: [ ... ] }
  const { data } = (await res.json()) as {
    data: Array<{
      date: string
      total_messages: number
      user_messages: number
      bot_messages: number
      positive: number
      neutral: number
      negative: number
      avg_response_time_ms: number
      satisfaction_score: number
    }>
  }

  // Map to the shape our charts expect
  return data.map((r) => ({
    day:                r.date,
    total_chats:        r.total_messages,
    user_messages:      r.user_messages,
    bot_messages:       r.bot_messages,
    positive:           r.positive,
    neutral:            r.neutral,
    negative:           r.negative,
    avg_response_ms:    r.avg_response_time_ms,
    satisfaction_score: r.satisfaction_score,
  }))
}

/**
 * Fetch top-N unanswered questions for a given user & agent in a date range.
 */
export async function fetchUnanswered(
  userId: string,
  agentId: string,
  start: string,
  end: string,
  limit = 10
): Promise<Array<{ question: string; count: number }>> {
  const params = new URLSearchParams({
    userId,
    agentId,
    start,
    end,
    limit: limit.toString(),
  })
  const res = await fetch(`/api/metrics/unanswered?${params}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`fetchUnanswered failed: ${text || res.statusText}`)
  }
  const { data } = (await res.json()) as {
    data: Array<{ question: string; count: number }>
  }
  return data
}
