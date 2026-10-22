/* ICONOS (SVG propios — sin librerías externas) */
const ICONS = {
  activity: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 14l4-4 3 3 6-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 4h4v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  ecg: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5h3l1.4-4.3 2.1 8 1.6-6.2 1 2.5H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pin: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 18s6-5.9 6-10.6A6 6 0 004 7.4C4 12.1 10 18 10 18z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="10" cy="7.4" r="2.1" stroke="currentColor" stroke-width="1.5"/></svg>`,
  flame: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 2c1 3-2.4 3.7-2.4 6.9 0 .9.4 1.6.9 2-.5-1.3.2-2.3 1-2.9.1 1 .8 1.5 1.5 2.2.9 1 1.4 1.9 1.4 3 0 2.8-2.3 4.8-4.9 4.8s-4.9-2-4.9-4.8c0-3.7 2.7-5 3.5-8.4C6.6 3.2 8 2.3 10 2z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  route: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6.2l4.4-2 5.2 2 4.4-2v11.6l-4.4 2-5.2-2-4.4 2V6.2z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M7.4 4.4v11.4M12.6 6.2v11.4" stroke="currentColor" stroke-width="1.1" stroke-dasharray="1.6 2.2"/></svg>`,
  bp: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.3S5 8.4 5 11.8a5 5 0 0010 0C15 8.4 10 2.3 10 2.3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 9.6v4.2M7.9 11.7h4.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  pill: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="8" width="14" height="6" rx="3" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="8" x2="10" y2="14" stroke="currentColor" stroke-width="1.5"/></svg>`,
  alert: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3.2l7.8 13.6H2.2L10 3.2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="10" y1="8.6" x2="10" y2="12.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="14.7" r="0.9" fill="currentColor"/></svg>`,
  battery: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="14" height="8" rx="2" stroke="currentColor" stroke-width="1.4"/><rect x="16.5" y="9" width="1.7" height="3" rx="0.6" fill="currentColor"/><rect x="4" y="8.5" width="8" height="4" rx="1" fill="currentColor"/></svg>`,
  phone: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.3 3.6c.5-.2 1.1 0 1.4.5l1.2 2c.3.5.2 1.1-.3 1.5l-1.2.9c-.3.3-.4.7-.2 1 1.2 2.4 3.1 4.3 5.5 5.5.4.2.8.1 1-.2l.9-1.2c.4-.5 1-.6 1.5-.3l2 1.2c.5.3.7.9.5 1.4-.5 1.2-1.7 2.1-3 2-3.9-.3-8.2-4.6-8.5-8.5-.1-1.3.8-2.5 2-3z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  message: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 4.5h14a1 1 0 011 1v7.5a1 1 0 01-1 1H8.2l-3.7 2.7v-2.7H3a1 1 0 01-1-1V5.5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  earbuds: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="7" r="2.3" stroke="currentColor" stroke-width="1.4"/><path d="M6 9.3v3.3a2.3 2.3 0 004.6 0v-1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="14" cy="7" r="2.3" stroke="currentColor" stroke-width="1.4"/><path d="M14 9.3v3.3a2.3 2.3 0 01-4.6 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  bluetooth: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5v15M10 2.5l4 3-8 4.5 8 4.5-4 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  shield: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.2l6.6 2.8v4.6c0 4.6-3.2 7-6.6 7.9-3.4-.9-6.6-3.3-6.6-7.9V5l6.6-2.8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M7 9.8l2 2 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  footprints: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="7" cy="6.2" rx="2.5" ry="3.4" stroke="currentColor" stroke-width="1.3"/><ellipse cx="13" cy="13.2" rx="2.5" ry="3.4" stroke="currentColor" stroke-width="1.3"/></svg>`,
  check: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10.3l4 4 8-8.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  watchGlyph: `<svg class="ic" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="5.4" stroke="currentColor" stroke-width="1.4"/><path d="M10 7.2v3l2 1.1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M8.2 3h3.6M8.2 17h3.6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
};

/* ESTADO */
let profile = 'sport';
const deviceId = Math.random().toString(36).slice(2);
const sessionStartTs = Date.now();

const state = {
  sport: {
    streak: 6,
    realStepsActive: false,
    steps: 6482, goal: 10000,
    realRouteActive: false, realKm: 0, realStartTime: null, lastPos: null,
    demoKm: 4.7, demoPace: "5'42\"", demoKcal: 388
  },
  senior: {
    realLocationActive: false, realLat: null, realLng: null,
    fallDetectionActive: false, lastMovementTs: Date.now(), inactivityAlerted: false,
    movementEvents: 0, lastMovementCountTs: 0,
    meds: [
      {name:"Losartán 50mg", time:"08:00", done:true},
      {name:"Metformina 850mg", time:"13:00", done:true},
      {name:"Vitamina D", time:"20:00", done:false},
    ]
  },
  kid: {
    zone: "Zona segura: Colegio", inZone: true,
    realLocationActive: false, realLat: null, realLng: null,
    log: [
      {who:"Mateo", text:"Ya llegué al colegio 👍", time:"07:52", type:"ok"},
      {who:"Mamá", text:"Que tengas buen día ❤️", time:"07:53", type:"info"},
    ]
  }
};

let realBatteryLevel = null;
let pendingFallTimer = null;
let pendingFallCountdown = null;

/* VOZ REAL Y VIBRACIÓN */
function speak(text){
  if(!('speechSynthesis' in window)) return;
  try{
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-ES';
    utter.rate = 1;
    window.speechSynthesis.speak(utter);
  }catch(e){ /* silencioso */ }
}

function vibrateAlert(pattern){
  if(navigator.vibrate){
    try{ navigator.vibrate(pattern || [200,100,200]); }catch(e){}
  }
}

function playAudioAlert(labelText, spokenText, ms=3400){
  const wave = document.getElementById('earWave');
  const label = document.getElementById('earText');
  if(wave) wave.classList.add('active');
  if(label) label.textContent = labelText;
  setTimeout(()=>{
    if(wave) wave.classList.remove('active');
    if(label) label.textContent = 'voz y vibración listas';
  }, ms);
  if(spokenText){ speak(spokenText); vibrateAlert(); }
}

/*BANNER DE ALERTA GLOBAL (con confirmación real) */
let activeAlertContext = null;
let bannerHideTimer = null;

function flashAlertBanner(title, body, opts={}){
  const el = document.getElementById('alertBanner');
  document.getElementById('alertBannerTitle').textContent = title;
  document.getElementById('alertBannerBody').textContent = body;
  const actions = document.getElementById('alertBannerActions');

  el.classList.toggle('tone-ok', opts.tone === 'ok');

  if(opts.confirmable){
    actions.classList.remove('hidden');
    activeAlertContext = opts;
  } else {
    actions.classList.add('hidden');
    activeAlertContext = null;
  }

  el.classList.add('show');
  clearTimeout(bannerHideTimer);
  bannerHideTimer = setTimeout(()=> hideAlertBanner(), opts.ms || 4200);
}

function hideAlertBanner(){
  document.getElementById('alertBanner').classList.remove('show');
}

function confirmImOk(){
  const ctx = activeAlertContext;
  hideAlertBanner();
  activeAlertContext = null;
  toast('check', 'Confirmado', 'Se avisó que estás bien.');
  speak('Gracias por confirmar que estás bien.');
  if(ctx && ctx.onConfirm) ctx.onConfirm();
}

function escalateNow(){
  const ctx = activeAlertContext;
  hideAlertBanner();
  activeAlertContext = null;
  toast('alert', 'Ayuda solicitada', 'Se avisó que necesitas ayuda urgente.');
  speak('Se avisó que necesitas ayuda urgente.');
  if(ctx && ctx.onEscalate) ctx.onEscalate();
}

/* TOASTS */
function toast(iconKey, title, body){
  const wrap = document.getElementById('toast-wrap');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="t-ico">${ICONS[iconKey] || ICONS.check}</span><div><b>${title}</b><span>${body}</span></div>`;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(()=>el.remove(), 300); }, 4200);
}

