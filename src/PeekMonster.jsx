import { useEffect, useState } from 'react'
import { MonsterArt } from './ContactMonster.jsx'

// What the monster says when it peeks up in each section.
const lines = {
  about: 'Psst! Charles has shipped 3 projects, and one is used by 60 people.',
  projects: 'Charles builds real apps. Take a peek!',
  awards: "Dean's Lister AND a hackathon podium? Impressive!",
  education: 'Always learning. Graduating in 2027!',
  skills: 'And Charles keeps picking up new skills!',
}

const SHOW_FOR = 4500 // ms the monster stays up
const DELAY = 600 // ms in a section before it rises
const LEAVE_ANIMATION = 450 // ms, matches .peek.is-leaving in App.css

// Rises from the bottom edge of the window once per section with a short line,
// then ducks back down. Hides when Contact (with its own monster) is on screen.
function PeekMonster() {
  const [peek, setPeek] = useState(null) // { text, leaving }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const shown = new Set()
    const timers = new Set()
    let current = null
    let active = false
    let hiding = false
    let contactOnScreen = false

    function later(fn, ms) {
      const id = setTimeout(() => {
        timers.delete(id)
        fn()
      }, ms)
      timers.add(id)
    }

    function show(id) {
      if (current !== id || active || shown.has(id) || contactOnScreen) return
      // Wait for the Projects magnifying glass to finish first.
      if (document.querySelector('.zoom-overlay')) return later(() => show(id), DELAY)
      shown.add(id)
      active = true
      hiding = false
      setPeek({ text: lines[id], leaving: false })
      later(hide, SHOW_FOR)
    }

    function hide() {
      if (!active || hiding) return
      hiding = true
      setPeek((p) => p && { ...p, leaving: true })
      later(() => {
        active = false
        hiding = false
        setPeek(null)
      }, LEAVE_ANIMATION)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          current = id
          if (id === 'contact') hide()
          else later(() => show(id), DELAY)
        }
      },
      { rootMargin: '-40% 0px -40% 0px' },
    )
    for (const id of [...Object.keys(lines), 'contact']) {
      observer.observe(document.getElementById(id))
    }

    // Never peek while any part of Contact (and its own monster) is on screen.
    const contactObserver = new IntersectionObserver(([entry]) => {
      contactOnScreen = entry.isIntersecting
      if (contactOnScreen) hide()
    })
    contactObserver.observe(document.getElementById('contact'))

    return () => {
      observer.disconnect()
      contactObserver.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])

  if (!peek) return null

  return (
    <div className={`peek${peek.leaving ? ' is-leaving' : ''}`} aria-hidden="true">
      <p className="monster-bubble peek-bubble">{peek.text}</p>
      <div className="peek-body">
        <MonsterArt pupilOffset="translate(-3 -3)" />
      </div>
    </div>
  )
}

export default PeekMonster
