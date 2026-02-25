import { Link } from 'react-router-dom';
import {
  LuBadgeCheck,
  LuClipboardList,
  LuClock3,
  LuLeaf,
  LuMoveRight,
  LuMessageCircle,
  LuPhoneCall,
  LuSparkles,
  LuUsers,
  LuWorkflow,
} from 'react-icons/lu';
import RequestWorkersCTA from '../components/RequestWorkersCTA';

const steps = [
  {
    icon: <LuClipboardList />,
    title: 'Créez votre compte',
    description: 'Inscrivez votre exploitation et vos besoins pour accéder aux services sécurisés.',
  },
  {
    icon: <LuWorkflow />,
    title: 'Publiez votre mission',
    description: 'Décrivez les travaux à réaliser, la localisation et les dates prévues en quelques clics.',
  },
  {
    icon: <LuMessageCircle />,
    title: 'Contactez les profils vérifiés',
    description: 'Les travailleurs validés apparaissent instantanément et sont joignables par WhatsApp ou appel.',
  },
];

const highlights = [
  {
    icon: <LuLeaf />,
    title: 'Pensé pour les exploitations',
    description: 'Une plateforme taillée pour le terrain : récolte, taille, irrigation, logistique et plus encore.',
  },
  {
    icon: <LuBadgeCheck />,
    title: 'Validation sérieuse',
    description: 'Profils vérifiés et filtrés pour éviter les mauvaises surprises. Vous voyez uniquement les travailleurs prêts.',
  },
  {
    icon: <LuSparkles />,
    title: 'Mise en relation rapide',
    description: 'CTA clairs vers WhatsApp et l’appel pour déclencher l’action sans friction.',
  },
];

const pillars = [
  {
    badge: 'Pour les agriculteurs',
    icon: <LuUsers />, 
    title: 'Une équipe prête en quelques minutes',
    points: ['Publiez votre besoin en trois étapes', 'Recevez des profils validés et disponibles', 'Contact direct et historique conservé'],
  },
  {
    badge: 'Pour les travailleurs',
    icon: <LuBadgeCheck />, 
    title: 'Valorisez vos compétences',
    points: ['Créez un profil clair et vérifié', 'Mettez à jour vos disponibilités', 'Gagnez en visibilité dans l’annuaire'],
  },
];

const stats = [
  { label: 'Travailleurs validés', value: '+480', detail: 'main-d’œuvre prête', icon: <LuBadgeCheck/> },
  { label: 'Missions publiées', value: '1 200', detail: 'demandes traitées', icon: <LuClipboardList /> },
  { label: 'Délai moyen', value: '48h', detail: 'pour recevoir des contacts', icon: <LuClock3 /> },
];

const StepCard = ({ icon, title, description, index, isLast = false }) => (
  <article className="relative rounded-2xl border border-green-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg">
    {!isLast && <span className="absolute right-4 top-12 hidden h-[70%] w-px bg-gradient-to-b from-[#16a34a] to-transparent md:block" aria-hidden="true" />}
    <div className="flex items-center gap-3">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ecfdf3] text-xl text-[#166534] ring-2 ring-[#16a34a]/30">
        {icon}
      </span>
      <div className="flex items-baseline gap-2 text-[#166534]">
        <span className="text-xs font-semibold uppercase tracking-wide">Étape</span>
        <span className="text-lg font-bold">{index}</span>
      </div>
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
  </article>
);

const HighlightCard = ({ icon, title, description }) => (
  <article className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div className="absolute right-4 top-4 h-14 w-14 rounded-full bg-[#ecfdf3] blur-3xl" aria-hidden="true" />
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ecfdf3] text-2xl text-[#166534] ring-1 ring-[#16a34a]/25">
      {icon}
    </span>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
  </article>
);

