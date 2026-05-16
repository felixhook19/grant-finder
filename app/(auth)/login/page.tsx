'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-spark flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="12" fill="none" stroke="#0B1220" strokeWidth="2.5"/>
                <path d="M24 12L24 16M24 32L24 36M12 24L16 24M32 24L36 24M24 24L30 18" stroke="#0B1220" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="2.5" fill="#0B1220"/>
                <circle cx="30" cy="18" r="3" fill="#0B1220"/>
              </svg>
            </div>
            <span className="font-display font-bold text-lg">Grant <span className="text-spark">Finder</span></span>
          </Link>
          <h1 className="font-display font-bold text-3xl mb-2">Welcome back</h1>
          <p className="text-slate">Sign in to see your grant matches</p>
        </div>

        <div className="bg-ink/50 border border-white/5 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-chalk/70 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@yourcompany.com"
                className="w-full bg-midnight border border-white/10 rounded-xl px-4 py-3 text-chalk placeholder:text-slate focus:outline-none focus:border-spark transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-chalk/70 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Your password"
                className="w-full bg-midnight border border-white/10 rounded-xl px-4 py-3 text-chalk placeholder:text-slate focus:outline-none focus:border-spark transition-colors text-sm"
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-spark text-midnight font-semibold py-3 rounded-xl hover:bg-spark/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
          <p className="text-center text-slate text-sm mt-6">
            No account yet?{' '}
            <Link href="/signup" className="text-spark hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
