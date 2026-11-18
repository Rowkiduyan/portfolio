import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MAX_TONGUE = 420 // px the tongue can stretch from the mouth
const TUG_PERIOD = 2400 // ms between tugs toward the email button
const PUPIL_TRAVEL = 4 // svg units the pupils can move
const ANGRY_AFTER = 1200 // ms of trying to leave before pleading turns into anger
const CALM_AFTER = 1500 // ms without leaving signals before it calms down
const TOP_ZONE = 90 // px from the top of the window that counts as heading for the menu
const PUNCH_CHANCE = 1 // chance it punches the email button each time it gets angry
const ANGRY_SCROLL = 200 // px of scrolling up that also makes it angry (before Contact leaves view)
const PUNCH_DELAY = 250 // ms after getting angry before the punch
const PUNCH_LENGTH = 700 // ms, matches the punch animation in App.css
const PUNCH_IMPACT = 350 // ms into the punch when the fist lands
const BROKEN_FOR = 10000 // ms the button stays "broken" with its notes
const SECOND_NOTE_AFTER = 1500 // ms after the first note before "Please please" appears

const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
const center = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
const inside = (r, p) => p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom
const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const smooth = (x) => x * x * (3 - 2 * x)
// 0 → rises to 1 between a and b → holds until c → falls back to 0 by d (t in 0..1)
const pulse = (t, a, b, c, d) =>
  t < a ? 0 : t < b ? smooth((t - a) / (b - a)) : t < c ? 1 : t < d ? 1 - smooth((t - c) / (d - c)) : 0

const bubbles = {
  normal: 'Psst… over here!',
  happy: 'Yay! Say hi!',
  please: 'Please don’t go…',
  angry: 'HEY! Come back here!',
}

