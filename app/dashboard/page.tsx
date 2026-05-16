'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Grant {
  id: string
  title: string
  funder: string
  summary: string
  grant_amount_min: number
  grant_amount_max: number
  deadline: string
  sector_tags: string[]
  funding_type: string
}

interface Match {
  grant_id: string
  fit_score: number
  decision: 'apply' | 'consider' | 'skip'
  why_match: string[]
  risks: string[]
  next_steps: string[]
  grant: Grant
}

interface Org {
  id: string
  org_name: string
  org_description: string
  innovation_stage: string
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? 'text-spark bg-spark/10 border-spark/25'
    : score >= 50 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25'
    : 'text-slate bg-white/5 border-white/10'
  return (
    <div className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center flex-shrink-0 ${color}`}>
      <span className="font-display font-extrabold text-xl leading-none">{score}</span>
      <span className="text-[9px] uppercase tracking-wide opacity-70 mt-0.5">match</span>
    </div>
  )
}

function DecisionBadge({ decision }: { decision: string }) {
  const styles: Record<string, string> = {
    apply: 'bg-spark/10 text-spark border-spark/20',
    consider: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    skip: 'bg-white/5 text-slate border-white/10',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${styles[decision] || styles.skip}`}>
      {decision === 'apply' ? '✓ Apply' : decision === 'consider' ? '◑ Consider' : '✗ Skip'}
    </span>
  )
}

