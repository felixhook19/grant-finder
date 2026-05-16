import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // Get org profile
  const { data: org } = await supabase
    .from('orgs')
    .select('*')
    .eq('owner_user_id', user.id)
    .single()

  if (!org) return NextResponse.json({ error: 'No organisation profile found' }, { status: 404 })

  // Get open opportunities
  const { data: grants } = await supabase
    .from('opportunities')
    .select('id, title, funder, summary, description, eligibility_summary, sector_tags, audience, grant_amount_min, grant_amount_max, deadline, geography, max_employees, min_years_trading, match_funding_required, funding_type')
    .eq('status', 'open')
    .order('deadline', { ascending: true })
    .limit(50)

  if (!grants || grants.length === 0) {
    return NextResponse.json({ matches: [] })
  }

  const orgProfile = `
Organisation: ${org.org_name}
Type: ${org.org_category}
Description: ${org.org_description}
Stage: ${org.innovation_stage}
Team size: ${org.employee_count_band}
Nation: ${org.nation}
Sector tags: ${(org.themes || []).join(', ')}
Conducts R&D: ${org.rd_active ? 'Yes' : 'No'}
Has match funding available: ${org.has_match_funding ? 'Yes' : 'No'}
  `.trim()

  const grantsContext = grants.map((g, i) => `
GRANT ${i + 1}:
ID: ${g.id}
Title: ${g.title}
Funder: ${g.funder}
Summary: ${g.summary || ''}
Description: ${g.description || ''}
Eligibility: ${g.eligibility_summary || ''}
Sectors: ${(g.sector_tags || []).join(', ')}
Audience: ${(g.audience || []).join(', ')}
Amount: £${g.grant_amount_min?.toLocaleString() || '?'} – £${g.grant_amount_max?.toLocaleString() || '?'}
Deadline: ${g.deadline || 'Rolling'}
Geography: ${(g.geography || []).join(', ')}
Max employees: ${g.max_employees || 'None specified'}
Min years trading: ${g.min_years_trading || 'None specified'}
Match funding required: ${g.match_funding_required ? 'Yes' : 'No'}
  `.trim()).join('\n\n---\n\n')

  const prompt = `You are an expert UK grant matching specialist with deep knowledge of government and charitable funding programmes.

Given this organisation profile and list of grants, score each grant from 0-100 based on:
- Eligibility (does the org meet the stated criteria?) — weighted 50%
- Relevance (does the grant fit what the org does?) — weighted 30%  
- Practicality (can they realistically apply?) — weighted 20%

ORGANISATION PROFILE:
${orgProfile}

AVAILABLE GRANTS:
${grantsContext}

Return a JSON array. Include ALL grants but rank by score descending. Only include grants with score > 20 in the final output. For each grant return:
{
  "grant_id": "the grant UUID",
  "fit_score": number 0-100,
  "decision": "apply" | "consider" | "skip",
  "why_match": ["reason 1", "reason 2", "reason 3"],
  "risks": ["risk 1", "risk 2"],
  "next_steps": ["step 1", "step 2"]
}

Respond with ONLY the JSON array, no other text.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    return NextResponse.json({ error: 'AI response error' }, { status: 500 })
  }

  let matchResults
  try {
    const cleaned = content.text.replace(/```json\n?|\n?```/g, '').trim()
    matchResults = JSON.parse(cleaned)
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
  }

  // Store matches in Supabase
  const matchRows = matchResults.map((m: {
    grant_id: string
    fit_score: number
    decision: string
    why_match: string[]
    risks: string[]
    next_steps: string[]
  }) => ({
    org_id: org.id,
    opportunity_id: m.grant_id,
    fit_score: m.fit_score,
    decision: m.decision,
    why_match: m.why_match,
    risks: m.risks,
    next_steps: m.next_steps,
  }))

  // Upsert matches (replace previous run)
  await supabase.from('matches').delete().eq('org_id', org.id)
  await supabase.from('matches').insert(matchRows)

  // Return enriched results with grant details
  const enriched = matchResults.map((m: {
    grant_id: string
    fit_score: number
    decision: string
    why_match: string[]
    risks: string[]
    next_steps: string[]
  }) => ({
    ...m,
    grant: grants.find(g => g.id === m.grant_id),
  })).filter((m: { grant: unknown }) => m.grant)

  return NextResponse.json({ matches: enriched })
}
