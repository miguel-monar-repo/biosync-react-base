// Voz y vibración del teléfono. Si el navegador no las soporta, no hacen nada.

export function speak(text) {
  if (!('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'es-ES'
    utter.rate = 1
    window.speechSynthesis.speak(utter)
  } catch {
    // silencioso
  }
}

export function vibrate(pattern = [200, 100, 200]) {
  if (!navigator.vibrate) return
  try {
    navigator.vibrate(pattern)
  } catch {
    // silencioso
  }
}
