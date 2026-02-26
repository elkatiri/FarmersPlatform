import { Link } from 'react-router-dom';
import {
  LuBadgeCheck, LuClipboardList, LuClock3, LuLeaf,
  LuMoveRight, LuMessageCircle, LuPhoneCall,
  LuSparkles, LuUsers, LuWorkflow, LuArrowRight,
  LuMapPin, LuShield, LuZap,
} from 'react-icons/lu';
import RequestWorkersCTA from '../components/RequestWorkersCTA';
import Navbar from '../components/Navbar';

/* ── GLOBAL STYLES ─────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    :root {
      --forest:   #1a5c35;
      --emerald:  #22803f;
      --leaf:     #4ade80;
      --gold:     #e8b84b;
      --gold-lt:  #fef3c7;
      --ink:      #0f1f12;
      --mist:     #f4f7f4;
      --white:    #ffffff;
      --border:   rgba(26,92,53,0.12);
    }

    html { scroll-behavior: smooth; }
    body { margin: 0; font-family: 'Outfit', sans-serif; background: var(--mist); color: var(--ink); }

    .display { font-family: 'Playfair Display', Georgia, serif; }

    @keyframes rise   { from { opacity:0; transform: translateY(24px);  } to { opacity:1; transform: none; } }
    @keyframes fadeIn { from { opacity:0; }                               to { opacity:1; } }
    .rise    { animation: rise   0.75s cubic-bezier(.22,1,.36,1) both; }
    .fade-in { animation: fadeIn 0.6s ease both; }
    .d1 { animation-delay: 0.10s; }
    .d2 { animation-delay: 0.22s; }
    .d3 { animation-delay: 0.34s; }
    .d4 { animation-delay: 0.46s; }
    .d5 { animation-delay: 0.58s; }

    .lift {
      transition: transform 0.28s cubic-bezier(.34,1.56,.64,1), box-shadow 0.28s ease;
    }
    .lift:hover { transform: translateY(-5px); box-shadow: 0 24px 48px -12px rgba(26,92,53,0.18); }

    .btn-gold {
      position: relative; overflow: hidden;
      background: var(--gold); color: var(--ink);
      font-weight: 700; border: none; cursor: pointer;
      transition: filter 0.2s;
    }
    .btn-gold::after {
      content: ''; position: absolute; top: 0; left: -120%;
      width: 60%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
      transition: left 0.55s ease;
    }
    .btn-gold:hover::after { left: 160%; }
    .btn-gold:hover { filter: brightness(1.06); }

    .btn-ghost {
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.35);
      color: #fff; font-weight: 600; cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); }

    .section-line {
      display: block; width: 3rem; height: 3px;
      background: var(--gold); border-radius: 2px;
      margin-bottom: 1rem;
    }

    .grain::before {
      content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
      opacity: 0.035;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .ticker-track { animation: ticker 28s linear infinite; white-space: nowrap; display: flex; }
    .ticker-track:hover { animation-play-state: paused; }
  `}</style>
);

/* ── DATA ──────────────────────────────────────────────────── */
const stats = [
  { icon: <LuBadgeCheck />, value: '+480', label: 'Travailleurs validés' },
  { icon: <LuClipboardList />, value: '1 200', label: 'Missions publiées' },
  { icon: <LuClock3 />, value: '48h', label: 'Délai moyen' },
  { icon: <LuMapPin />, value: '12', label: 'Régions couvertes' },
];

const tickerItems = [
  'Récolte', 'Taille', 'Irrigation', 'Logistique', 'Préparation du sol',
  'Conditionnement', 'Saisonniers', 'Maraîchage', 'Arboriculture', 'Viticulture',
];

const highlights = [
  {
    icon: <LuShield size={22} />,
    title: 'Profils 100 % vérifiés',
    desc: "Chaque travailleur passe par un processus de validation rigoureux avant d'apparaître dans l'annuaire.",
    color: '#eaf4ee', iconColor: '#1a5c35',
  },
  {
    icon: <LuZap size={22} />,
    title: 'Mise en relation en 48h',
    desc: 'Publiez votre mission et recevez des contacts qualifiés dans les 48 heures.',
    color: '#fef8ea', iconColor: '#b87d10',
  },
  {
    icon: <LuMessageCircle size={22} />,
    title: 'Contact direct WhatsApp',
    desc: 'Echangez directement avec les travailleurs sans intermediaire - appel ou message.',
    color: '#eef0fb', iconColor: '#3a44b5',
  },
  {
    icon: <LuLeaf size={22} />,
    title: 'Pense pour le terrain',
    desc: 'Tous les profils sont specialises dans les metiers agricoles et saisonniers.',
    color: '#fff4ea', iconColor: '#c2550a',
  },
];

