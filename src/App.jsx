import { useEffect, useRef, useState } from 'react'
import ContactMonster from './ContactMonster.jsx'
import PeekMonster from './PeekMonster.jsx'
import './App.css'

const LENS_SIZE = 200

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const links = {
  email: 'charlesroque0114@gmail.com',
  linkedin: 'https://www.linkedin.com/in/charles-roque-21177634a/',
  github: 'https://github.com/Rowkiduyan',
  resume: '/Roque_Resume.pdf',
}

const projects = [
  {
    title: 'DriveWise',
    icon: 'sleepy',
    image: '/projects/drivewise.webp',
    imageAlt: 'DriveWise supervisor dashboard with a live GPS map and drowsiness alerts',
    imageSize: [1400, 665],
    subtitle: 'AI-Powered Driver Drowsiness Monitoring & GPS Tracking',
    type: 'Academic Capstone Project',
    role: 'Team of 5. I owned the supervisor dashboard: the live GPS map, drowsiness alerts, and integrated Dlib to the Raspberry Pi.',
    date: 'Feb 2026 – Sep 2026',
    points: [
      'Designed a fleet monitoring web application using React, Supabase, and Raspberry Pi.',
      'Implemented drowsiness detection using facial landmarks, EAR, and MAR with automated safety alerts and event logging.',
      'Built GPS trip tracking, route monitoring, fleet management, and role-based interfaces.',
    ],
    tech: ['React', 'Supabase', 'Raspberry Pi'],
    repo: 'https://github.com/Rowkiduyan/drivewise-system',
    live: 'https://drivewisesite.tech/',
  },
  {
    title: 'Each-R',
    icon: 'records',
    image: '/projects/eachr.webp',
    imageAlt: 'Each-R job board with a search bar and job posting cards',
    imageSize: [1406, 585],
    subtitle: 'Human Resources Information System',
    type: 'Academic Capstone Project',
    role: 'Team of 4. I owned the Job Application, the employee retirement, and how the documents are passed to each users.',
    date: 'Apr 2025 – Feb 2026',
    points: [
      'Designed a full-stack HRIS using React and Supabase to centralize employee records and compliance tracking.',
      'Implemented automated email notifications using EmailJS to reduce manual HR follow-ups.',
      'Designed Supabase database structures and deployed the application on DigitalOcean.',
    ],
    tech: ['React', 'Supabase', 'EmailJS', 'DigitalOcean'],
    repo: 'https://github.com/Rowkiduyan/Each-R',
    live: 'https://each-r.vercel.app/',
    
  },
  {
    title: 'Gakuran War Finder',
    icon: 'bot',
    image: '/projects/gakuran.webp',
    imageAlt: 'Gakuran War Finder bot menu in Discord with Queue war, War board, My challenges, and My wars buttons',
    imageSize: [1141, 543],
    imagePosition: 'left center',
    subtitle: 'Discord Bot for Clan War Matchmaking',
    type: 'Personal Project',
    role: 'Solo project. I designed the features, matchmaking and look, built it with Claude, and is currently running for a 60-member server.',
    points: [
      'Built a Discord bot with discord.js and TypeScript that matches clans by size, server, and war format through a queue or a public war board.',
      'Automated match setup: creates a group chat for both clans in the bot\'s server and pings members when the war starts.',
      'Added challenges, war booking with reschedule/cancel, and per-clan rules, stored in Supabase and hosted on Railway.',
      'Serves a community server of about 60 users.',
    ],
    tech: ['TypeScript', 'discord.js', 'Supabase', 'Railway'],
    live: 'https://discord.com/oauth2/authorize?client_id=1571914145618599956&permissions=268568592&integration_type=0&scope=bot+applications.commands',
  },
]

const awards = [
  {
    title: '2nd Place – DATAxYOUTH Hackathon',
    detail: 'UP Diliman, 2025 · Built a data-driven prototype using Philippine flood data.',
    icon: 'hackathon',
    featured: true,
  },
  {
    title: "Dean's Lister – First Honors",
    detail: 'National University – Fairview, 2023–Present',
    icon: 'medal',
  },
  { title: 'DPJO White Scholar', detail: 'National University – Fairview, 2023–2024', icon: 'cap' },
  { title: 'DMMJ Blue Scholar', detail: 'National University – Fairview, 2024–Present', icon: 'cap' },
  {
    icon: 'badge',
    title: 'DataCamp Certifications',
    detail: 'Understanding Data Science, Machine Learning, SQL, Data Visualization, Data Engineering, 2025',
  },
]

const education = [
  {
    school: 'National University – Fairview',
    degree: 'BS Information Technology, Specialization in Mobile and Internet Technologies',
    date: '2023 – 2027 · Expected Graduation: 2027',
  },
  {
    school: 'Saint Francis Xavier Catholic School',
    degree: 'General Academic Strand',
    date: '2021 – 2023',
  },
]