/* RENDER: DASHBOARD por perfil */
function renderDashboard(){
  const el = document.getElementById('dashboard');

  if(profile === 'sport'){
    const d = state.sport;
    const pct = Math.min(100, Math.round(d.steps/d.goal*100));
    const elapsedMin = d.realStartTime ? (Date.now() - d.realStartTime) / 60000 : 0;
    const realPace = d.realKm > 0.05 && elapsedMin > 0 ? (elapsedMin / d.realKm).toFixed(1) + " min/km" : "calculando…";
    const realKcal = Math.round(d.realKm * 62);
    el.innerHTML = `
      <div class="dash-head">
        <div class="dash-eyebrow">Perfil deportivo</div>
        <div class="dash-title">Actividad de hoy</div>
        <div class="dash-desc">Pasos, distancia y ritmo reales, calculados con los sensores de tu propio teléfono mientras caminas o corres.</div>
      </div>
      <div class="grid">
        <div class="card">
          <div class="card-label">${ICONS.footprints} Pasos ${d.realStepsActive ? '<span class="real-chip">real</span>' : ''}</div>
          <div class="card-value">${d.steps.toLocaleString()}<small>/ ${d.goal.toLocaleString()}</small></div>
          <div class="progress"><div style="width:${pct}%"></div></div>
          <div class="card-foot">${pct}% de la meta diaria</div>
        </div>

        <div class="card">
          <div class="card-label">${ICONS.pin} Distancia ${d.realRouteActive ? '<span class="real-chip">real</span>' : ''}</div>
          <div class="card-value">${d.realRouteActive ? d.realKm.toFixed(2) : d.demoKm}<small>km</small></div>
          <div class="card-foot">${d.realRouteActive ? 'Ritmo real: ' + realPace : 'Ritmo promedio ' + d.demoPace + ' /km (ejemplo)'}</div>
        </div>
        <div class="card">
          <div class="card-label">${ICONS.flame} Calorías</div>
          <div class="card-value">${d.realRouteActive ? realKcal : d.demoKcal}<small>kcal</small></div>
          <div class="card-foot">${d.realRouteActive ? 'Estimado a partir de tu distancia real (no es una medición directa)' : 'Racha activa: ' + d.streak + ' días seguidos (ejemplo)'}</div>
        </div>

        <div class="card wide">
          <div class="card-label">${ICONS.activity} Podómetro real</div>
          <div class="card-foot" style="margin-bottom:10px;">Usa el sensor de movimiento de tu propio teléfono para contar tus pasos de verdad mientras caminas con el celular encima.</div>
          <button class="btn ${d.realStepsActive ? 'danger' : ''}" onclick="toggleRealSteps()">${ICONS.activity} ${d.realStepsActive ? 'Desactivar podómetro real' : 'Activar podómetro real'}</button>
        </div>
        <div class="card wide">
          <div class="card-label">${ICONS.route} Ruta y distancia real (GPS)</div>
          <div class="card-foot" style="margin-bottom:10px;">Calcula tu distancia real sumando tu movimiento por GPS mientras corres o caminas.</div>
          <button class="btn ${d.realRouteActive ? 'danger' : ''}" onclick="toggleRealRoute()">${ICONS.pin} ${d.realRouteActive ? 'Detener seguimiento real' : 'Activar seguimiento real'}</button>
        </div>
      </div>
    `;
  }

  else if(profile === 'senior'){
    const d = state.senior;
    const medsHtml = d.meds.map((m,i)=>`
      <label class="check ${m.done?'done':''}">
        <input type="checkbox" ${m.done?'checked':''} onchange="toggleMed(${i})">
        ${m.name} — ${m.time}
      </label>`).join('');
    el.innerHTML = `
      <div class="dash-head">
        <div class="dash-eyebrow">Perfil adulto mayor</div>
        <div class="dash-title">Salud y bienestar</div>
        <div class="dash-desc">Lo real desde este teléfono: ubicación GPS, detección de caídas e inactividad, actividad detectada y su propia batería. Presión y medicamentos son datos de ejemplo — el teléfono no tiene esos sensores.</div>
      </div>
      <div class="grid">
        <div class="card">
          <div class="card-label">${ICONS.activity} Actividad detectada hoy ${d.fallDetectionActive ? '<span class="real-chip">real</span>' : ''}</div>
          <div class="card-value">${d.movementEvents}<small>movimientos</small></div>
          <div class="card-foot">${d.fallDetectionActive ? 'Cada vez que el teléfono detecta movimiento significativo, suma uno.' : 'Activa la detección real abajo para empezar a contar.'}</div>
        </div>
        <div class="card">
          <div class="card-label">${ICONS.battery} Batería del teléfono ${realBatteryLevel != null ? '<span class="real-chip">real</span>' : ''}</div>
          <div class="card-value">${realBatteryLevel != null ? realBatteryLevel : '—'}<small>${realBatteryLevel != null ? '%' : ''}</small></div>
          <div class="card-foot">${realBatteryLevel != null ? 'Importante para saber si su teléfono sigue con vida.' : 'No disponible en este navegador.'}</div>
        </div>
        <div class="card wide">
          <div class="card-label">${ICONS.pin} Ubicación ${d.realLocationActive ? '<span class="real-chip">real</span>' : ''}</div>
          ${d.realLocationActive && d.realLat != null ? `
            <iframe class="real-map" src="https://www.openstreetmap.org/export/embed.html?bbox=${d.realLng-0.004}%2C${d.realLat-0.003}%2C${d.realLng+0.004}%2C${d.realLat+0.003}&marker=${d.realLat}%2C${d.realLng}"></iframe>
            <div class="card-foot">${d.realLat.toFixed(5)}, ${d.realLng.toFixed(5)}</div>
          ` : `
            <div class="map" style="height:110px; margin-top:8px;">
              <div class="zone" style="left:20%; top:10%; width:90px; height:90px;"></div>
              <div class="pin self" style="left:52%; top:48%;"></div>
            </div>
            <div class="card-foot">Ejemplo — activa el GPS real abajo.</div>
          `}
          <div class="btn-row">
            <button class="btn ghost" onclick="toggleRealLocation('senior')">${ICONS.pin} ${d.realLocationActive ? 'Volver a ubicación de ejemplo' : 'Usar mi ubicación real'}</button>
          </div>
        </div>
        <div class="card wide">
          <div class="card-label">${ICONS.pill} Medicamentos de hoy</div>
          <div class="card-foot" style="margin-top:2px; margin-bottom:6px;">Dato de ejemplo — se llenaría a mano o desde una receta digital.</div>
          <div class="checklist">${medsHtml}</div>
        </div>
        <div class="card wide ${d.fallDetectionActive ? 'status-danger' : ''}">
          <div class="card-label">${ICONS.alert} Detección de caídas e inactividad ${d.fallDetectionActive ? '<span class="real-chip">real</span>' : ''}</div>
          <div class="card-foot" style="margin-top:6px; margin-bottom:10px; font-size:12.5px;">
            Con el sensor de movimiento del teléfono: un golpe fuerte dispara la alerta de caída, y si el teléfono pasa mucho tiempo sin moverse, también avisa (aquí bajamos el tiempo a segundos para poder demostrarlo en vivo — en un producto real serían horas).
            ${d.fallDetectionActive ? `<br><br><b>Última vez que se movió:</b> hace ${Math.max(0, Math.round((Date.now()-d.lastMovementTs)/1000))} segundos.` : ''}
          </div>
          <div class="btn-row">
            <button class="btn ${d.fallDetectionActive ? 'danger' : ''}" onclick="toggleFallDetection()">${ICONS.alert} ${d.fallDetectionActive ? 'Desactivar detección real' : 'Activar detección real'}</button>
            <button class="btn ghost" onclick="startFallConfirmation(true)">Simular caída (demo)</button>
          </div>
        </div>
      </div>
    `;
  }

  else if(profile === 'kid'){
    const d = state.kid;
    const logHtml = d.log.map(m=>`
      <div class="list-item">
        <div class="li-left"><span class="chip ${m.type}">${m.who}</span> ${m.text}</div>
        <div class="li-time">${m.time}</div>
      </div>`).reverse().join('');
    el.innerHTML = `
      <div class="dash-head">
        <div class="dash-eyebrow">Perfil niño</div>
        <div class="dash-title">Ubicación y comunicación</div>
        <div class="dash-desc">Ubicación real desde el teléfono del niño, mensajes y alertas que se dicen en voz alta y vibran — y si conectas el mismo código de familia en el teléfono del tutor, todo llega ahí también en vivo.</div>
      </div>
      <div class="grid">
        <div class="card wide">
          <div class="card-label">${ICONS.shield} Ubicación en vivo ${d.realLocationActive ? '<span class="real-chip">real</span>' : `— ${d.inZone? 'dentro de zona segura (ejemplo)':'fuera de zona segura (ejemplo)'}`}</div>
          ${d.realLocationActive && d.realLat != null ? `
            <iframe class="real-map" src="https://www.openstreetmap.org/export/embed.html?bbox=${d.realLng-0.004}%2C${d.realLat-0.003}%2C${d.realLng+0.004}%2C${d.realLat+0.003}&marker=${d.realLat}%2C${d.realLng}"></iframe>
            <div class="card-foot">${d.realLat.toFixed(5)}, ${d.realLng.toFixed(5)}</div>
          ` : `
            <div class="map" style="margin-top:8px;">
              <div class="zone" style="left:22%; top:14%;"></div>
              <div class="pin" id="kidPin" style="left:46%; top:44%;"></div>
              <div class="label" style="left:24%; top:18%;">${d.zone}</div>
            </div>
          `}
          <div class="btn-row">
            <button class="btn ghost" onclick="toggleRealLocation('kid')">${ICONS.pin} ${d.realLocationActive ? 'Volver a ubicación de ejemplo' : 'Usar mi ubicación real'}</button>
          </div>
        </div>
        <div class="card">
          <div class="card-label">${ICONS.battery} Batería del teléfono ${realBatteryLevel != null ? '<span class="real-chip">real</span>' : ''}</div>
          <div class="card-value">${realBatteryLevel != null ? realBatteryLevel : '—'}<small>${realBatteryLevel != null ? '%' : ''}</small></div>
          <div class="card-foot">${realBatteryLevel != null ? '' : 'No disponible en este navegador.'}</div>
        </div>
        <div class="card">
          <div class="card-label">${ICONS.phone} Llamada rápida</div>
          <div class="card-foot" style="margin-bottom:10px;">Simula el aviso de llamada por voz y vibración.</div>
          <button class="btn" onclick="simulateCall()">${ICONS.phone} Llamar ahora</button>
        </div>
        <div class="card wide status-warn">
          <div class="card-label">${ICONS.alert} Botón de emergencia</div>
          <div class="card-foot" style="margin-bottom:10px;">Envía una alerta que se dice en voz alta y vibra en el teléfono del niño (si está sincronizado con el mismo código de familia).</div>
          <button class="btn danger" onclick="sendChildAlert()">${ICONS.alert} Enviar alerta "¿Estás bien?"</button>
        </div>
        <div class="card wide">
          <div class="card-label">${ICONS.message} Mensajes</div>
          <div class="msg-compose">
            <input type="text" id="msgInput" placeholder="Escribe un mensaje para Mateo…" onkeydown="if(event.key==='Enter') sendKidMessage()">
            <button class="btn ghost" onclick="sendKidMessage()">Enviar</button>
          </div>
          <div class="quick-replies">
            <button class="chip-btn" onclick="sendQuickReply('¿Dónde estás?')">¿Dónde estás?</button>
            <button class="chip-btn" onclick="sendQuickReply('Te quiero, nos vemos pronto')">Te quiero, nos vemos pronto</button>
            <button class="chip-btn" onclick="sendQuickReply('Hora de volver a casa')">Hora de volver a casa</button>
          </div>
          <div class="list" id="kidLog">${logHtml}</div>
        </div>
      </div>
    `;
  }
}

