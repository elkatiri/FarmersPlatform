import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  LuBadgeCheck,
  LuClipboardList,
  LuFileText,
  LuMapPin,
  LuMessageCircle,
  LuUsers,
  LuZap,
} from 'react-icons/lu';

/* ─── tiny hook: animate a number from 0 → target when visible ─── */
function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const numeric = parseInt(String(target).replace(/\D/g, ''), 10);
    if (!numeric) { setValue(target); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setValue(Math.floor(ease * numeric));
          if (p < 1) requestAnimationFrame(tick);
          else setValue(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [value, ref];
}

/* ─── single stat card ─── */
function StatCard({ stat, index, liveLabel }) {
  const [val, ref] = useCountUp(stat.value, 1200 + index * 150);
  const Icon = stat.icon || LuUsers;

  return (
    <div
      ref={ref}
      className="stat-card group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-emerald-100/40 ring-1 ring-emerald-100 backdrop-blur"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.12), transparent 45%)' }} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-inset ring-emerald-100 text-emerald-700">
          <Icon aria-hidden className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-inset ring-emerald-100">
          {liveLabel}
        </span>
      </div>
      <div className="relative mt-5 space-y-1">
        <p className="text-4xl font-black leading-none tracking-tight text-slate-900 tabular-nums">{val}</p>
        <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
      </div>
    </div>
  );
}