const steps = [
  {
    n: '01', icon: <LuClipboardList size={20} />,
    title: 'Creez votre compte',
    desc: 'Inscrivez votre exploitation et vos besoins pour acceder aux services securises.',
  },
  {
    n: '02', icon: <LuWorkflow size={20} />,
    title: 'Publiez votre mission',
    desc: 'Decrivez les travaux, la localisation et les dates prevues en quelques clics.',
  },
  {
    n: '03', icon: <LuMessageCircle size={20} />,
    title: 'Contactez et recrutez',
    desc: 'Les travailleurs valides sont joignables instantanement par WhatsApp ou appel.',
  },
];

const pillars = [
  {
    badge: 'Agriculteurs',
    icon: <LuUsers size={24} />,
    headline: 'Une equipe prete en quelques minutes',
    points: [
      'Publiez votre besoin en trois etapes simples',
      'Recevez des profils valides et disponibles',
      'Conservez un historique de toutes vos demandes',
    ],
    bg: '#1a5c35',
    accent: '#e8b84b',
  },
  {
    badge: 'Travailleurs',
    icon: <LuBadgeCheck size={24} />,
    headline: 'Valorisez vos competences agricoles',
    points: [
      'Creez un profil clair et verifie par admin',
      'Mettez a jour vos disponibilites en temps reel',
      'Gagnez en visibilite dans l\'annuaire regional',
    ],
    bg: '#0f1f12',
    accent: '#4ade80',
  },
];

/* ── SMALL COMPONENTS ──────────────────────────────────────── */
const Tag = ({ children, light }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '4px 14px', borderRadius: 999,
    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
    background: light ? 'rgba(255,255,255,0.12)' : 'rgba(232,184,75,0.15)',
    color: light ? 'rgba(255,255,255,0.8)' : '#e8b84b',
    border: `1px solid ${light ? 'rgba(255,255,255,0.2)' : 'rgba(232,184,75,0.3)'}`,
  }}>
    {children}
  </span>
);

