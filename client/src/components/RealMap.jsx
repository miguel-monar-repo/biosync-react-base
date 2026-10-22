// Mapa real de OpenStreetMap centrado en una coordenada
function RealMap({ lat, lng }) {
  const bbox = `${lng - 0.004}%2C${lat - 0.003}%2C${lng + 0.004}%2C${lat + 0.003}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${lat}%2C${lng}`
  return (
    <>
      <iframe className="real-map" src={src} title="Mapa con la ubicación real"></iframe>
      <div className="card-foot">
        {lat.toFixed(5)}, {lng.toFixed(5)}
      </div>
    </>
  )
}

export default RealMap
