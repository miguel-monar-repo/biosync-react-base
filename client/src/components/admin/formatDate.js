// Fecha y hora legibles para el panel, por ejemplo "16 nov 2026, 12:30"
export function formatDate(iso) {
  return iso ? new Date(iso).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' }) : ''
}