/* ── HOME ──────────────────────────────────────────────────── */
const Home = () => (
  <div style={{ width: "100%", background: "#f4f7f4", fontFamily: "Outfit, sans-serif" }}>
    <G />

    {/* 1 ── HERO */}
    <section className="grain" style={{
      position: 'relative', width: '100%', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      backgroundImage: "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2200&q=85')",
      backgroundSize: 'cover', backgroundPosition: 'center 35%',
    }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(170deg, rgba(10,22,12,0.88) 0%, rgba(22,92,53,0.6) 45%, rgba(10,22,12,0.92) 100%)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#e8b84b', zIndex: 10 }} />

      <div style={{ position: 'relative', zIndex: 200, width: '100%' }}>
        <Navbar />
      </div>

      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', alignItems: 'center', padding: '5rem 6vw 6rem' }}>
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '5rem', alignItems: 'center' }}>

          {/* Left */}
          <div>
            <div className="rise d1" style={{ marginBottom: '1.5rem', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Tag light>Maroc et regions voisines</Tag>
              <Tag light>Recrutement verifie</Tag>
            </div>

            <h1 className="display rise d2" style={{
              fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', fontWeight: 800, lineHeight: 1.08,
              color: '#fff', margin: '0 0 1.5rem', letterSpacing: '-0.02em',
            }}>
              Recrutez des equipes<br />
              <span style={{ color: '#e8b84b', fontStyle: 'italic' }}>terrain</span> pretes<br />
              a agir
            </h1>

            <p className="rise d3" style={{
              fontSize: '1.1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.72)',
              maxWidth: 520, margin: '0 0 2.5rem',
            }}>
              Trouvez des travailleurs qualifies pour vos recoltes, tailles, preparations de sol et logistique. Publiez, validez et contactez sans friction.
            </p>

            <div className="rise d4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <RequestWorkersCTA className="px-7 py-3.5 text-base" />
              <Link
                to="/directory"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-3.5 text-base font-semibold text-white/90 shadow-[0_10px_28px_rgba(0,0,0,0.25)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/15"
                style={{ textDecoration: 'none' }}
              >
                Parcourir l'annuaire <LuMoveRight />
              </Link>
            </div>
          </div>

          {/* Right glass card */}
          <div className="rise d5" style={{
            background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.14)', borderRadius: 24, padding: '2rem',
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e8b84b', margin: '0 0 6px' }}>
                Vue d'ensemble
              </p>
              <p className="display" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.3 }}>
                Filtrage et mise en relation rapides
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {stats.map((s) => (
                <div key={s.label} style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 16, padding: '1.2rem 1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.55)', marginBottom: 10, fontSize: 13 }}>
                    {s.icon}
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{s.label}</span>
                  </div>
                  <p className="display" style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1 }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Supervise par admin</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#e8b84b' }}>
                En savoir plus <LuArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="fade-in d5" style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        <span>Defiler</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to bottom, transparent, #f4f7f4)', zIndex: 2, pointerEvents: 'none' }} />
    </section>

    {/* 2 ── TICKER */}
    <div style={{ background: '#1a5c35', padding: '14px 0', overflow: 'hidden' }}>
      <div className="ticker-track">
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 20,
            padding: '0 28px', fontSize: 13, fontWeight: 600,
            color: 'rgba(255,255,255,0.75)', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <span style={{ color: '#e8b84b', fontSize: 8 }}>&#9670;</span>
            {item}
          </span>
        ))}
      </div>
    </div>

    {/* 3 ── WHY DIFFERENT */}
    <section style={{ padding: '7rem 6vw', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <span className="section-line" />
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22803f', margin: '0 0 10px' }}>
            Pourquoi c'est different
          </p>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#0f1f12', margin: 0, lineHeight: 1.15 }}>
            Une plateforme concue<br />pour le monde agricole
          </h2>
        </div>
        <p style={{ maxWidth: 380, fontSize: '1rem', lineHeight: 1.7, color: '#6b7280', margin: 0 }}>
          Validation des profils, tunnel guide, et acces direct via WhatsApp ou appel. Vous gagnez du temps et gardez la maitrise.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {highlights.map((h, i) => (
          <article key={i} className="lift" style={{
            background: '#f4f7f4', border: '1px solid rgba(26,92,53,0.12)',
            borderRadius: 20, padding: '2rem 1.75rem',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: h.color, color: h.iconColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              {h.icon}
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f1f12', margin: '0 0 10px' }}>{h.title}</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: '#6b7280', margin: 0 }}>{h.desc}</p>
          </article>
        ))}
      </div>
    </section>

    {/* 4 ── HOW IT WORKS */}
    <section style={{ padding: '7rem 6vw', background: '#f4f7f4' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="section-line" style={{ margin: '0 auto 1rem' }} />
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22803f', margin: '0 0 10px' }}>
          Parcours guide
        </p>
        <h2 className="display" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#0f1f12', margin: '0 0 1rem' }}>
          Publiez et recrutez en 3 etapes
        </h2>
        <p style={{ maxWidth: 500, margin: '0 auto', fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
          Un tunnel simple pour securiser vos recrutements et demarrer les missions rapidement.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {steps.map((step, i) => (
          <article key={i} className="lift" style={{
            position: 'relative', background: '#fff',
            border: '1px solid rgba(26,92,53,0.12)', borderRadius: 24,
            padding: '2.5rem 2rem', borderTop: '3px solid #1a5c35',
          }}>
            <div className="display" style={{
              position: 'absolute', top: 12, right: 20,
              fontSize: '5rem', fontWeight: 900, lineHeight: 1,
              color: 'rgba(26,92,53,0.06)', userSelect: 'none',
            }}>
              {step.n}
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: 16, background: '#1a5c35', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
            }}>
              {step.icon}
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#e8b84b', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Etape {step.n}
            </p>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f1f12', margin: '0 0 10px' }}>{step.title}</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#6b7280', margin: 0 }}>{step.desc}</p>
          </article>
        ))}
      </div>
    </section>

    {/* 5 ── PILLARS */}
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 560 }}>
      {pillars.map((p, i) => (
        <article key={i} style={{ background: p.bg, padding: '5rem 6vw', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: i === 0 ? '-80px' : 'auto', bottom: i === 1 ? '-80px' : 'auto', right: '-60px',
            width: 280, height: 280, borderRadius: '50%',
            background: p.accent, opacity: 0.07, filter: 'blur(60px)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{
              display: 'inline-flex', padding: '5px 16px', borderRadius: 999,
              background: `${p.accent}25`, color: p.accent,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              border: `1px solid ${p.accent}40`, marginBottom: '1.5rem',
            }}>
              {p.badge}
            </span>
            <div style={{
              width: 56, height: 56, borderRadius: 18,
              background: `${p.accent}20`, color: p.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem',
            }}>
              {p.icon}
            </div>
            <h3 className="display" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 800, color: '#fff', margin: '0 0 2rem', lineHeight: 1.2 }}>
              {p.headline}
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {p.points.map((pt) => (
                <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                  <span style={{
                    display: 'inline-flex', width: 22, height: 22, borderRadius: 7,
                    background: p.accent, color: '#0f1f12',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1,
                  }}>&#10003;</span>
                  {pt}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: p.accent, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.accent, flexShrink: 0 }} />
              Processus supervise par admin
            </div>
          </div>
        </article>
      ))}
    </section>

    {/* 6 ── SUPPORT DETAILS */}
    <section style={{ padding: '7rem 6vw', background: '#fff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '5rem', alignItems: 'center' }}>
        <div>
          <span className="section-line" />
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22803f', margin: '0 0 10px' }}>
            Support dedie
          </p>
          <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)', fontWeight: 800, color: '#0f1f12', margin: '0 0 1.25rem', lineHeight: 1.2 }}>
            Accompagnement par l'equipe admin
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: '#6b7280', margin: 0 }}>
            Suivi des missions, rappel des delais et visibilite sur l'historique. Nous gardons la plateforme simple, rapide et orientee resultat.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { icon: <LuBadgeCheck size={18} />, label: 'Validation', desc: 'Profils verifies et classes par competences.', bg: '#eaf4ee', c: '#1a5c35' },
            { icon: <LuMessageCircle size={18} />, label: 'Contact direct', desc: 'WhatsApp et appel integres sans friction.', bg: '#fef8ea', c: '#b87d10' },
            { icon: <LuClipboardList size={18} />, label: 'Suivi', desc: "Historique des demandes et statut en temps reel.", bg: '#eef0fb', c: '#3a44b5' },
            { icon: <LuLeaf size={18} />, label: 'Terrain', desc: 'Specifique aux besoins agricoles et saisonniers.', bg: '#eaf4ee', c: '#1a5c35' },
          ].map((item) => (
            <div key={item.label} className="lift" style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '1.5rem', background: '#f4f7f4',
              border: '1px solid rgba(26,92,53,0.12)', borderRadius: 18,
            }}>
              <span style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: item.bg, color: item.c,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.icon}
              </span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f1f12', margin: '0 0 4px' }}>{item.label}</p>
                <p style={{ fontSize: '0.825rem', lineHeight: 1.6, color: '#6b7280', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 7 ── FINAL CTA */}
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f1f12 0%, #1a5c35 50%, #1a4a2a 100%)',
      padding: '7rem 6vw',
    }}>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: '#e8b84b', opacity: 0.05, filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: '#22803f', opacity: 0.12, filter: 'blur(50px)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #e8b84b, transparent)' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr auto', gap: '4rem', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e8b84b', margin: '0 0 12px' }}>
            Pret a accelerer
          </p>
          <h2 className="display" style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800,
            color: '#fff', margin: '0 0 1.25rem', lineHeight: 1.1, letterSpacing: '-0.02em',
          }}>
            Lancez votre prochaine<br />
            <span style={{ color: '#e8b84b', fontStyle: 'italic' }}>mission</span> aujourd'hui
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', maxWidth: 520, margin: '0 0 2.5rem' }}>
            Decrivez vos besoins, recevez des profils valides et ouvrez la conversation sur WhatsApp ou par telephone.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '2rem' }}>
            <span className="btn-gold" style={{ borderRadius: 12, padding: '14px 28px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <RequestWorkersCTA />
            </span>
            <Link to="/contact" className="btn-ghost" style={{ borderRadius: 12, padding: '14px 28px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              Discuter avec l'equipe
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Validation admin', 'WhatsApp et appel', 'Historique securise'].map((t, i) => (
              <Tag key={t} light>{t}</Tag>
            ))}
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)', borderRadius: 24, padding: '2.5rem', minWidth: 300,
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 1.5rem' }}>
            Ce que vous obtenez
          </h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <LuBadgeCheck size={16} />, text: 'Profils verifies avec coordonnees' },
              { icon: <LuWorkflow size={16} />,   text: 'Parcours de demande simplifie' },
              { icon: <LuClock3 size={16} />,     text: 'Suivi administrateur pour fiabilite' },
              { icon: <LuPhoneCall size={16} />,  text: 'Contact direct (WhatsApp et appel)' },
            ].map(({ icon, text }) => (
              <li key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                <span style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8b84b',
                }}>
                  {icon}
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  </div>
);

export default Home;