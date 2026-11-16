// Preguntas al asistente virtual (ruta pública, no necesita sesión)
import { apiRequest } from './api.js'

// mensajes: [{ role: 'user' | 'assistant', content }], terminando en una pregunta del usuario.
// Devuelve el texto de la respuesta.
export async function askAssistant(mensajes) {
  const { respuesta } = await apiRequest('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ mensajes }),
  })
  return respuesta
}