/* ACCIONES GENERALES */
function setProfile(p){
  profile = p;
  document.querySelectorAll('.profile-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.profile === p);
  });
  renderDashboard();
}

function toggleMed(i){
  state.senior.meds[i].done = !state.senior.meds[i].done;
  renderDashboard();
}

function simulateCall(){
  playAudioAlert('llamando…', 'Llamada entrante de mamá', 3200);
  toast('phone', 'Llamando a Mateo', 'El aviso se dice en voz alta aunque no esté mirando la pantalla.');
}

function sendChildAlert(){
  playAudioAlert('enviando alerta…', null, 1200);
  toast('alert', 'Alerta enviada', familyCode ? 'Se avisó por voz y vibración en el teléfono de Mateo.' : 'Conecta el código de familia para que llegue al teléfono real de Mateo.');
  addKidLog('Mamá', '¿Estás bien? Responde por favor', 'warn');
  sendFamilyEvent('child_alert', '¿Estás bien? Tus papás preguntan por ti.', 'warn');
  if(!(db && familyCode)){
    flashAlertBanner('¿Estás bien?', 'Tus papás preguntan por ti.', {
      confirmable: true,
      ms: 15000,
      onConfirm: ()=> addKidLog('Mateo', 'Sí, estoy bien 👍', 'ok'),
      onEscalate: ()=> addKidLog('Mateo', 'Necesito ayuda 🆘', 'warn')
    });
    speak('¿Estás bien? Tus papás preguntan por ti.');
    vibrateAlert();
  }
}