const Home = () => {
  return (
    <div className="space-y-24 pb-16 pt-4">
      <section
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(22, 163, 74, 0.7), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4 text-left">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/30">
                <span className="h-2 w-2 rounded-full bg-[#facc15]" />
                Plateforme agricole moderne
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase text-white ring-1 ring-white/30">
                    Maroc & régions voisines
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase text-white ring-1 ring-white/20">
                    Recrutement vérifié
                  </span>
                </div>
                <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
                  Recrutez des équipes terrain prêtes à agir
                </h1>
                <p className="max-w-2xl text-base text-white/90 sm:text-lg">
                  Trouvez des travailleurs qualifiés pour vos récoltes, tailles, préparations de sol et logistique. Publiez, validez et contactez sans friction.
                </p>
              </div>

              <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <RequestWorkersCTA className="shadow-lg shadow-[#facc15]/30 transition hover:-translate-y-0.5" />
                <Link
                  to="/directory"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#facc15] bg-white/90 px-6 py-3 text-sm font-bold text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fef9c3]"
                >
                  Parcourir les travailleurs
                  <LuMoveRight className="text-lg" />
                </Link>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/20 bg-white/10 p-6 text-white shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-white/80">Vue d’ensemble</p>
                  <p className="text-2xl font-bold">Filtrage et mise en relation rapides</p>
                </div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold ring-1 ring-white/25">
                  ⚡
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/25 bg-white/10 px-4 py-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-center gap-2 text-white/80">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-lg">{stat.icon}</span>
                      <p className="text-xs font-semibold uppercase tracking-wide">{stat.label}</p>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold leading-none">{stat.value}</p>
                    <p className="text-xs text-white/70">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container overflow-hidden rounded-3xl border border-[#16a34a]/15 bg-gradient-to-br from-white via-green-50/60 to-white p-8 shadow-sm">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#16a34a]">Pourquoi c’est différent</p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Une expérience claire, rapide et fiable</h2>
            <p className="max-w-2xl text-sm text-gray-600 sm:text-base">
              Validation des profils, tunnel guidé, et accès direct via WhatsApp ou appel. Vous gagnez du temps et gardez la maîtrise.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {highlights.map((item) => (
                <HighlightCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ecfdf3]/70 via-transparent to-[#facc15]/10" aria-hidden="true" />
            <div className="relative z-10 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#166534]">Support dédié</p>
                <h3 className="text-xl font-bold text-[#0f172a]">Accompagnement par l’équipe admin</h3>
                <p className="mt-2 text-sm text-gray-600">Suivi des missions, rappel des délais et visibilité sur l’historique.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl border border-[#16a34a]/20 bg-white/80 p-4 shadow-sm">
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ecfdf3] text-[#166534] ring-1 ring-[#16a34a]/25">
                    <LuBadgeCheck />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Validation</p>
                    <p className="text-xs text-gray-600">Profils vérifiés et classés par compétences.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-[#16a34a]/20 bg-white/80 p-4 shadow-sm">
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff7e6] text-[#b45309] ring-1 ring-[#facc15]/40">
                    <LuMessageCircle />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Contact direct</p>
                    <p className="text-xs text-gray-600">WhatsApp et appel intégrés sans friction.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-[#16a34a]/20 bg-white/80 p-4 shadow-sm">
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4338ca] ring-1 ring-[#4338ca]/25">
                    <LuClipboardList />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Suivi</p>
                    <p className="text-xs text-gray-600">Historique des demandes et statut en temps réel.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-[#16a34a]/20 bg-white/80 p-4 shadow-sm">
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ecfdf3] text-[#166534] ring-1 ring-[#16a34a]/25">
                    <LuLeaf />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Terrain</p>
                    <p className="text-xs text-gray-600">Spécifique aux besoins agricoles et saisonniers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container space-y-10">
        <div className="flex flex-col gap-2 text-left sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#16a34a]">Parcours guidé</p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Publiez et recrutez en 3 étapes</h2>
          </div>
          <p className="max-w-lg text-sm text-gray-600 sm:text-base">
            Un tunnel simple pour sécuriser vos recrutements et démarrer les missions rapidement.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step, idx) => (
            <StepCard
              key={step.title}
              icon={step.icon}
              title={step.title}
              description={step.description}
              index={idx + 1}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>
      </section>

      <section className="container grid grid-cols-1 gap-8 lg:grid-cols-2">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="relative overflow-hidden rounded-3xl border border-[#16a34a]/20 bg-gradient-to-br from-white via-green-50 to-white p-8 shadow-sm"
          >
            <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-[#facc15]/30 blur-3xl" aria-hidden="true" />
            <span className="inline-flex items-center rounded-full bg-[#ecfdf3] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#166534] ring-1 ring-[#16a34a]/30">
              {pillar.badge}
            </span>
            <h3 className="mt-4 text-2xl font-bold text-[#0f172a]">{pillar.title}</h3>
            <div className="mt-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl text-[#166534] ring-1 ring-[#16a34a]/25">
              {pillar.icon}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {pillar.points.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#16a34a]/10 text-xs text-[#166534]">
                    ✓
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#166534]">
              <span className="inline-block h-2 w-2 rounded-full bg-[#facc15]" />
              Processus supervisé par l’équipe admin
            </div>
          </article>
        ))}
      </section>

      <section className="container overflow-hidden rounded-3xl border border-[#16a34a]/20 bg-white/90 p-8 shadow-sm backdrop-blur-sm">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#16a34a]">Prêt à accélérer</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Lancez votre prochaine mission aujourd’hui</h2>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
              Décrivez vos besoins, recevez des profils validés et ouvrez la conversation sur WhatsApp ou par téléphone. Nous gardons la plateforme simple, rapide et orientée résultat.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <RequestWorkersCTA />
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
              >
                Discuter avec l’équipe
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span className="rounded-full bg-[#ecfdf3] px-3 py-1 text-[#166534]">Validation admin</span>
              <span className="rounded-full bg-[#fff7e6] px-3 py-1 text-[#b45309]">WhatsApp & appel</span>
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[#4338ca]">Historique sécurisé</span>
            </div>
          </div>
          <div className="relative rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#166534] p-6 text-white shadow-lg">
            <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-white/15 blur-3xl" aria-hidden="true" />
            <h3 className="text-lg font-semibold">Ce que vous obtenez</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-base"><LuBadgeCheck /></span>
                Profils vérifiés avec coordonnées
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-base"><LuWorkflow /></span>
                Parcours de demande simplifié
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-base"><LuClock3 /></span>
                Suivi administrateur pour fiabilité
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-base"><LuPhoneCall /></span>
                Contact direct (WhatsApp & appel)
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
