import { motion } from 'framer-motion';
import { CalendarDays, CloudSun, Heart, MapPin, Send, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const formatDateTime = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);
};

const poemLines = [
  'No silêncio do meu peito, seu nome sempre soa como uma canção.',
  'Se eu pudesse te dar um céu, seria feito de estrelas e de carinho.',
  'Cada instante ao seu lado me faz sentir que o amor também sabe dançar.',
  'Você é a suavidade que me ensina a amar com mais ternura e mais verdade.',
  'Mesmo o tempo mais curto ao seu lado vira um poema inesquecível.',
];

const weatherCodes = {
  0: 'Céu limpo',
  1: 'Predominantemente ensolarado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Geada',
  51: 'Chuvisco leve',
  53: 'Chuvisco moderado',
  55: 'Chuvisco forte',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  80: 'Pancadas leves',
  81: 'Pancadas moderadas',
  82: 'Pancadas fortes',
  95: 'Trovoada',
  96: 'Trovoada com granizo',
  99: 'Trovoada intensa',
};

const recipientPhone = '5518997314496';

function App() {
  const [formData, setFormData] = useState({
    dateTime: '',
  });
  const [location, setLocation] = useState({ lat: -23.5505, lon: -46.6333, city: 'São Paulo' });
  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState('Escolha uma data e horário para ver a previsão.');
  const [confirmationReady, setConfirmationReady] = useState(false);
  const [confirmedDateTime, setConfirmedDateTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude, city: 'Sua localização' });
        },
        () => {
          setWeatherStatus('Usando São Paulo como referência para a previsão.');
        }
      );
    }
  }, []);

  useEffect(() => {
    const loadWeather = async () => {
      if (!formData.dateTime) {
        setWeather(null);
        return;
      }

      try {
        const selectedDate = new Date(formData.dateTime);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m,precipitation_probability,weathercode,windspeed_10m&timezone=auto&forecast_days=16`;
        const response = await fetch(url);
        const data = await response.json();
        const times = data.hourly?.time || [];
        const temperatures = data.hourly?.temperature_2m || [];
        const precipitations = data.hourly?.precipitation_probability || [];
        const weathercodes = data.hourly?.weathercode || [];
        const winds = data.hourly?.windspeed_10m || [];

        const selectedTime = selectedDate.getTime();
        const nearestIndex = times.reduce(
          (bestIndex, time, index) => {
            const currentTime = new Date(time).getTime();
            const bestDiff = Math.abs(new Date(times[bestIndex]).getTime() - selectedTime);
            const diff = Math.abs(currentTime - selectedTime);
            return diff < bestDiff ? index : bestIndex;
          },
          0
        );

        const selectedWeather = {
          temperature: temperatures[nearestIndex],
          precipitation: precipitations[nearestIndex],
          weathercode: weathercodes[nearestIndex],
          wind: winds[nearestIndex],
          time: times[nearestIndex],
        };

        setWeather(selectedWeather);
        setWeatherStatus('Previsão atualizada para o horário escolhido.');
      } catch (error) {
        console.error(error);
        setWeather(null);
        setWeatherStatus('Não foi possível carregar a previsão neste momento.');
      }
    };

    loadWeather();
  }, [formData.dateTime, location.lat, location.lon]);

  const heroHearts = useMemo(
    () => Array.from({ length: 13 }, (_, index) => ({ id: index, delay: (index % 5) * 0.15, left: `${8 + (index % 7) * 12}%`, size: 22 + (index % 4) * 7 })),
    []
  );

  const handleConfirm = (event) => {
    event.preventDefault();
    if (!formData.dateTime) {
      return;
    }

    setConfirmedDateTime(formData.dateTime);
    setConfirmationReady(true);
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!confirmedDateTime) {
      return;
    }

    const message = `Oi, meu amor! Quero um encontro com você no dia ${formatDateTime(confirmedDateTime)}.\n\nSe você aceitar, já posso começar a imaginar cada detalhe especial para nós dois. 💖`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${recipientPhone}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="app-shell">
      <motion.header
        className="hero-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="hero-glow" />
        <div className="hero-hearts" aria-hidden="true">
          {heroHearts.map((heart, index) => (
            <motion.span
              key={heart.id}
              className="floating-heart"
              initial={{ y: 30, opacity: 0, scale: 0.7 }}
              animate={{ y: [-8, 18, -8], opacity: [0.4, 1, 0.4], scale: [0.8, 1.07, 0.8] }}
              transition={{ duration: 3.6 + index * 0.2, repeat: Infinity, delay: heart.delay, ease: 'easeInOut' }}
              style={{ left: heart.left, fontSize: `${heart.size}px` }}
            >
              ♥
            </motion.span>
          ))}
        </div>

        <div className="hero-content">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="hero-badge">
            <Heart size={16} />
            Para a minha princesa
          </motion.div>
          <h1>Um convite feito com carinho, céu e um pouco de magia.</h1>
          <p>
            Este site é uma pequena obra de amor para você, com animações suaves, uma surpresa romântica e um jeito simples de escolher o melhor dia para ficar ainda mais perto.
          </p>
          <div className="hero-actions">
            <a href="#surpresa" className="primary-link">Abrir a surpresa</a>
            <span className="secondary-pill">Mobile-first · Animado · Responsivo</span>
          </div>
        </div>
      </motion.header>

      <main className="main-grid">
        <section id="surpresa" className="panel card-form">
          <div className="section-heading">
            <CalendarDays size={22} />
            <div>
              <p className="eyebrow">Escolha o dia</p>
              <h2>Escolha uma data e um horário que te faça sorrir</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Escolha a data e a hora
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(event) => {
                  setFormData((prev) => ({ ...prev, dateTime: event.target.value }));
                  setConfirmationReady(false);
                  setConfirmedDateTime('');
                  setSubmitted(false);
                }}
              />
            </label>

            <div className="choice-actions">
              <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={handleConfirm} disabled={!formData.dateTime}>
                Confirmar data e horário
              </motion.button>

              {confirmationReady && (
                <motion.button whileTap={{ scale: 0.98 }} type="submit">
                  <Send size={16} />
                  Enviar para o WhatsApp
                </motion.button>
              )}
            </div>

            {confirmationReady && (
              <p className="success-text">
                Perfeito! Sua escolha foi confirmada para {formatDateTime(confirmedDateTime)}.
              </p>
            )}
            {submitted && <p className="success-text">Sua mensagem foi aberta no WhatsApp — pode ajustar o texto se quiser.</p>}
          </form>
        </section>

        <section className="panel weather-card">
          <div className="section-heading">
            <CloudSun size={22} />
            <div>
              <p className="eyebrow">Previsão do tempo</p>
              <h2>Como vai ficar no horário escolhido</h2>
            </div>
          </div>

          <div className="weather-summary">
            <div className="weather-main">
              <div className="weather-icon">☁️</div>
              <div>
                <p className="weather-location"><MapPin size={16} /> {location.city}</p>
                <h3>{weather ? `${weather.temperature.toFixed(0)}°C` : '—'}</h3>
                <p>{weather ? weatherCodes[weather.weathercode] || 'Clima especial' : 'Aguardando horário'}</p>
              </div>
            </div>

            <div className="weather-metrics">
              <div>
                <span>Chuva</span>
                <strong>{weather ? `${weather.precipitation}%` : '—'}</strong>
              </div>
              <div>
                <span>Vento</span>
                <strong>{weather ? `${weather.wind.toFixed(0)} km/h` : '—'}</strong>
              </div>
              <div>
                <span>Horário</span>
                <strong>{weather ? new Date(weather.time).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</strong>
              </div>
            </div>
          </div>

          <p className="weather-note">{weatherStatus}</p>
          <label className="datetime-picker">
            Escolha outro horário
            <input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(event) => setFormData((prev) => ({ ...prev, dateTime: event.target.value }))}
            />
          </label>
        </section>

        <section className="panel poem-card">
          <div className="section-heading">
            <Heart size={22} />
            <div>
              <p className="eyebrow">Frases poéticas</p>
              <h2>Palavras feitas para o coração</h2>
            </div>
          </div>

          <div className="poem-list">
            {poemLines.map((line, index) => (
              <motion.blockquote
                key={line}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * index }}
              >
                “{line}”
              </motion.blockquote>
            ))}
          </div>

          <div className="divider" />
          <p className="closing-message">
            Se a vida te oferecer outro dia, eu quero que você saiba: meu carinho já está pronto, só precisa de um pouco de tempo e de você.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