function GrantCard({ match }: { match: Match }) {
  const [expanded, setExpanded] = useState(false)
  const g = match.grant

  const daysLeft = g.deadline
    ? Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000)
    : null

  return (
    <div className="bg-ink/40 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
      <div className="flex items-start gap-4 mb-4">
        <ScoreBadge score={match.fit_score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="font-display font-semibold text-base leading-snug">{g.title}</h3>
            <DecisionBadge decision={match.decision} />
          </div>
          <p className="text-slate text-sm">{g.funder}</p>
        </div>
      </div>

      <p className="text-chalk/60 text-sm leading-relaxed mb-4">{g.summary}</p>

      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        {(g.grant_amount_min || g.grant_amount_max) && (
          <span className="text-chalk/80">
            💷 <span className="font-medium">
              {g.grant_amount_min ? `£${g.grant_amount_min.toLocaleString()}` : ''}
              {g.grant_amount_min && g.grant_amount_max ? ' – ' : ''}
              {g.grant_amount_max ? `£${g.grant_amount_max.toLocaleString()}` : ''}
            </span>
          </span>
        )}
        {daysLeft !== null && (
          <span className={`${daysLeft <= 14 ? 'text-amber-400' : 'text-chalk/60'}`}>
            🗓 <span className="font-medium">
              {daysLeft <= 0 ? 'Closed' : `${daysLeft} days left`}
            </span>
          </span>
        )}
        {!g.deadline && <span className="text-chalk/60">🗓 <span className="font-medium">Rolling deadline</span></span>}
      </div>

      {g.sector_tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {g.sector_tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-white/5 border border-white/8 rounded-lg text-slate">{tag}</span>
          ))}
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-spark text-sm hover:underline"
      >
        {expanded ? '↑ Show less' : '↓ Why this matches'}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-fade-in">
          {match.why_match?.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate mb-2">Why it matches</p>
              <ul className="space-y-1">
                {match.why_match.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-chalk/70">
                    <span className="text-spark flex-shrink-0">✓</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {match.risks?.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate mb-2">Watch out for</p>
              <ul className="space-y-1">
                {match.risks.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-chalk/70">
                    <span className="text-amber-400 flex-shrink-0">⚠</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {match.next_steps?.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate mb-2">Next steps</p>
              <ul className="space-y-1">
                {match.next_steps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-chalk/70">
                    <span className="text-blue-400 flex-shrink-0">{i + 1}.</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [org, setOrg] = useState<Org | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [filter, setFilter] = useState<'all' | 'apply' | 'consider'>('all')

  const runMatching = useCallback(async () => {
    setMatching(true)
    const res = await fetch('/api/match', { method: 'POST' })
    const data = await res.json()
    if (data.matches) setMatches(data.matches)
    setMatching(false)
  }, [])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: orgData } = await supabase
        .from('orgs')
        .select('*')
        .eq('owner_user_id', user.id)
        .single()

      if (!orgData) { router.push('/onboarding'); return }
      setOrg(orgData)

      // Load cached matches first
      const { data: cachedMatches } = await supabase
        .from('matches')
        .select('*, opportunity:opportunities(*)')
        .eq('org_id', orgData.id)
        .order('fit_score', { ascending: false })

      if (cachedMatches && cachedMatches.length > 0) {
        const formatted = cachedMatches.map(m => ({
          grant_id: m.opportunity_id,
          fit_score: m.fit_score,
          decision: m.decision,
          why_match: m.why_match || [],
          risks: m.risks || [],
          next_steps: m.next_steps || [],
          grant: m.opportunity,
        }))
        setMatches(formatted)
        setLoading(false)
      } else {
        setLoading(false)
        runMatching()
      }
    }
    init()
  }, [supabase, router, runMatching])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filtered = matches.filter(m =>
    filter === 'all' ? true : m.decision === filter
  )

  const applyCount = matches.filter(m => m.decision === 'apply').length
  const considerCount = matches.filter(m => m.decision === 'consider').length

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-spark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-midnight">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-midnight/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-spark flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="12" fill="none" stroke="#0B1220" strokeWidth="3"/>
                <path d="M24 12L24 16M24 32L24 36M12 24L16 24M32 24L36 24M24 24L30 18" stroke="#0B1220" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="2.5" fill="#0B1220"/>
                <circle cx="30" cy="18" r="3" fill="#0B1220"/>
              </svg>
            </div>
            <span className="font-display font-bold">Grant <span className="text-spark">Finder</span></span>
          </Link>
          <div className="flex items-center gap-4">
            {org && <span className="text-slate text-sm hidden md:block">{org.org_name}</span>}
            <button onClick={handleSignOut} className="text-slate text-sm hover:text-chalk transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1">
              {matching ? 'Finding your matches...' : `${matches.length} grants found`}
            </h1>
            <p className="text-slate">
              {org?.org_name} · AI-matched and scored for your profile
            </p>
          </div>
          <button
            onClick={runMatching}
            disabled={matching}
            className="flex-shrink-0 border border-spark/30 text-spark text-sm px-4 py-2 rounded-xl hover:bg-spark/5 transition-colors disabled:opacity-40 flex items-center gap-2"
          >
            {matching ? (
              <>
                <span className="w-4 h-4 border border-spark border-t-transparent rounded-full animate-spin" />
                Matching...
              </>
            ) : '↻ Refresh matches'}
          </button>
        </div>

        {/* Stats */}
        {!matching && matches.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-spark/5 border border-spark/20 rounded-xl p-4">
              <p className="font-display font-bold text-3xl text-spark">{applyCount}</p>
              <p className="text-slate text-sm mt-1">Ready to apply</p>
            </div>
            <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
              <p className="font-display font-bold text-3xl text-yellow-400">{considerCount}</p>
              <p className="text-slate text-sm mt-1">Worth considering</p>
            </div>
            <div className="bg-ink/50 border border-white/5 rounded-xl p-4">
              <p className="font-display font-bold text-3xl text-chalk">{matches.length}</p>
              <p className="text-slate text-sm mt-1">Total matches</p>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        {matches.length > 0 && (
          <div className="flex gap-2 mb-6">
            {[
              { key: 'all', label: `All (${matches.length})` },
              { key: 'apply', label: `Apply (${applyCount})` },
              { key: 'consider', label: `Consider (${considerCount})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as 'all' | 'apply' | 'consider')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === tab.key ? 'bg-spark text-midnight' : 'border border-white/10 text-slate hover:text-chalk'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Matching loading state */}
        {matching && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-2 border-spark border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="font-display font-semibold text-xl mb-2">AI is scanning 10,000+ grants</h2>
            <p className="text-slate">Matching against your profile and scoring eligibility...</p>
          </div>
        )}

        {/* Results */}
        {!matching && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map(match => (
              <GrantCard key={match.grant_id} match={match} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!matching && matches.length === 0 && (
          <div className="text-center py-20 border border-white/5 rounded-2xl">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="font-display font-semibold text-xl mb-2">No matches yet</h2>
            <p className="text-slate mb-6">We&apos;ll scan all active grants and match them to your profile</p>
            <button onClick={runMatching} className="bg-spark text-midnight font-medium px-6 py-3 rounded-xl hover:bg-spark/90 transition-colors">
              Run matching now →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
