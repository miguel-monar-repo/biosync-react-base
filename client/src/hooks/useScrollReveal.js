import { useEffect } from 'react'

// Hace aparecer suavemente los elementos con el atributo `data-reveal` cuando entran en pantalla.
// Uso: const ref = useRef(null); useScrollReveal(ref); <div ref={ref}> ... <div data-reveal> ...
// Forma de aparecer: data-reveal (sube), data-reveal="izquierda", "derecha" o "pop" (crece con rebote).
// Para que aparezcan uno tras otro: style={{ '--reveal-delay': '120ms' }} en cada elemento.
//
// Los elementos solo se ocultan después de que este hook marca el contenedor con `reveal-ready`
// (ver styles/animations.css): si el JavaScript falla, el contenido se ve igual.
export function useScrollReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const items = root.querySelectorAll('[data-reveal]')

    // Navegadores sin IntersectionObserver: se muestra todo sin animación
    if (!('IntersectionObserver' in window)) return

    root.classList.add('reveal-ready')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target) // cada elemento aparece una sola vez
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    items.forEach((item) => observer.observe(item))

    return () => {
      observer.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [rootRef])
}