const skills = [
  {
    group: 'Frontend',
    icon: 'code',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Responsive Design'],
  },
  { group: 'Backend & Database', icon: 'database', items: ['Supabase', 'PostgreSQL', 'Firebase'] },
  {
    group: 'Tools',
    icon: 'wrench',
    items: ['Git', 'GitHub', 'DigitalOcean', 'System Testing', 'UI/UX Basics'],
  },
]

const highlights = [
  { icon: 'trophy', value: '2nd Place', label: 'DATAxYOUTH Hackathon' },
  { icon: 'medal', value: "Dean's Lister", label: 'First Honors' },
  { icon: 'cap', value: 'BSIT 2027', label: 'NU – Fairview' },
]

const navItems = ['About', 'Projects', 'Awards', 'Education', 'Skills', 'Contact']

// Stroke icons (24×24) used across the page.
const iconPaths = {
  code: (
    <>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  // Closed eye with "Zz": drowsiness tracking
  sleepy: (
    <>
      <path d="M2 12c2 3 4.5 4.5 7 4.5s5-1.5 7-4.5" />
      <path d="m4.5 15-1.5 2" />
      <path d="M9 16.5V19" />
      <path d="m13.5 15 1.5 2" />
      <path d="M15 3h4l-4 5h4" />
      <path d="M20 10h2.5L20 13h2.5" />
    </>
  ),
  // Stacked files with record lines
  records: (
    <>
      <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
      <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
      <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" />
      <path d="M10.5 10h6" />
      <path d="M10.5 13.5h4" />
    </>
  ),
  // Robot head: chat bot
  bot: (
    <>
      <path d="M12 8V4H8" />
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </>
  ),
  trophy: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </>
  ),
  // Laptop with code brackets
  hackathon: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M2 20h20" />
      <path d="m10 8-2 2 2 2" />
      <path d="m14 8 2 2-2 2" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11" />
    </>
  ),
  cap: (
    <>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </>
  ),
  badge: (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
}

function Icon({ name, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  )
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="section reveal">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  )
}

// Center the lens on the (still small) projects content, kept inside the viewport.
function lensPosition() {
  const rect = document.getElementById('projects-content').getBoundingClientRect()
  const margin = LENS_SIZE / 2 + 16
  const clamp = (v, max) => Math.min(Math.max(v, margin), max - margin)
  return {
    x: clamp(rect.left + rect.width / 2, window.innerWidth),
    // Never below the upper-middle of the screen, so the lens doesn't sit too low.
    y: clamp(
      Math.min(rect.top + rect.height / 2, window.innerHeight * 0.42),
      window.innerHeight,
    ),
  }
}

// Magnifying glass that settles over the small content, then expands out of view
// while the content grows to full size.
function ZoomLens({ zoom, onShown, onDone }) {
  const { x, y, phase } = zoom
  const farthest = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )
  const scale = (farthest * 2) / LENS_SIZE + 1

  return (
    <div className="zoom-overlay" aria-hidden="true">
      <div
        className={`lens ${phase}`}
        style={{ left: x, top: y, '--zoom-scale': scale }}
        onAnimationEnd={phase === 'show' ? onShown : onDone}
      />
    </div>
  )
}

// A few CSS-twinkling stars (positions in %) on top of the static canvas.
const twinkles = [
  [8, 12], [22, 68], [35, 30], [48, 84], [57, 18], [66, 52],
  [74, 8], [83, 40], [91, 76], [14, 90], [40, 56], [96, 22],
]

