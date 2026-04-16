import useAuth from "../UseAuth";
import { Navigate } from "react-router-dom";

const Protected = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0d14] px-4">
        <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#7F77DD]/20 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-[-100px] right-[-80px] h-[300px] w-[300px] rounded-full bg-[#D4537E]/20 blur-[110px]" />

        <div className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.05] p-8 text-center shadow-2xl backdrop-blur-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7F77DD] to-[#D4537E] shadow-lg shadow-[#7F77DD]/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18V5l12-2v13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="2" />
              <circle cx="18" cy="16" r="3" stroke="white" strokeWidth="2" />
            </svg>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#9f9bcf]">
            Moodify
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Preparing your session
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#9a9ab3]">
            Checking your account and unlocking the experience.
          </p>

          <div className="mt-8 overflow-hidden rounded-full bg-white/8">
            <div className="h-1.5 w-full origin-left animate-pulse rounded-full bg-gradient-to-r from-[#7F77DD] via-[#9d7ce9] to-[#D4537E]" />
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-[#c8c5e7]">
            <span>Loading</span>
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7F77DD] [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#b47ce2] [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D4537E]" />
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protected;