/* ─── single step card ─── */
function StepCard({ step, index, total, isRTL = false }) {
  const Icon = step.icon;
  return (
    <div
      className="step-card group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* accent rail */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-500/30 via-amber-400/20 to-emerald-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* number watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-3 -top-6 select-none text-[8rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-50 transition-all duration-500 group-hover:from-emerald-100 group-hover:to-amber-50"
      >
        {step.num}
      </span>

      {/* top accent line */}
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/80 to-amber-400/70 opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

      <div className="relative mb-6 flex items-center justify-between gap-3">
        {/* icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-white ring-1 ring-inset ring-emerald-100 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-lg group-hover:shadow-emerald-200/40">
          {typeof Icon === 'function' ? (
            <Icon aria-hidden className="h-7 w-7 text-emerald-700" />
          ) : (
            <span className="text-2xl">{Icon}</span>
          )}
        </div>

        {/* step badge */}
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-[10px] font-extrabold tracking-[0.22em] text-slate-500 backdrop-blur transition-all duration-300 group-hover:border-emerald-200 group-hover:bg-emerald-50/70 group-hover:text-emerald-700">
          {step.num}
        </span>
      </div>

      <h3 className="relative mt-2 text-xl font-extrabold text-slate-900 transition-colors duration-300 group-hover:text-emerald-900">
        {step.title}
      </h3>
      <p className="relative mt-2.5 text-sm leading-relaxed text-slate-600">{step.body}</p>

      {/* connector arrow (between cards on desktop) */}
      {index < total - 1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 lg:flex"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors duration-300 group-hover:border-emerald-200 group-hover:bg-emerald-50">
            <svg className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300 group-hover:text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isRTL ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { t, isRTL } = useLanguage();
  const [workers, setWorkers] = useState([]);
  const [workerCount, setWorkerCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/workers');
        setWorkers(data.slice(0, 4));
        setWorkerCount(data.length);
      } catch {
        setWorkers([]);
      }
    };
    load();
  }, []);

  const tickerItems = t('home.tickerItems');

  const stats = [
    { value: workerCount > 0 ? `${workerCount}+` : '480+', label: t('home.statWorkers'), icon: LuUsers },
    { value: '1 200', label: t('home.statMissions'), icon: LuClipboardList },
    { value: '48h', label: t('home.statDelay'), icon: LuZap },
    { value: '12', label: t('home.statRegions'), icon: LuMapPin },
  ];

  const steps = [
    { num: '01', title: t('home.step1Title'), body: t('home.step1Body'), icon: LuFileText },
    { num: '02', title: t('home.step2Title'), body: t('home.step2Body'), icon: LuBadgeCheck },
    { num: '03', title: t('home.step3Title'), body: t('home.step3Body'), icon: LuMessageCircle },
  ];

  const farmerPoints = [t('home.farmerPt1'), t('home.farmerPt2'), t('home.farmerPt3'), t('home.farmerPt4')];
  const workerPoints = [t('home.workerPt1'), t('home.workerPt2'), t('home.workerPt3'), t('home.workerPt4')];

  return (
    <div className="bg-[#fafaf9] text-slate-900">

      {/* ───── inline styles for custom animations ───── */}
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease both; }
        .animate-pulse-dot  { animation: pulse-dot 2s ease-in-out infinite; }

        /* stat & step cards fade-in when section enters viewport */
        .stat-card, .step-card {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeInUp 0.6s ease forwards;
        }

        /* smooth group hover on stat card gradient line */
        .stat-card .absolute.origin-left { transition: transform 0.45s cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden bg-emerald-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900/95 to-emerald-950" />
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-600/20 blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-amber-400/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-28 lg:pt-40">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              {t('morocco')} · {t('home.badge')}
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              {t('home.heroTitle1')}{' '}
              <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">{t('home.heroTitle2')}</span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-emerald-100/70 sm:text-lg">{t('home.heroDesc')}</p>

            <div className="flex flex-wrap gap-3">
              <Link to="/request-worker" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-xl">
                {t('home.ctaPublish')}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link to="/directory" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/90 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/25">
                {t('home.ctaDirectory')}
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2.5">
                {['YA', 'MH', 'KS', 'RB'].map((initials) => (
                  <span key={initials} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-950 bg-gradient-to-br from-emerald-200 to-emerald-100 text-[11px] font-bold text-emerald-900">{initials}</span>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-white">+{workerCount || 480} {t('home.activeWorkers')}</p>
                <p className="text-emerald-100/50">12 {t('home.regionsVerified')}</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-300/70">{t('home.recentProfiles')}</p>
                  <p className="mt-0.5 text-2xl font-bold text-white">{workerCount || '—'} <span className="text-sm font-normal text-emerald-100/50">{t('home.available')}</span></p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                  {t('home.live')}
                </span>
              </div>
              <div className="space-y-3">
                {(workers.length > 0 ? workers : [null, null, null]).map((w, i) =>
                  w ? (
                    <div key={w._id} className="rounded-xl border border-white/8 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">{w.fullName || w.name}</p>
                          <p className="mt-0.5 text-xs text-emerald-100/50">{w.location || '—'}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${w.availability === 'immediate' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                          {w.availability === 'immediate' ? t('home.availableNow') : t('home.soon')}
                        </span>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {(w.skills || []).slice(0, 3).map((s) => (
                          <span key={s} className="rounded-md bg-white/8 px-2 py-0.5 text-[10px] font-medium text-emerald-100/70">{s}</span>
                        ))}
                        {w.experienceLevel && <span className="rounded-md bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">{w.experienceLevel}</span>}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="skeleton h-24 w-full opacity-30" />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── TICKER ───── */}
      <section className="overflow-hidden bg-emerald-950/95 py-3">
        <div className="ticker-track flex min-w-[200%] whitespace-nowrap" style={{ animation: 'ticker 35s linear infinite', direction: isRTL ? 'rtl' : 'ltr' }}>
          {[...(Array.isArray(tickerItems) ? tickerItems : []), ...(Array.isArray(tickerItems) ? tickerItems : [])].map((item, idx) => (
            <span key={idx} className="mx-6 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-200/50">
              <span className="h-1 w-1 rounded-full bg-amber-400/60" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS  — gradient shell + glass cards
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/40 to-white py-16 lg:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 max-w-5xl rounded-full bg-emerald-200/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-56 max-w-4xl rounded-full bg-amber-200/10 blur-[110px]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-1 text-[10px] font-extrabold uppercase tracking-[0.25em] text-emerald-700 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t('home.statsLabel')}
            </p>
            <p className="text-sm text-slate-500">{t('home.statsSub')}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <StatCard key={s.label} stat={s} index={i} liveLabel={t('home.live')} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — rich step cards
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24 lg:py-28">
        {/* decorative blobs */}
        <div aria-hidden className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-emerald-400/6 blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-1/4 h-64 w-64 rounded-full bg-amber-400/6 blur-[80px]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.25em] text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              {t('home.howLabel')}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{t('home.howTitle')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">{t('home.howDesc')}</p>
          </div>

          {/* step cards */}
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {steps.map((step, idx) => (
              <StepCard key={step.num} step={step} index={idx} total={steps.length} isRTL={isRTL} />
            ))}
          </div>

          {/* progress dots */}
          <div className="mt-8 flex justify-center gap-2">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'w-8 bg-emerald-500' : 'w-1.5 bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ───── DUAL AUDIENCE ───── */}
      <section className="bg-slate-50 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">{t('home.forWho')}</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t('home.dualTitle')}</h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl bg-emerald-950 p-8 text-white shadow-xl shadow-emerald-950/15 sm:p-10">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-600/15 blur-[80px]" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">{t('home.farmersLabel')}</p>
              <h3 className="mt-3 text-2xl font-extrabold">{t('home.farmersTitle')}</h3>
              <ul className="mt-6 space-y-3">
                {farmerPoints.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm text-emerald-100/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {pt}
                  </li>
                ))}
              </ul>
              <Link to="/request-worker" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-emerald-950 shadow-lg shadow-amber-400/20 transition hover:-translate-y-0.5 hover:bg-amber-300">
                {t('home.farmerCta')}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-100/50 blur-[60px]" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">{t('home.workersLabel')}</p>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-900">{t('home.workersTitle')}</h3>
              <ul className="mt-6 space-y-3">
                {workerPoints.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm text-slate-500">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {pt}
                  </li>
                ))}
              </ul>
              <Link to="/worker-profile" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700">
                {t('home.workerCta')}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FEATURED WORKERS ───── */}
      {workers.length > 0 && (
        <section className="bg-white py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">{t('home.featuredLabel')}</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{t('home.featuredTitle')}</h2>
                <p className="mt-2 text-sm text-slate-500">{t('home.featuredDesc')}</p>
              </div>
              <Link to="/directory" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
                {t('home.viewAll')}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {workers.map((w) => (
                <div key={w._id} className="group rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                      {(w.fullName || w.name || '??').slice(0, 2).toUpperCase()}
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${w.availability === 'immediate' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-500/20' : 'bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-500/20'}`}>
                      {w.availability === 'immediate' ? t('home.dispo') : t('home.soon')}
                    </span>
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-slate-900">{w.fullName || w.name}</h4>
                  <p className="text-xs text-slate-500">{w.location || '—'} · {w.experienceLevel || '—'}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(w.skills || []).slice(0, 3).map((s) => (
                      <span key={s} className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───── CTA FINAL ───── */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300/60">{t('home.ctaReady')}</p>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">{t('home.ctaFinalTitle')}</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-emerald-100/60">{t('home.ctaFinalDesc')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/request-worker" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-emerald-950 shadow-lg shadow-amber-400/20 transition hover:-translate-y-0.5 hover:bg-amber-300">
              {t('home.ctaPublish')}
            </Link>
            <Link to="/worker-profile" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10">
              {t('home.ctaCreateProfile')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}