// Galaxy backdrop: stars are drawn once to a canvas (no animation loop) and only
// redrawn when the width changes, so mobile toolbar show/hide doesn't trigger work.
function Galaxy() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    let lastWidth = 0
    let timer

    function draw() {
      const w = window.innerWidth
      if (w === lastWidth) return
      lastWidth = w
      const h = Math.max(window.innerHeight, window.screen.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.height = `${h}px`

      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      // Star count scales with screen area: ~280 on desktop, ~80 on phones.
      const count = Math.round((w * h) / 4000)
      for (let i = 0; i < count; i++) {
        const big = Math.random() > 0.92
        ctx.globalAlpha = 0.3 + Math.random() * 0.6
        ctx.fillStyle = Math.random() > 0.8 ? '#b9c8ff' : '#ffffff'
        ctx.beginPath()
        ctx.arc(
          Math.random() * w,
          Math.random() * h,
          big ? 0.9 + Math.random() * 0.7 : 0.3 + Math.random() * 0.6,
          0,
          Math.PI * 2,
        )
        ctx.fill()
      }
    }

    function onResize() {
      clearTimeout(timer)
      timer = setTimeout(draw, 200)
    }

    draw()
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="galaxy" aria-hidden="true">
      <canvas ref={canvasRef} />
      {twinkles.map(([x, y], i) => (
        <span
          key={i}
          className="twinkle"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i % 6) * 0.7}s` }}
        />
      ))}
    </div>
  )
}

function App() {
  const [reduceMotion] = useState(prefersReducedMotion)
  // Projects starts small until the zoom has played once.
  const [played, setPlayed] = useState(reduceMotion)
  const [zoom, setZoom] = useState(null)
  // Nav clicks smooth-scroll past Projects; ignore the observer until that scroll ends.
  const ignoreScrollUntil = useRef(0)

  const [activeSection, setActiveSection] = useState('')

  // Highlight the menu link of the section in the middle of the screen.
  // Contact is short and can't reach the middle, so the bottom of the page counts as Contact.
  useEffect(() => {
    const lastId = navItems.at(-1).toLowerCase()
    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4

    const observer = new IntersectionObserver(
      (entries) => {
        if (atBottom()) return setActiveSection(lastId)
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    navItems.forEach((item) => observer.observe(document.getElementById(item.toLowerCase())))

    let wasAtBottom = false
    function onScroll() {
      const bottom = atBottom()
      if (bottom) {
        setActiveSection(lastId)
      } else if (wasAtBottom) {
        // Leaving the bottom: go back to whichever section is in the middle of the screen.
        const middle = window.innerHeight / 2
        const current = navItems
          .map((item) => document.getElementById(item.toLowerCase()))
          .find((el) => {
            const { top, bottom: elBottom } = el.getBoundingClientRect()
            return top <= middle && elBottom >= middle
          })
        if (current) setActiveSection(current.id)
      }
      wasAtBottom = bottom
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Fade each section in the first time it scrolls into view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Play the zoom the first time the visitor scrolls to Projects.
  useEffect(() => {
    if (played) return
    const target = document.getElementById('projects')
    let firstCheck = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Already in view (or passed) on load: show it at full size without playing.
        if (firstCheck) {
          firstCheck = false
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            setPlayed(true)
            return
          }
        }
        if (!entry.isIntersecting || entry.time < ignoreScrollUntil.current) return
        // Wait a moment: a fast scroll can pass straight through Projects.
        clearTimeout(timer)
        timer = setTimeout(() => {
          const r = target.getBoundingClientRect()
          const stillHere = r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4
          if (!stillHere) return
          observer.disconnect()
          setZoom({ ...lensPosition(), phase: 'show' })
        }, 200)
      },
      { rootMargin: '0px 0px -70% 0px' },
    )
    let timer
    observer.observe(target)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [played])

  // If the visitor scrolls away from Projects mid-zoom, drop the lens and show it full size.
  const zooming = zoom !== null
  useEffect(() => {
    if (!zooming) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) return
      setPlayed(true)
      setZoom(null)
    })
    observer.observe(document.getElementById('projects'))
    return () => observer.disconnect()
  }, [zooming])

  function handleNavClick(e, id) {
    if (id !== 'projects') {
      ignoreScrollUntil.current = e.timeStamp + 1200
      return
    }
    if (reduceMotion) return
    e.preventDefault()
    if (zoom) return
    const target = document.getElementById('projects')
    const navHeight = document.querySelector('.nav').offsetHeight
    window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'instant' })
    history.replaceState(null, '', '#projects')
    setZoom({ ...lensPosition(), phase: 'show' })
  }

  const small = !played || zoom?.phase === 'show'
  const contentClass = small ? 'is-small' : zoom ? 'is-growing' : ''

  return (
    <>
      <Galaxy />
      <PeekMonster />
      {zoom && (
        <ZoomLens
          zoom={zoom}
          onShown={() => {
            setPlayed(true)
            setZoom((z) => ({ ...z, phase: 'grow' }))
          }}
          onDone={() => setZoom(null)}
        />
      )}

      <header className="nav">
        <div className="container nav-inner">
          <a href="#top" className="brand">Charles Roque</a>
          <nav>
            {navItems.map((item) => {
              const id = item.toLowerCase()
              return (
                <a
                  key={item}
                  href={`#${id}`}
                  className={activeSection === id ? 'active' : undefined}
                  aria-current={activeSection === id ? 'location' : undefined}
                  onClick={(e) => handleNavClick(e, id)}
                >
                  {item}
                </a>
              )
            })}
          </nav>
        </div>
      </header>

      <main id="top" className="container">
        <section className="hero">
          <p className="eyebrow">Aspiring Web Developer</p>
          <h1>Charles Duain T. Roque</h1>
          <p className="lead">
            BSIT student from Metro Manila, Philippines, building full-stack web
            applications with React, JavaScript, and Supabase.
          </p>
          <div className="actions">
            <a className="btn btn-primary" href={links.resume} download="Charles_Roque_Resume.pdf">Download Resume</a>
            <a className="btn" href={links.github} target="_blank" rel="noreferrer">GitHub</a>
            <a className="btn" href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
          <ul className="highlights">
            {highlights.map((h) => (
              <li key={h.value}>
                <span className="highlight-icon"><Icon name={h.icon} size={20} /></span>
                <div>
                  <strong>{h.value}</strong>
                  <span>{h.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Section id="about" title="About">
          <div className="about-layout">
            <img
              className="about-photo"
              src="/charles.webp"
              alt="Charles Roque"
              width="160"
              height="160"
              loading="lazy"
            />

            <div>
            <p className="text">
            I'm an IT student at National University - Fairview, 
            specializing in Mobile and Internet Technologies. 
            I got into web development because I like seeing an idea turn into 
            something people actually use.
            </p>
            <p className="text">
              I build apps that solve a real problem end to end: a fleet monitor that warns drowsy drivers, an HR system, 
              and a Discord bot that sets up clan wars for a 60-member server. I design how each app works, from features and user flows 
              to the database, and build with AI tools like Claude. Then I handle the Supabase setup, deployment and testing.
            </p>
            <p className="text">
              I'm looking for a frontend or full-stack internship or junior developer role where I 
              can ship real features and grow as a programmer. 
              I'm based in Metro Manila and open to on-site, hybrid or remote work.
            </p>
            </div>
          </div>
        </Section>

        <section id="projects" className="section">
          <div id="projects-content" className={`zoom-content ${contentClass}`}>
            <h2 className="section-title">Projects</h2>
            <div className="grid">
              {projects.map((p) => (
                <article key={p.title} className="card">
                  {p.image && (
                    <a
                      className="project-shot"
                      href={p.image}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${p.title} screenshot in full size`}
                    >
                      <img
                        src={p.image}
                        alt={p.imageAlt}
                        width={p.imageSize[0]}
                        height={p.imageSize[1]}
                        loading="lazy"
                        decoding="async"
                        style={p.imagePosition ? { objectPosition: p.imagePosition } : undefined}
                      />
                    </a>
                  )}
                  <span className="project-icon"><Icon name={p.icon} size={26} /></span>
                  <p className="meta">{p.date ? `${p.type} · ${p.date}` : p.type}</p>
                  <h3>{p.title}</h3>
                  <p className="subtitle">{p.subtitle}</p>
                  {p.role && (
                    <p className="role"><strong>My Role:</strong> {p.role}</p>
                  )}
                  <ul>
                    {p.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  <div className="tags">
                    {p.tech.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                                    {(p.repo || p.live) && (
                    <div className="project-links">
                      {p.repo && (
                        <a className="btn btn-small" href={p.repo} target="_blank" rel="noreferrer"
                           aria-label={`${p.title} source code on GitHub`}>
                          Repo
                        </a>
                      )}
                      {p.live && (
                        <a className="btn btn-small btn-primary" href={p.live} target="_blank" rel="noreferrer"
                           aria-label={`${p.title} live demo`}>
                          Live
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="awards" className="section reveal awards">
          <h2 className="section-title with-icon">
            <span className="title-icon"><Icon name="trophy" size={28} /></span>
            Awards & Certifications
          </h2>
          <ul className="award-list">
            {awards.map((a, i) => (
              <li
                key={a.title}
                className={`award-item${a.featured ? ' featured' : ''}`}
                style={{ '--i': i }}
              >
                <span className="award-icon">
                  <Icon name={a.icon} size={a.featured ? 28 : 20} />
                </span>
                <div className="award-text">
                  <strong>{a.title}</strong>
                  <span>{a.detail}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Section id="education" title="Education">
          <ul className="timeline">
            {education.map((e) => (
              <li key={e.school}>
                <span className="meta">{e.date}</span>
                <strong>{e.school}</strong>
                <span>{e.degree}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="skills" title="Skills">
          <div className="skills">
            {skills.map(({ group, icon, items }) => (
              <div key={group} className="skill-card">
                <h3 className="skill-group">
                  <Icon name={icon} size={18} />
                  {group}
                </h3>
                <div className="tags">
                  {items.map((s) => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact">
          <p className="text">
            I'm open to internships and junior web developer roles. Feel free to reach out.
          </p>
          <div className="contact-row">
            <a id="contact-email" className="btn btn-primary" href={`mailto:${links.email}`}>
              {links.email}
            </a>
            <ContactMonster buttonId="contact-email" />
          </div>
        </Section>
      </main>

      <footer className="footer">
        <div className="container">© 2026 Charles Duain T. Roque</div>
      </footer>
    </>
  )
}

export default App