// The monster drawing, shared by the Contact monster and the peeking monster.
// `pupilsRef` and `mouthRef` let callers move the pupils and find the mouth.
export function MonsterArt({ mood = 'normal', punching = false, pupilsRef, mouthRef, pupilOffset }) {
  const angry = mood === 'angry'
  // Angry = green rage form: bulkier body and flexing arms (drawn outside the viewBox).
  const skin = angry ? '#4d9a3f' : '#1e3a8a'
  const outline = angry ? '#1f4d1a' : '#7c96f0'
  const shade = '#2f6a27'

  return (
    <svg
      className={`monster-body${punching ? ' is-punching' : ''}`}
      viewBox="0 0 140 130"
      width="130"
      height="121"
      overflow="visible"
    >
      {angry && (
        <g stroke={outline} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
          {/* Arms in a double-bicep flex: thick limb, bulging bicep, fist */}
          {[1, -1].map((side) => (
            <g
              key={side}
              className={side === 1 ? 'punch-arm' : undefined}
              transform={side === -1 ? 'translate(140 0) scale(-1 1)' : undefined}
            >
              <path d="M22 76 -6 74 -12 38" fill="none" stroke={outline} strokeWidth="22" />
              <path d="M22 76 -6 74 -12 38" fill="none" stroke={skin} strokeWidth="16" />
              <ellipse cx="-2" cy="62" rx="13" ry="11" fill={skin} />
              <path d="M-8 58q6-5 12 0" fill="none" stroke={shade} strokeWidth="2.5" />
              <circle cx="-12" cy="30" r="12" fill={skin} />
              <path d="M-19 26h12M-19 31h12" fill="none" stroke={shade} strokeWidth="2" />
            </g>
          ))}
        </g>
      )}

      {/* Horns */}
      <path d="M38 34 30 8l22 18Z" fill={skin} stroke={outline} strokeWidth="3" strokeLinejoin="round" />
      <path d="M102 34l8-26-22 18Z" fill={skin} stroke={outline} strokeWidth="3" strokeLinejoin="round" />
      {/* Body with a wavy bottom (broader shoulders when angry) */}
      <path
        d={
          angry
            ? 'M8 72C8 30 40 14 70 14s62 16 62 58v44q-10.33-9-20.67 0t-20.67 0-20.67 0-20.67 0-20.67 0-20.67 0Z'
            : 'M18 72C18 34 44 18 70 18s52 16 52 54v44q-8.5-9-17 0t-17 0-17 0-17 0-17 0Z'
        }
        fill={skin}
        stroke={outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {angry && (
        <g fill="none" stroke={shade} strokeWidth="2.5" strokeLinecap="round">
          {/* Chest muscles and a throbbing forehead vein */}
          <path d="M40 110q15 7 30 0 15 7 30 0" />
          <path d="M70 108v8" />
          <path d="M64 24l5 4-4 4 5 4" stroke="#1f4d1a" strokeWidth="3" />
        </g>
      )}

      {/* Eyes */}
      {mood === 'happy' ? (
        <g fill="none" stroke="#f1f4fa" strokeWidth="4" strokeLinecap="round">
          <path d="M40 62q12-13 24 0" />
          <path d="M76 62q12-13 24 0" />
        </g>
      ) : (
        <>
          <circle cx="52" cy="60" r={mood === 'please' ? 15 : 14} fill="#f1f4fa" />
          <circle cx="88" cy="60" r={mood === 'please' ? 15 : 14} fill="#f1f4fa" />
          <g ref={pupilsRef} transform={pupilOffset}>
            <circle cx="52" cy="60" r={angry ? 4.5 : mood === 'please' ? 8 : 6.5} fill={angry ? '#ef4444' : '#0b0f17'} />
            <circle cx="88" cy="60" r={angry ? 4.5 : mood === 'please' ? 8 : 6.5} fill={angry ? '#ef4444' : '#0b0f17'} />
            {!angry && (
              <>
                <circle cx="54.5" cy="57.5" r="2.2" fill="#fff" />
                <circle cx="90.5" cy="57.5" r="2.2" fill="#fff" />
              </>
            )}
          </g>
        </>
      )}

      {/* Eyebrows: raised in the middle when pleading, slanted down when angry */}
      {mood === 'please' && (
        <g stroke="#f1f4fa" strokeWidth="3.5" strokeLinecap="round">
          <path d="M40 44l22-7" />
          <path d="M100 44l-22-7" />
        </g>
      )}
      {angry && (
        // Heavy, furrowed brow
        <path d="M34 40l36 14 36-14" fill="none" stroke="#14300f" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* Mouth */}
      {mood === 'normal' && <ellipse cx="70" cy="94" rx="12" ry="9" fill="#0b0f17" />}
      {mood === 'happy' && (
        <path d="M56 88q14 16 28 0Z" fill="#0b0f17" stroke="#0b0f17" strokeWidth="3" strokeLinejoin="round" />
      )}
      {mood === 'please' && (
        <path d="M58 98q4-6 8-2t8 0 8 2" fill="none" stroke="#0b0f17" strokeWidth="3.5" strokeLinecap="round" />
      )}
      {angry && (
        // Gritted teeth
        <g stroke="#14300f" strokeWidth="2.5" strokeLinejoin="round">
          <rect x="46" y="84" width="48" height="18" rx="4" fill="#f1f4fa" />
          <path d="M46 93h48M56 84v18M65 84v18M75 84v18M84 84v18" fill="none" strokeWidth="2" />
        </g>
      )}
      {/* Where the tongue starts */}
      <circle ref={mouthRef} cx="70" cy="93" r="1" fill="none" />
    </svg>
  )
}

// A small monster in the Contact section whose tongue grabs the cursor and keeps
// tugging it toward the email button. If the visitor tries to leave (scrolls up,
// heads for the menu, or moves out of the window) it pleads, then grows big and
// angry. Browsers can't move the real cursor or stop scrolling, so it's all show.
// Runs only while Contact is on screen.
function ContactMonster({ buttonId }) {
  const [mood, setMood] = useState('normal')
  const [punching, setPunching] = useState(false)
  const [notes, setNotes] = useState(0) // pleading notes shown over the "broken" button
  const mouthRef = useRef(null)
  const pupilsRef = useRef(null)
  const tongueRef = useRef(null)
  const tipRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const section = mouthRef.current.closest('section')
    const button = document.getElementById(buttonId)
    const tongue = tongueRef.current
    const tipEl = tipRef.current

    let raf = 0
    let pointer = null
    let pointerLeftTop = false
    let tip = null
    let current = 'normal'
    let lastScrollY = window.scrollY
    let lastLeaveSignal = 0
    let leavingSince = 0
    let scrolledUp = 0
    let angrySince = 0
    let punchPlanned = false
    const timers = new Set()
    const start = performance.now()

    function onMove(e) {
      if (e.pointerType !== 'mouse') return
      pointer = { x: e.clientX, y: e.clientY }
      pointerLeftTop = false
    }
    function onLeave(e) {
      pointerLeftTop = e.clientY <= TOP_ZONE
      pointer = null
    }

    function setCurrent(next) {
      if (next === current) return
      current = next
      setMood(next)
      if (next === 'angry') {
        angrySince = performance.now()
        punchPlanned = Math.random() < PUNCH_CHANCE
      }
    }

    function later(fn, ms) {
      const id = setTimeout(() => {
        timers.delete(id)
        fn()
      }, ms)
      timers.add(id)
    }

    // Swing at the email button; it "breaks" on impact and mends itself shortly after.
    function punch() {
      setPunching(true)
      later(() => {
        button.classList.add('is-broken')
        setNotes(1)
      }, PUNCH_IMPACT)
      later(() => setPunching(false), PUNCH_LENGTH)
      later(() => setNotes(2), PUNCH_IMPACT + SECOND_NOTE_AFTER)
      later(() => {
        button.classList.remove('is-broken')
        setNotes(0)
      }, PUNCH_IMPACT + BROKEN_FOR)
    }

    function updateMood(now, overButton) {
      const scrollY = window.scrollY
      const scrollingUp = scrollY < lastScrollY - 1
      if (scrollingUp) scrolledUp += lastScrollY - scrollY
      lastScrollY = scrollY
      const headingOut = pointerLeftTop || (pointer && pointer.y < TOP_ZONE)

      if (overButton) {
        leavingSince = 0
        scrolledUp = 0
        return setCurrent('happy')
      }
      if (scrollingUp || headingOut) {
        lastLeaveSignal = now
        if (!leavingSince) leavingSince = now
        const fedUp = now - leavingSince > ANGRY_AFTER || scrolledUp > ANGRY_SCROLL
        return setCurrent(fedUp || current === 'angry' ? 'angry' : 'please')
      }
      if (now - lastLeaveSignal > CALM_AFTER) {
        leavingSince = 0
        scrolledUp = 0
        setCurrent('normal')
      }
    }

    function frame(now) {
      raf = requestAnimationFrame(frame)
      const mouth = center(mouthRef.current.getBoundingClientRect())
      const btnRect = button.getBoundingClientRect()
      const overButton = pointer && inside(btnRect, pointer)
      updateMood(now, overButton)
      if (current === 'angry' && punchPlanned && now - angrySince > PUNCH_DELAY) {
        punchPlanned = false
        punch()
      }

      // Spot on the button's edge nearest the mouth, a few px inside, for the tongue to touch.
      const touch = {
        x: clamp(mouth.x, btnRect.left + 8, btnRect.right - 8),
        y: clamp(mouth.y, btnRect.top + 8, btnRect.bottom - 8),
      }

      let target
      if (current === 'happy' || current === 'angry') {
        target = mouth // happy: job done; angry: too busy shouting
      } else if (pointer && !coarse) {
        // Limit how far it reaches for the cursor (the email itself is always reachable).
        let grab = pointer
        const dx = pointer.x - mouth.x
        const dy = pointer.y - mouth.y
        const dist = Math.hypot(dx, dy)
        if (dist > MAX_TONGUE) {
          grab = { x: mouth.x + (dx / dist) * MAX_TONGUE, y: mouth.y + (dy / dist) * MAX_TONGUE }
        }
        // Hold the cursor, then drag it all the way to the email, pause, and let go.
        const t = ((now - start) % TUG_PERIOD) / TUG_PERIOD
        target = lerp(grab, touch, pulse(t, 0.4, 0.62, 0.8, 1))
      } else {
        // No cursor (phones, or mouse left the page): lick the email now and then.
        const t = ((now - start) % 3200) / 3200
        target = lerp(mouth, touch, pulse(t, 0, 0.22, 0.42, 0.62))
      }

      tip = tip ? lerp(tip, target, 0.16) : { ...mouth }
      const len = Math.hypot(tip.x - mouth.x, tip.y - mouth.y)

      // Curved tongue: sags a little and wiggles while stretched.
      const mid = lerp(mouth, tip, 0.5)
      const nx = -(tip.y - mouth.y) / (len || 1)
      const ny = (tip.x - mouth.x) / (len || 1)
      const wiggle = Math.sin(now / 110) * Math.min(len * 0.06, 10)
      const sag = Math.min(len * 0.2, 50)
      const cx = mid.x + nx * wiggle
      const cy = mid.y + ny * wiggle + sag

      const visible = len > 6
      tongue.style.opacity = visible ? 1 : 0
      tipEl.style.opacity = visible ? 1 : 0
      for (const path of tongue.children) {
        path.setAttribute('d', `M${mouth.x} ${mouth.y}Q${cx} ${cy} ${tip.x} ${tip.y}`)
      }
      tipEl.setAttribute('cx', tip.x)
      tipEl.setAttribute('cy', tip.y)

      // Squish the button while the tongue is touching it.
      const touching = visible && Math.hypot(tip.x - touch.x, tip.y - touch.y) < 14
      button.classList.toggle('is-licked', touching)

      // Eyes follow the tongue tip, or the cursor once the tongue is in.
      const look = visible ? tip : pointer ?? tip
      const lx = look.x - mouth.x
      const ly = look.y - mouth.y + 40
      const ll = Math.hypot(lx, ly) || 1
      const travel = Math.min(ll / 60, 1) * PUPIL_TRAVEL
      pupilsRef.current?.setAttribute(
        'transform',
        `translate(${(lx / ll) * travel} ${(ly / ll) * travel})`,
      )
    }

    function startLoop() {
      if (raf) return
      lastScrollY = window.scrollY
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
      raf = requestAnimationFrame(frame)
    }
    function stopLoop() {
      cancelAnimationFrame(raf)
      raf = 0
      tip = null
      leavingSince = 0
      setCurrent('normal')
      tongue.style.opacity = 0
      tipEl.style.opacity = 0
      button.classList.remove('is-licked', 'is-broken')
      timers.forEach(clearTimeout)
      timers.clear()
      punchPlanned = false
      scrolledUp = 0
      setPunching(false)
      setNotes(0)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startLoop()
      else stopLoop()
    })
    observer.observe(section)
    return () => {
      observer.disconnect()
      stopLoop()
    }
  }, [buttonId])

  return (
    <>
      {/* Notes over the "broken" email button: the older one fades but stays */}
      {notes > 0 && (
        <div className="broken-notes" aria-hidden="true">
          <p className={`monster-bubble${notes > 1 ? ' is-old' : ''}`}>Please I need this</p>
          {notes > 1 && <p className="monster-bubble">Please please</p>}
        </div>
      )}

      <div className={`monster is-${mood}`} aria-hidden="true">
        <p className="monster-bubble">{bubbles[mood]}</p>
        <MonsterArt mood={mood} punching={punching} pupilsRef={pupilsRef} mouthRef={mouthRef} />

        {createPortal(
          <svg className="tongue-layer" aria-hidden="true">
            <g ref={tongueRef} fill="none" strokeLinecap="round" style={{ opacity: 0 }}>
              <path stroke="#e46f9b" strokeWidth="12" />
              <path stroke="#b84d76" strokeWidth="2" />
            </g>
            <circle ref={tipRef} r="10" fill="#e46f9b" style={{ opacity: 0 }} />
          </svg>,
          document.body,
        )}
      </div>
    </>
  )
}

export default ContactMonster
