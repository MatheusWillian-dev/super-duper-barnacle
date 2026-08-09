/* script.js
   Atualizado conforme suas últimas solicitações:
   - substitui "Quanto você me ama" por "Escolha a trilha sonora / humor da noite"
   - substitui o toque-e-segure por uma frase filosófica e poética romântica (visível)
   - troca a pergunta do quiz para "Qual é a nossa música favorita?"
   - mantém todas as funcionalidades anteriores: corações flutuantes, burst ao toque, plano comer/encontrar, Maps + WhatsApp, horário sugerido 19:00, timeline, quiz, botão NÃO travesso, confirmação SIM
   - comentários explicam onde editar textos e comportamentos
*/

(function () {
  /* ---------- Configurações editáveis ---------- */
  const MAX_HEARTS = 18;
  const HEART_SPAWN_INTERVAL = 900;
  const BURST_COUNT = 12;
  const NO_BTN_MOVE_DISTANCE = 140;
  const NO_BTN_PROXIMITY = 84;

  /* ---------- Elementos do DOM ---------- */
  const heartsContainer = document.getElementById('floating-hearts');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const confirm = document.getElementById('confirm');
  const closeConfirm = document.getElementById('closeConfirm');

  const planBtns = document.querySelectorAll('.plan-btn');
  const locationArea = document.getElementById('locationArea');
  const locationInput = document.getElementById('locationInput');
  const locationSuggestions = document.getElementById('locationSuggestions');
  const openMapsBtn = document.getElementById('openMapsBtn');
  const sendWhatsBtn = document.getElementById('sendWhatsBtn');
  const meetArea = document.getElementById('meetArea');
  const sendMeetWhatsBtn = document.getElementById('sendMeetWhatsBtn');

  const timeInput = document.getElementById('timeInput');
  const quickTimes = document.querySelectorAll('.quick-time');

  const addMemoryBtn = document.getElementById('addMemoryBtn');
  const timelineList = document.getElementById('timelineList');

  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizResult = document.getElementById('quizResult');

  const loveRange = document.getElementById('loveRange'); // agora controla "humor da noite"
  const soundLabel = document.getElementById('soundLabel');

  /* ---------- Estado ---------- */
  let hearts = [];
  let spawnTimer = null;
  let lastTouchTime = 0;
  let quizIndex = 0;
  let spawnStarted = false;

  /* ---------- Utilitários ---------- */
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function escapeHtml(str) { return String(str).replace(/[&<>"']/g, function (m) { return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]; }); }

  /* ---------- Floating hearts (contínuos) ---------- */
  function createFloatingHeart(opts = {}) {
    if (hearts.length >= MAX_HEARTS) return null;
    const el = document.createElement('div');
    el.className = 'heart';
    const size = opts.size || Math.round(rand(18, 40));
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.opacity = (opts.opacity || rand(0.45, 0.95)).toFixed(2);
    const vw = Math.max(document.documentElement.clientWidth || 360, 360);
    const startX = rand(6, vw - size - 6);
    el.style.left = startX + 'px';
    el.style.bottom = (opts.bottom || -40) + 'px';
    const sway = Math.round(rand(-40, 40));
    const rot = Math.round(rand(-25, 25));
    el.style.setProperty('--sway', sway + 'px');
    el.style.setProperty('--rot', rot + 'deg');
    const duration = rand(4200, 9000);
    const delay = rand(0, 800);
    el.style.animation = `floatUp ${duration}ms linear ${delay}ms forwards`;
    el.style.pointerEvents = 'none';
    const removeAfter = duration + delay + 200;
    const timeoutId = setTimeout(() => {
      el.remove();
      hearts = hearts.filter(h => h.el !== el);
    }, removeAfter);
    hearts.push({ el, timeoutId });
    heartsContainer.appendChild(el);
    return el;
  }

  /* ---------- Burst de corações no ponto ---------- */
  function burstHearts(x, y, count = BURST_COUNT) {
    const burst = document.createElement('div');
    burst.className = 'burst';
    burst.style.left = (x - 20) + 'px';
    burst.style.top = (y - 20) + 'px';
    heartsContainer.appendChild(burst);

    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.className = 'heart';
      const size = Math.round(rand(10, 26));
      h.style.width = size + 'px';
      h.style.height = size + 'px';
      h.style.opacity = rand(0.6, 1).toFixed(2);
      h.style.left = (-size / 2) + 'px';
      h.style.top = (-size / 2) + 'px';
      const angle = rand(0, Math.PI * 2);
      const distance = rand(40, 140);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - rand(10, 60);
      const rot = rand(-360, 360);
      const dur = rand(600, 1200);
      h.style.transition = `transform ${dur}ms cubic-bezier(.2,.9,.3,1), opacity ${dur}ms linear`;
      burst.appendChild(h);
      requestAnimationFrame(() => {
        h.style.transform = `translate(${dx}px, ${-dy}px) rotate(${rot}deg) scale(0.9)`;
        h.style.opacity = '0';
      });
      setTimeout(() => h.remove(), dur + 40);
    }
    setTimeout(() => burst.remove(), 1400);
  }

  /* ---------- Spawn contínuo ---------- */
  function startSpawning() {
    if (spawnStarted) return;
    spawnStarted = true;
    spawnTimer = setInterval(() => {
      if (Math.random() < 0.8) {
        createFloatingHeart({ size: Math.round(rand(20, 36)), opacity: rand(0.45, 0.95) });
      }
    }, HEART_SPAWN_INTERVAL);
  }
  function stopSpawning() { if (spawnTimer) { clearInterval(spawnTimer); spawnTimer = null; spawnStarted = false; } }

  /* ---------- SIM handler ---------- */
  function handleYes(e) {
    const now = Date.now();
    if (now - lastTouchTime < 350) return;
    lastTouchTime = now;
    confirm.classList.remove('hidden');
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    burstHearts(vw / 2, vh / 2, 20);
    for (let i = 0; i < 6; i++) createFloatingHeart({ size: Math.round(rand(18, 44)), opacity: rand(0.6, 1) });
  }
  function handleCloseConfirm() { confirm.classList.add('hidden'); }

  /* ---------- NÃO travesso (foge) ---------- */
  function dodgeNoButton(touchX, touchY) {
    const btnRect = noBtn.getBoundingClientRect();
    const wrapperRect = noBtn.parentElement.getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2;
    const centerY = btnRect.top + btnRect.height / 2;
    let dx = centerX - touchX;
    let dy = centerY - touchY;
    const dist = Math.hypot(dx, dy) || 1;
    dx = dx / dist; dy = dy / dist;
    const targetX = clamp(centerX + dx * NO_BTN_MOVE_DISTANCE, wrapperRect.left + 8, wrapperRect.right - btnRect.width - 8);
    const targetY = clamp(centerY + dy * (NO_BTN_MOVE_DISTANCE / 4), wrapperRect.top, wrapperRect.bottom - btnRect.height);
    noBtn.style.transition = 'transform 220ms cubic-bezier(.2,.9,.3,1)';
    const translateX = targetX - btnRect.left;
    const translateY = targetY - btnRect.top;
    noBtn.style.transform = `translate(${translateX}px, ${translateY}px)`;
    setTimeout(() => {
      noBtn.style.transition = '';
      noBtn.style.transform = '';
      const computedLeft = clamp(targetX - wrapperRect.left, 8, wrapperRect.width - btnRect.width - 8);
      noBtn.style.marginLeft = computedLeft + 'px';
    }, 260);
  }

  /* ---------- Global touch to create burst (exceto botões) ---------- */
  function handleGlobalTouch(e) {
    const now = Date.now(); lastTouchTime = now;
    let x, y;
    if (e.touches && e.touches[0]) { x = e.touches[0].clientX; y = e.touches[0].clientY; }
    else { x = e.clientX; y = e.clientY; }
    burstHearts(x, y, Math.round(rand(6, 12)));
  }

  /* ---------- Plano: alternar entre comer/encontrar ---------- */
  function setPlan(plan) {
    planBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.plan === plan);
      b.setAttribute('aria-pressed', b.dataset.plan === plan ? 'true' : 'false');
    });
    if (plan === 'comer') {
      locationArea.classList.remove('hidden');
      meetArea.classList.add('hidden');
    } else {
      locationArea.classList.add('hidden');
      meetArea.classList.remove('hidden');
    }
  }

  /* ---------- Local: sugestões e ações ---------- */
  // Preenche input com sugestão ao tocar
  locationSuggestions.addEventListener('click', function (e) {
    const t = e.target;
    if (t.classList.contains('suggestion')) {
      locationInput.value = t.textContent.trim();
    }
  });

  // Abre Google Maps com a query atual
  function openInMaps() {
    const place = (locationInput.value || '').trim();
    if (!place) {
      window.open('https://www.google.com/maps', '_blank');
      return;
    }
    const q = encodeURIComponent(place);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
    window.open(mapsUrl, '_blank');
  }

  // Gera mensagem e abre WhatsApp (wa.me) com texto pré-preenchido
  function sendWhatsForEat() {
    const place = (locationInput.value || '').trim();
    if (!place) {
      alert('Por favor, digite ou escolha um local antes de enviar.');
      return;
    }
    const time = (timeInput.value || '19:00');
    const mapsQuery = encodeURIComponent(place);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
    const message = `Oi amor 💕\nQue tal sairmos para comer hoje às ${time}?\nLocal: ${place}\nVer no mapa: ${mapsUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }

  // Enviar convite simples para se encontrar (sem local)
  function sendWhatsForMeet() {
    const time = (timeInput.value || '19:00');
    const message = `Oi amor 💕\nVamos nos encontrar hoje às ${time}? Podemos combinar o local depois.`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }

  /* ---------- Timeline: adicionar memória ---------- */
  function addMemory() {
    const date = new Date().toLocaleDateString();
    const text = prompt('Escreva uma memória curta (aparecerá na timeline):', 'Um momento especial com você');
    if (!text) return;
    const article = document.createElement('article');
    article.className = 'memory';
    article.innerHTML = `<div class="memory-date">${date}</div><div class="memory-text">${escapeHtml(text)}</div>`;
    timelineList.prepend(article);
    burstHearts(window.innerWidth / 2, window.innerHeight / 2, 8);
  }

  /* ---------- Quiz simples (pergunta atualizada) ---------- */
  const quizData = [
    { q: 'Qual é a nossa música favorita?', options: ['Nossa Canção', 'Outra Canção', 'Ainda Outra'], answer: 0 },
    { q: 'Onde nos conhecemos?', options: ['Café', 'Parque', 'Trabalho'], answer: 0 },
    { q: 'Qual é a minha cor preferida?', options: ['Azul', 'Rosa', 'Verde'], answer: 1 }
  ];
  function loadQuiz(index = 0) {
    const item = quizData[index];
    quizQuestion.textContent = item.q;
    quizOptions.innerHTML = '';
    item.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'btn option';
      b.textContent = opt;
      b.addEventListener('click', () => {
        if (i === item.answer) {
          quizResult.textContent = 'Acertou! 💖';
          burstHearts(window.innerWidth / 2, window.innerHeight / 2, 10);
        } else {
          quizResult.textContent = 'Quase! Tente a próxima.';
        }
        setTimeout(() => {
          quizResult.textContent = '';
          quizIndex = (quizIndex + 1) % quizData.length;
          loadQuiz(quizIndex);
        }, 900);
      });
      quizOptions.appendChild(b);
    });
  }

  /* ---------- Trilha sonora / "humor da noite" (substitui love meter) ---------- */
  function updateSoundLabel() {
    const val = parseInt(loveRange.value, 10);
    // Mapear intervalos para rótulos simples
    let label = 'Romântica';
    if (val < 25) label = 'Calma';
    else if (val < 50) label = 'Aconchegante';
    else if (val < 75) label = 'Romântica';
    else label = 'Animada';
    soundLabel.textContent = label;
    // pequeno efeito visual: burst suave quando muda para animada
    if (label === 'Animada') burstHearts(window.innerWidth / 2, window.innerHeight / 2, 6);
  }

  /* ---------- Inicialização e listeners ---------- */
  function init() {
    startSpawning();
    loadQuiz(quizIndex);
    updateSoundLabel();

    // Plan buttons
    planBtns.forEach(b => {
      b.addEventListener('click', () => setPlan(b.dataset.plan));
      b.addEventListener('touchstart', (e) => { e.preventDefault(); setPlan(b.dataset.plan); }, { passive: false });
    });
    setPlan('encontrar');

    // Location actions
    openMapsBtn.addEventListener('click', openInMaps);
    openMapsBtn.addEventListener('touchstart', (e) => { e.preventDefault(); openInMaps(); }, { passive: false });
    sendWhatsBtn.addEventListener('click', sendWhatsForEat);
    sendWhatsBtn.addEventListener('touchstart', (e) => { e.preventDefault(); sendWhatsForEat(); }, { passive: false });

    // Meet send
    sendMeetWhatsBtn.addEventListener('click', sendWhatsForMeet);
    sendMeetWhatsBtn.addEventListener('touchstart', (e) => { e.preventDefault(); sendWhatsForMeet(); }, { passive: false });

    // Quick times
    quickTimes.forEach(q => {
      q.addEventListener('click', () => { timeInput.value = q.dataset.time; });
      q.addEventListener('touchstart', (e) => { e.preventDefault(); timeInput.value = q.dataset.time; }, { passive: false });
    });

    // Global touch/click for bursts (exceto botões)
    document.addEventListener('touchstart', function (e) {
      const t = e.target;
      if (t.closest && t.closest('button')) return;
      handleGlobalTouch(e);
    }, { passive: true });
    document.addEventListener('click', function (e) {
      const t = e.target;
      if (t.closest && t.closest('button')) return;
      handleGlobalTouch(e);
    });

    // SIM
    yesBtn.addEventListener('touchstart', function (e) { e.preventDefault(); handleYes(e); }, { passive: false });
    yesBtn.addEventListener('click', handleYes);

    // Close confirm
    closeConfirm.addEventListener('click', handleCloseConfirm);
    closeConfirm.addEventListener('touchstart', function (e) { e.preventDefault(); handleCloseConfirm(); }, { passive: false });

    // NÃO
    noBtn.addEventListener('touchstart', function (e) {
      e.preventDefault();
      const touch = e.touches ? e.touches[0] : e;
      dodgeNoButton(touch.clientX, touch.clientY);
    }, { passive: false });
    noBtn.addEventListener('pointerenter', function () {
      const wrapperRect = noBtn.parentElement.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();
      const newLeft = Math.max(8, Math.min(wrapperRect.width - btnRect.width - 8, Math.random() * (wrapperRect.width - btnRect.width)));
      noBtn.style.transition = 'transform 260ms cubic-bezier(.2,.9,.3,1)';
      noBtn.style.transform = `translateX(${newLeft - (btnRect.left - wrapperRect.left)}px)`;
      setTimeout(() => { noBtn.style.transition = ''; noBtn.style.transform = ''; noBtn.style.marginLeft = newLeft + 'px'; }, 300);
    });

    // Proximidade em touchmove
    document.addEventListener('touchmove', function (e) {
      const touch = e.touches[0];
      const btnRect = noBtn.getBoundingClientRect();
      const centerX = btnRect.left + btnRect.width / 2;
      const centerY = btnRect.top + btnRect.height / 2;
      if (Math.abs(touch.clientX - centerX) < NO_BTN_PROXIMITY &&
          Math.abs(touch.clientY - centerY) < NO_BTN_PROXIMITY) {
        dodgeNoButton(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    // Timeline
    addMemoryBtn.addEventListener('click', addMemory);
    addMemoryBtn.addEventListener('touchstart', function (e) { e.preventDefault(); addMemory(); }, { passive: false });

    // LoveRange (trilha sonora)
    loveRange.addEventListener('input', updateSoundLabel);
    loveRange.addEventListener('change', function () { burstHearts(window.innerWidth / 2, window.innerHeight / 2, 4); });

    // Cleanup
    window.addEventListener('pagehide', stopSpawning);
    window.addEventListener('beforeunload', stopSpawning);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---------- Dicas rápidas ----------
     - Para trocar a frase poética, edite o conteúdo em index.html dentro de .poetic-phrase.
     - Para alterar as opções do quiz, edite a constante quizData neste arquivo.
     - Para mudar o horário sugerido, altere o value do input time em index.html (atualmente "19:00").
     - Para personalizar a mensagem enviada pelo WhatsApp, edite sendWhatsForEat() e sendWhatsForMeet().
     - Para reduzir animações em celulares lentos: diminuir MAX_HEARTS ou aumentar HEART_SPAWN_INTERVAL.
  ------------------------------------------------ */
})();