function sendQuickReply(text){
  playAudioAlert('mensaje nuevo…', text, 2600);
  addKidLog('Mamá', text, 'info');
  toast('message', 'Mensaje enviado', 'Se dice en voz alta en el teléfono de Mateo.');
}

function sendKidMessage(){
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if(!text) return;
  playAudioAlert('mensaje nuevo…', text, 2600);
  addKidLog('Mamá', text, 'info');
  toast('message', 'Mensaje enviado', 'Se dice en voz alta en el teléfono de Mateo.');
  input.value = '';
}

function addKidLog(who, text, type){
  const now = new Date();
  const time = now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  const entry = {who, text, time, type, ts: Date.now()};
  if(db && familyCode){
    db.collection('families').doc(familyCode).collection('messages').add(entry).catch((err)=>{
      toast('alert', 'No se pudo enviar', err.message || 'Revisa tu conexión o la configuración de Firebase.');
    });
  } else {
    state.kid.log.push(entry);
    renderDashboard();
  }
}

/*PODÓMETRO REAL (acelerómetro del teléfono) */
let stepDetector = { lastMagnitude: 0, lastPeakTime: 0, threshold: 1.15 };

function handleStepMotion(event){
  const acc = event.accelerationIncludingGravity || event.acceleration;
  if(!acc || acc.x === null) return;
  const magnitude = Math.sqrt((acc.x||0)**2 + (acc.y||0)**2 + (acc.z||0)**2);
  const now = Date.now();
  if(magnitude - stepDetector.lastMagnitude > stepDetector.threshold && (now - stepDetector.lastPeakTime) > 300){
    stepDetector.lastPeakTime = now;
    state.sport.steps += 1;
    persistSteps();
    if(profile === 'sport') renderDashboard();
  }
  stepDetector.lastMagnitude = magnitude;
}

