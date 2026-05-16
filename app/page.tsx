import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-midnight text-chalk font-body">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-midnight/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-spark flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="12" fill="none" stroke="#0B1220" strokeWidth="2.5"/>
                <path d="M24 12L24 16" stroke="#0B1220" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M24 32L24 36" stroke="#0B1220" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M12 24L16 24" stroke="#0B1220" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M32 24L36 24" stroke="#0B1220" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M24 24L30 18" stroke="#0B1220" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="2.5" fill="#0B1220"/>
                <circle cx="30" cy="18" r="3" fill="#0B1220"/>
              </svg>
            </div>
            <span className="font-display font-bold text-lg">Grant <span className="text-spark">Finder</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate hover:text-chalk transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="bg-spark text-midnight text-sm font-medium px-4 py-2 rounded-lg hover:bg-spark/90 transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-spark/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-spark/10 border border-spark/25 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 rounded-full bg-spark pulse-spark" />
            <span className="text-spark text-xs font-medium tracking-wide">AI-powered grant matching for UK founders</span>
          </div>

          <h1 className="font-display font-extrabold text-6xl md:text-7xl leading-none tracking-tight mb-6">
            Funding<br /><span className="text-spark">found.</span>
          </h1>

          <p className="text-slate text-xl max-w-xl mb-10 leading-relaxed">
            We scan 10,000+ active UK grants and match them to your business using AI — so you stop missing money you&apos;re actually eligible for.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link href="/signup" className="bg-spark text-midnight font-medium px-8 py-4 rounded-xl hover:bg-spark/90 transition-all text-center text-lg inline-flex items-center justify-center gap-2">
              Find my grants <span>→</span>
            </Link>
            <Link href="#how-it-works" className="border border-white/10 text-chalk px-8 py-4 rounded-xl hover:bg-white/5 transition-all text-center text-lg">
              See how it works
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl">
            {[
              { num: '10,000+', label: 'Active UK grants' },
              { num: '£50k+', label: 'Avg. available per startup' },
              { num: '2 min', label: 'To your first match' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display font-bold text-3xl text-spark">{stat.num}</p>
                <p className="text-slate text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-spark text-xs font-medium tracking-widest uppercase mb-4">How it works</p>
          <h2 className="font-display font-bold text-4xl mb-16">Three steps to funded</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Profile your business',
                desc: 'Enter your company number and we pull your details from Companies House automatically. Tell us what you do in plain English.',
                color: 'text-spark',
              },
              {
                step: '02',
                title: 'AI finds your matches',
                desc: 'Our AI scans every active UK grant and scores each one against your profile — eligibility, fit, and likely success rate.',
                color: 'text-blue-400',
              },
              {
                step: '03',
                title: 'Apply with confidence',
                desc: 'Get a first draft of your application written by AI, based on your profile and the grant criteria. Edit and submit.',
                color: 'text-purple-400',
              },
            ].map((item) => (
              <div key={item.step} className="bg-ink/50 border border-white/5 rounded-2xl p-8">
                <p className={`font-display font-bold text-5xl mb-6 ${item.color} opacity-40`}>{item.step}</p>
                <h3 className="font-display font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-slate leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-spark text-xs font-medium tracking-widest uppercase mb-4">Features</p>
          <h2 className="font-display font-bold text-4xl mb-16">Everything you need to win grants</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'AI matching engine', desc: 'Ranked by eligibility score, not alphabetically. Stop wading through irrelevant opportunities.' },
              { icon: '📝', title: 'Application co-pilot', desc: 'AI drafts your application from your profile and the grant criteria. You edit, not write from scratch.' },
              { icon: '🔔', title: 'Smart alerts', desc: 'New grants that match your profile land in your inbox the moment they open, with deadline urgency scoring.' },
              { icon: '📊', title: 'Pipeline tracker', desc: 'Manage every application in one place. Deadlines, status, follow-ups — nothing slips through.' },
              { icon: '🏦', title: 'Companies House link', desc: 'Connect your company number and your profile auto-populates from official data. No long forms.' },
              { icon: '💷', title: 'Transparent pricing', desc: 'Free to start. Paid plans from £29/month, self-serve online. No sales call, no "request a demo".' },
            ].map((f) => (
              <div key={f.title} className="bg-ink/30 border border-white/5 rounded-2xl p-6 hover:border-spark/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-spark/10 flex items-center justify-center text-lg mb-4">{f.icon}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-spark text-xs font-medium tracking-widest uppercase mb-4">Pricing</p>
          <h2 className="font-display font-bold text-4xl mb-4">Start free. Upgrade when it pays off.</h2>
          <p className="text-slate mb-16 max-w-xl">No annual contracts. No hidden fees. Cancel any time. We win when you win.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: 'Free',
                price: '£0',
                per: 'forever',
                features: ['5 matched grants/month', 'Basic eligibility scoring', 'Weekly email digest', 'Companies House link'],
                cta: 'Get started',
                href: '/signup',
                highlight: false,
              },
              {
                name: 'Starter',
                price: '£29',
                per: 'per month',
                features: ['Unlimited grant matches', 'Real-time alerts', 'Pipeline tracker', '5 AI draft assists/month'],
                cta: 'Start free trial',
                href: '/signup?plan=starter',
                highlight: true,
              },
              {
                name: 'Pro',
                price: '£79',
                per: 'per month',
                features: ['Everything in Starter', 'Unlimited AI drafting', '3 team seats', 'Success analytics'],
                cta: 'Start free trial',
                href: '/signup?plan=pro',
                highlight: false,
              },
              {
                name: 'Advisor',
                price: '£199',
                per: 'per month',
                features: ['Up to 20 client profiles', 'White-label reports', 'API access', 'Priority support'],
                cta: 'Contact us',
                href: 'mailto:hello@grant-finder.co.uk',
                highlight: false,
              },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-6 border ${plan.highlight ? 'border-spark bg-spark/5' : 'border-white/5 bg-ink/30'}`}>
                {plan.highlight && <p className="text-spark text-xs font-semibold uppercase tracking-widest mb-3">Most popular</p>}
                <p className="font-display font-bold text-lg mb-1">{plan.name}</p>
                <p className="font-display font-extrabold text-4xl mb-1">{plan.price}</p>
                <p className="text-slate text-sm mb-6">{plan.per}</p>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate">
                      <span className="text-spark mt-0.5 flex-shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block text-center py-3 rounded-xl font-medium text-sm transition-colors ${plan.highlight ? 'bg-spark text-midnight hover:bg-spark/90' : 'border border-white/10 text-chalk hover:bg-white/5'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-extrabold text-5xl mb-6">
            Your next grant is<br /><span className="text-spark">already out there.</span>
          </h2>
          <p className="text-slate text-lg mb-10">Join UK founders who stopped leaving grant money on the table.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-spark text-midnight font-semibold px-10 py-4 rounded-xl hover:bg-spark/90 transition-all text-lg">
            Find my grants free <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-spark flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="12" fill="none" stroke="#0B1220" strokeWidth="3"/>
                <path d="M24 12L24 16M24 32L24 36M12 24L16 24M32 24L36 24M24 24L30 18" stroke="#0B1220" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="2.5" fill="#0B1220"/>
                <circle cx="30" cy="18" r="3" fill="#0B1220"/>
              </svg>
            </div>
            <span className="font-display font-bold">Grant <span className="text-spark">Finder</span></span>
          </div>
          <p className="text-slate text-sm">© 2025 Grant Finder · grant-finder.co.uk · Built for UK founders</p>
          <div className="flex gap-6 text-sm text-slate">
            <Link href="/privacy" className="hover:text-chalk transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-chalk transition-colors">Terms</Link>
            <a href="mailto:hello@grant-finder.co.uk" className="hover:text-chalk transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
