import React, { useState } from 'react'
import { Link } from 'react-router'
import UseAuth from '../UseAuth'
import {useNavigate} from 'react-router'


const Register = () => {

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const { handleRegister , loading , user} = UseAuth()

  const Register = (e) => {
    e.preventDefault()
    handleRegister({username , email , password})
    navigate("/")
  }





  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d0d14] px-4 py-10 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-[-150px] left-[-120px] w-[480px] h-[480px] rounded-full bg-[#7F77DD] opacity-20 blur-[90px] animate-pulse" />
      <div className="absolute bottom-[-140px] right-[-80px] w-[380px] h-[380px] rounded-full bg-[#D4537E] opacity-20 blur-[90px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-[260px] h-[260px] rounded-full bg-[#a86db0] opacity-10 blur-[80px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-[#16161f]/80 backdrop-blur-2xl border border-white/[0.07] rounded-3xl p-10 shadow-2xl">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7F77DD] to-[#D4537E] flex items-center justify-center shadow-lg shadow-[#7F77DD]/30 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18V5l12-2v13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="2" />
              <circle cx="18" cy="16" r="3" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#7F77DD] to-[#D4537E] bg-clip-text text-transparent tracking-tight">
            Moodify
          </span>
        </div>

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Create your account</h1>
          <p className="text-sm text-[#8888aa]">Your mood, your music — sign up to continue.</p>
        </div>

        {/* Form */}
        <form onSubmit={Register} className="flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-[#8888aa] tracking-wide">
              Username
            </label>
            <div className="relative flex items-center">
              <svg className="absolute left-3.5 text-[#555570] pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" />
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {setUsername(e.target.value)}}
                placeholder="Username"
                autoComplete="username"
                className="w-full h-[46px] pl-10 pr-4 bg-[#1e1e2a] border border-white/[0.07] rounded-xl text-sm text-white placeholder-[#555570] outline-none transition-all duration-200 focus:border-[#7F77DD]/50 focus:ring-2 focus:ring-[#7F77DD]/10 hover:border-white/[0.14] hover:bg-[#22222f]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-[#8888aa] tracking-wide">
              Email
            </label>
            <div className="relative flex items-center">
              <svg className="absolute left-3.5 text-[#555570] pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" />
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full h-[46px] pl-10 pr-4 bg-[#1e1e2a] border border-white/[0.07] rounded-xl text-sm text-white placeholder-[#555570] outline-none transition-all duration-200 focus:border-[#7F77DD]/50 focus:ring-2 focus:ring-[#7F77DD]/10 hover:border-white/[0.14] hover:bg-[#22222f]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-medium text-[#8888aa] tracking-wide">
                Password
              </label>
              <a href="#" className="text-xs text-[#7F77DD] hover:text-[#a09ce8] transition-colors duration-200">
                Forgot password?
              </a>
            </div>
            <div className="relative flex items-center">
              <svg className="absolute left-3.5 text-[#555570] pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
                autoComplete="current-password"
                className="w-full h-[46px] pl-10 pr-10 bg-[#1e1e2a] border border-white/[0.07] rounded-xl text-sm text-white placeholder-[#555570] outline-none transition-all duration-200 focus:border-[#7F77DD]/50 focus:ring-2 focus:ring-[#7F77DD]/10 hover:border-white/[0.14] hover:bg-[#22222f]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3.5 text-[#555570] hover:text-[#8888aa] transition-colors duration-200 p-0.5"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            className="mt-1 w-full h-[46px] rounded-xl bg-gradient-to-r from-[#7F77DD] to-[#D4537E] text-white text-sm font-semibold tracking-wide shadow-lg shadow-[#7F77DD]/30 hover:shadow-[#7F77DD]/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200"
          >
            Sign in
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-xs text-[#555570]">or continue with</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="flex items-center justify-center gap-2 h-11 bg-[#1e1e2a] border border-white/[0.07] rounded-xl text-[#8888aa] text-sm font-medium hover:bg-[#22222f] hover:border-white/[0.14] hover:text-white hover:-translate-y-0.5 transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 h-11 bg-[#1e1e2a] border border-white/[0.07] rounded-xl text-[#8888aa] text-sm font-medium hover:bg-[#22222f] hover:border-white/[0.14] hover:text-white hover:-translate-y-0.5 transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Signup prompt */}
        <Link className="text-center text-sm text-[#8888aa]">
          already have an account?{' '}
          <Link to="/login" className="text-[#7F77DD] font-medium hover:text-[#a09ce8] transition-colors duration-200">
            Sign in
          </Link>
        </Link>

      </div>
    </main>
  )
}

export default Register