async function requestMotionPermission(){
  if(typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function'){
    try{
      const res = await DeviceMotionEvent.requestPermission();
      return res === 'granted';
    }catch(e){
      return false;
    }
  }
  if(typeof DeviceMotionEvent === 'undefined') return false;
  return true;
}

async function toggleRealSteps(){
  if(state.sport.realStepsActive){
    window.removeEventListener('devicemotion', handleStepMotion);
    state.sport.realStepsActive = false;
    toast('check', 'Podómetro real desactivado', 'Los pasos vuelven a ser de ejemplo.');
    renderDashboard();
    return;
  }
  const ok = await requestMotionPermission();
  if(!ok){
    toast('alert', 'Sensor no disponible', 'No se pudo obtener permiso del sensor de movimiento en este navegador.');
    return;
  }
  stepDetector = { lastMagnitude: 0, lastPeakTime: 0, threshold: 1.15 };
  window.addEventListener('devicemotion', handleStepMotion);
  state.sport.realStepsActive = true;
  toast('activity', 'Podómetro real activado', 'Camina con el teléfono en la mano o el bolsillo — cada paso real suma ahora.');
  renderDashboard();
}

/*DETECCIÓN DE CAÍDAS REAL (acelerómetro del teléfono)*/
let fallDetector = { lastTrigger: 0, threshold: 26 };

