'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const SECTOR_OPTIONS = [
  'Technology / Software', 'AI / Machine Learning', 'Clean Tech / Net Zero',
  'Health / MedTech', 'Fintech', 'EdTech', 'Creative / Digital Media',
  'Manufacturing', 'Agriculture / FoodTech', 'Social Enterprise', 'Other'
]

const STAGE_OPTIONS = [
  { value: 'idea', label: 'Idea stage — pre-incorporation' },
  { value: 'pre-revenue', label: 'Pre-revenue — incorporated, no sales yet' },
  { value: 'early-revenue', label: 'Early revenue — first customers' },
  { value: 'growth', label: 'Growth — scaling revenue' },
  { value: 'scale', label: 'Scale — established, growing fast' },
]

const EMPLOYEE_OPTIONS = [
  { value: 'sole_trader', label: 'Just me' },
  { value: '1-9', label: '2–9 employees' },
  { value: '10-49', label: '10–49 employees' },
  { value: '50-249', label: '50–249 employees' },
  { value: '250+', label: '250+ employees' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    org_name: '',
    companies_house_number: '',
    org_description: '',
    org_category: 'business',
    nation: 'England',
    postcode_area: '',
    innovation_stage: 'early-revenue',
    employee_count_band: '1-9',
    annual_turnover_band: '',
    rd_active: false,
    website: '',
    themes: [] as string[],
  })

  function update(field: string, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function toggleTheme(theme: string) {
    setForm(f => ({
      ...f,
      themes: f.themes.includes(theme)
        ? f.themes.filter(t => t !== theme)
        : [...f.themes, theme]
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('orgs').insert({
      owner_user_id: user.id,
      ...form,
      sic_codes: [],
      target_markets: [],
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-midnight px-6 py-12">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-spark flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="12" fill="none" stroke="#0B1220" strokeWidth="2.5"/>
                <path d="M24 12L24 16M24 32L24 36M12 24L16 24M32 24L36 24M24 24L30 18" stroke="#0B1220" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="2.5" fill="#0B1220"/>
                <circle cx="30" cy="18" r="3" fill="#0B1220"/>
              </svg>
            </div>
            <span className="font-display font-bold text-lg">Grant <span className="text-spark">Finder</span></span>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-spark' : 'bg-white/10'}`} />
            ))}
          </div>

          <p className="text-spark text-xs font-medium tracking-widest uppercase mb-2">Step {step} of 3</p>
          <h1 className="font-display font-bold text-3xl">
            {step === 1 && 'Tell us about your business'}
            {step === 2 && 'Your location and size'}
            {step === 3 && 'Sectors and focus areas'}
          </h1>
        </div>

        <div className="bg-ink/50 border border-white/5 rounded-2xl p-8 space-y-6">

          {/* Step 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-chalk/70 mb-2">Business name *</label>
                <input
                  type="text"
                  value={form.org_name}
                  onChange={e => update('org_name', e.target.value)}
                  placeholder="e.g. Acme Technologies Ltd"
                  className="w-full bg-midnight border border-white/10 rounded-xl px-4 py-3 text-chalk placeholder:text-slate focus:outline-none focus:border-spark transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-chalk/70 mb-2">
                  Companies House number
                  <span className="text-slate font-normal ml-1">(optional — helps auto-fill details)</span>
                </label>
                <input
                  type="text"
                  value={form.companies_house_number}
                  onChange={e => update('companies_house_number', e.target.value)}
                  placeholder="e.g. 12345678"
                  className="w-full bg-midnight border border-white/10 rounded-xl px-4 py-3 text-chalk placeholder:text-slate focus:outline-none focus:border-spark transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-chalk/70 mb-2">
                  What does your business do? *
                  <span className="block text-slate font-normal mt-0.5">Plain English — this is what the AI uses to match you to grants</span>
                </label>
                <textarea
                  value={form.org_description}
                  onChange={e => update('org_description', e.target.value)}
                  rows={4}
                  placeholder="e.g. We build AI-powered software that helps NHS trusts reduce waiting times by predicting patient no-shows and optimising appointment scheduling."
                  className="w-full bg-midnight border border-white/10 rounded-xl px-4 py-3 text-chalk placeholder:text-slate focus:outline-none focus:border-spark transition-colors text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-chalk/70 mb-2">Innovation stage</label>
                <select
                  value={form.innovation_stage}
                  onChange={e => update('innovation_stage', e.target.value)}
                  className="w-full bg-midnight border border-white/10 rounded-xl px-4 py-3 text-chalk focus:outline-none focus:border-spark transition-colors text-sm"
                >
                  {STAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-chalk/70 mb-2">Do you conduct R&D?</label>
                <div className="flex gap-3">
                  {['Yes', 'No'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update('rd_active', opt === 'Yes')}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${(opt === 'Yes') === form.rd_active ? 'bg-spark/10 border-spark text-spark' : 'border-white/10 text-slate hover:border-white/20'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-chalk/70 mb-2">Nation</label>
                <select
                  value={form.nation}
                  onChange={e => update('nation', e.target.value)}
                  className="w-full bg-midnight border border-white/10 rounded-xl px-4 py-3 text-chalk focus:outline-none focus:border-spark transition-colors text-sm"
                >
                  {['England', 'Scotland', 'Wales', 'Northern Ireland'].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-chalk/70 mb-2">Postcode area</label>
                <input
                  type="text"
                  value={form.postcode_area}
                  onChange={e => update('postcode_area', e.target.value.toUpperCase())}
                  placeholder="e.g. EC1, M1, BS1"
                  maxLength={4}
                  className="w-full bg-midnight border border-white/10 rounded-xl px-4 py-3 text-chalk placeholder:text-slate focus:outline-none focus:border-spark transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-chalk/70 mb-3">Team size</label>
                <div className="space-y-2">
                  {EMPLOYEE_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => update('employee_count_band', o.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${form.employee_count_band === o.value ? 'bg-spark/10 border-spark text-chalk' : 'border-white/10 text-slate hover:border-white/20'}`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-chalk/70 mb-2">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={e => update('website', e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full bg-midnight border border-white/10 rounded-xl px-4 py-3 text-chalk placeholder:text-slate focus:outline-none focus:border-spark transition-colors text-sm"
                />
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-chalk/70 mb-1">Select all sectors that apply</label>
                <p className="text-slate text-xs mb-4">This helps us surface sector-specific grants</p>
                <div className="flex flex-wrap gap-2">
                  {SECTOR_OPTIONS.map(sector => (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => toggleTheme(sector)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${form.themes.includes(sector) ? 'bg-spark/10 border-spark text-spark' : 'border-white/10 text-slate hover:border-white/20'}`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="flex-1 border border-white/10 text-chalk py-3 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
              >
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 && (!form.org_name || !form.org_description)}
                className="flex-1 bg-spark text-midnight py-3 rounded-xl text-sm font-semibold hover:bg-spark/90 transition-colors disabled:opacity-40"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-spark text-midnight py-3 rounded-xl text-sm font-semibold hover:bg-spark/90 transition-colors disabled:opacity-40"
              >
                {loading ? 'Finding your grants...' : 'Find my grants →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
