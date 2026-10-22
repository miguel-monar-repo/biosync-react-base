import './Icon.css'

// Iconos SVG propios de la demo (los mismos del prototipo, pero en JSX en vez de strings).
// Uso: <Icon name="pin" />
const ICONS = {
  activity: (
    <>
      <path d="M4 14l4-4 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 4h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  ecg: (
    <path d="M2 10.5h3l1.4-4.3 2.1 8 1.6-6.2 1 2.5H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  pin: (
    <>
      <path d="M10 18s6-5.9 6-10.6A6 6 0 004 7.4C4 12.1 10 18 10 18z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="7.4" r="2.1" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  flame: (
    <path d="M10 2c1 3-2.4 3.7-2.4 6.9 0 .9.4 1.6.9 2-.5-1.3.2-2.3 1-2.9.1 1 .8 1.5 1.5 2.2.9 1 1.4 1.9 1.4 3 0 2.8-2.3 4.8-4.9 4.8s-4.9-2-4.9-4.8c0-3.7 2.7-5 3.5-8.4C6.6 3.2 8 2.3 10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  ),
  route: (
    <>
      <path d="M3 6.2l4.4-2 5.2 2 4.4-2v11.6l-4.4 2-5.2-2-4.4 2V6.2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7.4 4.4v11.4M12.6 6.2v11.4" stroke="currentColor" strokeWidth="1.1" strokeDasharray="1.6 2.2" />
    </>
  ),
  bp: (
    <>
      <path d="M10 2.3S5 8.4 5 11.8a5 5 0 0010 0C15 8.4 10 2.3 10 2.3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 9.6v4.2M7.9 11.7h4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  pill: (
    <>
      <rect x="3" y="8" width="14" height="6" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10" y1="8" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  alert: (
    <>
      <path d="M10 3.2l7.8 13.6H2.2L10 3.2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="10" y1="8.6" x2="10" y2="12.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.7" r="0.9" fill="currentColor" />
    </>
  ),
  battery: (
    <>
      <rect x="2" y="6.5" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="16.5" y="9" width="1.7" height="3" rx="0.6" fill="currentColor" />
      <rect x="4" y="8.5" width="8" height="4" rx="1" fill="currentColor" />
    </>
  ),
  phone: (
    <path d="M4.3 3.6c.5-.2 1.1 0 1.4.5l1.2 2c.3.5.2 1.1-.3 1.5l-1.2.9c-.3.3-.4.7-.2 1 1.2 2.4 3.1 4.3 5.5 5.5.4.2.8.1 1-.2l.9-1.2c.4-.5 1-.6 1.5-.3l2 1.2c.5.3.7.9.5 1.4-.5 1.2-1.7 2.1-3 2-3.9-.3-8.2-4.6-8.5-8.5-.1-1.3.8-2.5 2-3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  ),
  message: (
    <path d="M3 4.5h14a1 1 0 011 1v7.5a1 1 0 01-1 1H8.2l-3.7 2.7v-2.7H3a1 1 0 01-1-1V5.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  ),
  earbuds: (
    <>
      <circle cx="6" cy="7" r="2.3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 9.3v3.3a2.3 2.3 0 004.6 0v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="7" r="2.3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14 9.3v3.3a2.3 2.3 0 01-4.6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  bluetooth: (
    <path d="M10 2.5v15M10 2.5l4 3-8 4.5 8 4.5-4 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  shield: (
    <>
      <path d="M10 2.2l6.6 2.8v4.6c0 4.6-3.2 7-6.6 7.9-3.4-.9-6.6-3.3-6.6-7.9V5l6.6-2.8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 9.8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  footprints: (
    <>
      <ellipse cx="7" cy="6.2" rx="2.5" ry="3.4" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="13" cy="13.2" rx="2.5" ry="3.4" stroke="currentColor" strokeWidth="1.3" />
    </>
  ),
  check: (
    <path d="M4 10.3l4 4 8-8.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  watchGlyph: (
    <>
      <circle cx="10" cy="10" r="5.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 7.2v3l2 1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8.2 3h3.6M8.2 17h3.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
}

function Icon({ name }) {
  return (
    <svg className="ic" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {ICONS[name] || ICONS.check}
    </svg>
  )
}

export default Icon