function handleFallMotion(event){
  const acc = event.accelerationIncludingGravity || event.acceleration;
  if(!acc || acc.x === null) return;
  const magnitude = Math.sqrt((acc.x||0)**2 + (acc.y||0)**2 + (acc.z||0)**2);
  const now = Date.now();

  if(Math.abs(magnitude - 9.8) > 1.2){
    state.senior.lastMovementTs = now;
    state.senior.inactivityAlerted = false;
  }

  if(magnitude > fallDetector.threshold && (now - fallDetector.lastTrigger) > 4000){
    fallDetector.lastTrigger = now;
    startFallConfirmation(false);
  }
}

const INACTIVITY_LIMIT_MS = 60 * 1000;

function checkInactivity(){
  const d = state.senior;
  if(!d.fallDetectionActive || d.inactivityAlerted) return;
  if(Date.now() - d.lastMovementTs > INACTIVITY_LIMIT_MS){
    d.inactivityAlerted = true;
    flashAlertBanner('Sin movimiento', 'El teléfono lleva un buen rato sin moverse.');
    speak('No se ha detectado movimiento en un buen rato. ¿Todo bien?');
    vibrateAlert([200,100,200]);
    toast('alert', 'Inactividad prolongada detectada', 'Se avisó a la familia si está sincronizada.');
    sendFamilyEvent('fall', 'El teléfono del adulto mayor lleva un buen rato sin moverse. Revisa cómo está.', 'warn');
  }
}

async function toggleFallDetection(){
  if(state.senior.fallDetectionActive){
    window.removeEventListener('devicemotion', handleFallMotion);
    state.senior.fallDetectionActive = false;
    toast('check', 'Detección de caídas desactivada', '');
    renderDashboard();
    return;
  }
  const ok = await requestMotionPermission();
  if(!ok){
    toast('alert', 'Sensor no disponible', 'No se pudo obtener permiso del sensor de movimiento en este navegador.');
    return;
  }
  fallDetector = { lastTrigger: 0, threshold: 26 };
  state.senior.lastMovementTs = Date.now();
  state.senior.inactivityAlerted = false;
  window.addEventListener('devicemotion', handleFallMotion);
  state.senior.fallDetectionActive = true;
  toast('activity', 'Detección de caídas activada', 'Un golpe fuerte o caída del teléfono disparará la alerta automáticamente.');
  renderDashboard();
}

function startFallConfirmation(manual){
  flashAlertBanner('¿Estás bien?', 'Se detectó una posible caída.', {
    confirmable: true,
    ms: 15000,
    onConfirm: ()=> sendFamilyEvent('confirm_ok', 'El adulto mayor confirmó que está bien después de la alerta de caída.', 'ok'),
    onEscalate: ()=> sendFamilyEvent('help_needed', 'El adulto mayor pidió ayuda urgente después de una caída.', 'danger')
  });
  speak('Se detectó una posible caída. ¿Estás bien?');
  vibrateAlert([300,120,300,120,300]);
  toast('alert', 'Posible caída detectada', manual ? 'Simulación de demo.' : 'Detectado por el sensor de movimiento real.');
  sendFamilyEvent('fall', 'Posible caída detectada en el teléfono del adulto mayor. Revisa su ubicación.', 'danger');
  state.senior.lastMovementTs = Date.now();
  state.senior.inactivityAlerted = false;
}

/*RUTA Y DISTANCIA REAL (GPS) — perfil deportivo */
let sportGeoWatcher = null;

function haversineKm(lat1, lng1, lat2, lng2){
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLng = (lng2-lng1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function toggleRealRoute(){
  const d = state.sport;
  if(d.realRouteActive){
    if(sportGeoWatcher !== null){ navigator.geolocation.clearWatch(sportGeoWatcher); sportGeoWatcher = null; }
    d.realRouteActive = false;
    toast('check', 'Seguimiento real detenido', 'La distancia vuelve a ser de ejemplo.');
    renderDashboard();
    return;
  }
  if(!navigator.geolocation){
    toast('alert', 'GPS no disponible', 'Este navegador no soporta geolocalización.');
    return;
  }
  d.realKm = 0;
  d.lastPos = null;
  d.realStartTime = Date.now();
  d.realRouteActive = true;
  sportGeoWatcher = navigator.geolocation.watchPosition((pos)=>{
    const { latitude, longitude } = pos.coords;
    if(d.lastPos){
      const delta = haversineKm(d.lastPos.lat, d.lastPos.lng, latitude, longitude);
      if(delta < 0.3){ d.realKm += delta; }
    }
    d.lastPos = { lat: latitude, lng: longitude };
    if(profile === 'sport') renderDashboard();
  }, (err)=>{
    toast('alert', 'No se pudo obtener tu ubicación', err.message || 'Revisa el permiso de ubicación.');
  }, { enableHighAccuracy: true, maximumAge: 3000 });
  toast('activity', 'Seguimiento real activado', 'Sal a correr o caminar — tu distancia se calcula con GPS real.');
  renderDashboard();
}

/* UBICACIÓN REAL (GPS del teléfono) */
const geoWatchers = { kid: null, senior: null };

function toggleRealLocation(kind){
  const d = state[kind];
  if(d.realLocationActive){
    if(geoWatchers[kind] !== null){ navigator.geolocation.clearWatch(geoWatchers[kind]); geoWatchers[kind] = null; }
    d.realLocationActive = false;
    toast('check', 'Ubicación real desactivada', 'Volviendo al mapa de ejemplo.');
    renderDashboard();
    return;
  }
  if(!navigator.geolocation){
    toast('alert', 'GPS no disponible', 'Este navegador no soporta geolocalización.');
    return;
  }
  geoWatchers[kind] = navigator.geolocation.watchPosition((pos)=>{
    d.realLat = pos.coords.latitude;
    d.realLng = pos.coords.longitude;
    d.realLocationActive = true;
    if(profile === kind) renderDashboard();
    if(db && familyCode){
      db.collection('families').doc(familyCode).collection('locations').doc(kind).set({
        lat: d.realLat, lng: d.realLng, updatedAt: Date.now()
      }).catch(()=>{});
    }
  }, (err)=>{
    toast('alert', 'No se pudo obtener tu ubicación', err.message || 'Revisa que el permiso de ubicación esté activo.');
  }, { enableHighAccuracy: true, maximumAge: 5000 });
}

/* SINCRONIZACIÓN FAMILIAR (Firebase, opcional) */
let db = null;
let familyCode = null;
let unsubscribeMessages = null;
let unsubscribeEvents = null;
let unsubscribeKidLoc = null;
let unsubscribeSeniorLoc = null;

function initFirebase(){
  if(typeof firebaseConfig === 'undefined' || !firebaseConfig.apiKey || firebaseConfig.apiKey.indexOf('TU_') === 0){
    return false;
  }
  try{
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    const saved = localStorage.getItem('biosync_family_code');
    if(saved){ familyCode = saved; subscribeFamily(); }
    updateFamilyBar();
    return true;
  }catch(e){
    console.error('Firebase no se pudo inicializar', e);
    return false;
  }
}

function joinFamily(){
  if(!db){
    toast('alert', 'Sincronización no configurada', 'Configura firebase-config.js (ver README, sección Firebase) para sincronizar entre dos teléfonos.');
    return;
  }
  const code = prompt('Código de familia (invéntalo e ingresa el mismo en el otro teléfono, ej: garcia2024):', familyCode || '');
  if(!code) return;
  familyCode = code.trim().toLowerCase().replace(/\s+/g, '-');
  localStorage.setItem('biosync_family_code', familyCode);
  subscribeFamily();
  updateFamilyBar();
  toast('check', 'Conectado a la familia', `Código: ${familyCode}`);
}

function subscribeFamily(){
  if(!db || !familyCode) return;

  if(unsubscribeMessages) unsubscribeMessages();
  unsubscribeMessages = db.collection('families').doc(familyCode).collection('messages')
    .orderBy('ts', 'asc')
    .onSnapshot((snap)=>{
      state.kid.log = snap.docs.map(doc => doc.data());
      if(profile === 'kid') renderDashboard();
    });

  if(unsubscribeEvents) unsubscribeEvents();
  unsubscribeEvents = db.collection('families').doc(familyCode).collection('events')
    .orderBy('ts', 'asc')
    .onSnapshot((snap)=>{
      snap.docChanges().forEach((change)=>{
        if(change.type !== 'added') return;
        const ev = change.doc.data();
        if(ev.origin === deviceId) return;
        if(ev.ts < sessionStartTs) return;

        if(ev.type === 'confirm_ok'){
          flashAlertBanner('Todo bien', ev.message, { tone: 'ok', ms: 5000 });
          speak(ev.message);
          return;
        }
        if(ev.type === 'help_needed'){
          flashAlertBanner('Necesita ayuda urgente', ev.message, { ms: 10000 });
          speak(ev.message);
          vibrateAlert([300,100,300,100,300,100,300]);
          return;
        }

        const confirmable = ev.type === 'fall' || ev.type === 'child_alert';
        const title = '¿Estás bien?';
        flashAlertBanner(title, ev.message, {
          confirmable,
          ms: confirmable ? 15000 : 4200,
          onConfirm: confirmable ? ()=> sendFamilyEvent('confirm_ok', 'Confirmó que está bien.', 'ok') : undefined,
          onEscalate: confirmable ? ()=> sendFamilyEvent('help_needed', 'Pidió ayuda urgente.', 'danger') : undefined
        });
        speak(ev.message);
        vibrateAlert(ev.severity === 'danger' ? [300,120,300,120,300] : [200]);
      });
    });

  if(unsubscribeKidLoc) unsubscribeKidLoc();
  unsubscribeKidLoc = db.collection('families').doc(familyCode).collection('locations').doc('kid')
    .onSnapshot((doc)=>{
      if(!doc.exists) return;
      const data = doc.data();
      state.kid.realLat = data.lat;
      state.kid.realLng = data.lng;
      state.kid.realLocationActive = true;
      if(profile === 'kid') renderDashboard();
    });

  if(unsubscribeSeniorLoc) unsubscribeSeniorLoc();
  unsubscribeSeniorLoc = db.collection('families').doc(familyCode).collection('locations').doc('senior')
    .onSnapshot((doc)=>{
      if(!doc.exists) return;
      const data = doc.data();
      state.senior.realLat = data.lat;
      state.senior.realLng = data.lng;
      state.senior.realLocationActive = true;
      if(profile === 'senior') renderDashboard();
    });
}

function sendFamilyEvent(type, message, severity){
  if(!db || !familyCode) return;
  db.collection('families').doc(familyCode).collection('events').add({
    type, message, ts: Date.now(), origin: deviceId, severity: severity || 'warn'
  }).catch(()=>{});
}

function updateFamilyBar(){
  const bar = document.getElementById('familyBar');
  const txt = document.getElementById('familyStatusText');
  if(!bar || !txt) return;
  if(db && familyCode){
    txt.innerHTML = `Sincronizado en vivo con el código <b>${familyCode}</b>`;
  } else if(db){
    txt.textContent = 'Sin sincronizar con otro teléfono';
  } else {
    txt.textContent = 'Sincronización no configurada (ver README)';
  }
}

/* PASOS DEL DÍA */
function todayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function initDailySteps(){
  const today = todayKey();
  const savedDay = localStorage.getItem('biosync_steps_day');
  if(savedDay === today){
    const saved = localStorage.getItem('biosync_steps_count');
    state.sport.steps = saved !== null ? parseInt(saved, 10) : 0;
  } else {
    state.sport.steps = 0;
    localStorage.setItem('biosync_steps_day', today);
    localStorage.setItem('biosync_steps_count', '0');
  }
}

function persistSteps(){
  localStorage.setItem('biosync_steps_day', todayKey());
  localStorage.setItem('biosync_steps_count', String(state.sport.steps));
}

function checkDayRollover(){
  const today = todayKey();
  if(localStorage.getItem('biosync_steps_day') !== today){
    state.sport.steps = 0;
    localStorage.setItem('biosync_steps_day', today);
    localStorage.setItem('biosync_steps_count', '0');
    if(profile === 'sport') renderDashboard();
  }
}

/* SIMULACIÓN DE DATOS DE EJEMPLO */
setInterval(()=>{
  checkDayRollover();
  checkInactivity();
  if(state.senior.fallDetectionActive && profile === 'senior'){
    renderDashboard();
  }
}, 2600);

/* BATERÍA REAL DEL TELÉFONO (mejor esfuerzo — Chrome/Android) */
async function initBatteryMonitor(){
  if(!navigator.getBattery) return;
  try{
    const batt = await navigator.getBattery();
    realBatteryLevel = Math.round(batt.level * 100);
    batt.addEventListener('levelchange', ()=>{
      realBatteryLevel = Math.round(batt.level * 100);
      if(profile === 'kid' || profile === 'senior') renderDashboard();
    });
    if(profile === 'kid' || profile === 'senior') renderDashboard();
  }catch(e){ /* no disponible en este navegador, se queda en null */ }
}

/* INIT */
initFirebase();
initBatteryMonitor();
initDailySteps();
renderDashboard();

/* Llenar iconos */
document.getElementById('icoAppPill').innerHTML = ICONS.shield;
document.getElementById('icoSportBtn').innerHTML = ICONS.activity;
document.getElementById('icoSeniorBtn').innerHTML = ICONS.ecg;
document.getElementById('icoKidBtn').innerHTML = ICONS.shield;
document.getElementById('icoAudioBar').innerHTML = ICONS.earbuds;
document.getElementById('icoFamilyBar').innerHTML = ICONS.shield;
document.getElementById('icoAlertBanner').innerHTML = ICONS.alert;

/* Service Worker */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('service-worker.js').catch(()=>{});
  });
}