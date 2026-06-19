// Gerar corações flutuantes
function generateHearts() {
    const container = document.getElementById('heart-container');
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(heart);

        setTimeout(() => heart.remove(), 8000);
    }, 300);
}

generateHearts();

// Lógica dos botões
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const btnConfirmDate = document.getElementById('btn-confirm-date');
const btnWhatsapp = document.getElementById('btn-whatsapp');
const dateInput = document.getElementById('date-input');

// Armazenar data selecionada
let selectedDate = null;

// Botão SIM
btnYes.addEventListener('click', () => {
    document.getElementById('screen-1').classList.remove('active');
    document.getElementById('screen-2').classList.add('active');

    // Definir data mínima como hoje
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    dateInput.min = minDate;

    // Definir data máxima como 1 ano a partir de hoje
    const maxDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    dateInput.max = maxDate;
});

// Botão NÃO - se move para local aleatório
btnNo.addEventListener('click', (e) => {
    e.preventDefault();

    const randomX = Math.random() * (window.innerWidth - 150);
    const randomY = Math.random() * (window.innerHeight - 50);

    btnNo.style.position = 'fixed';
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
    btnNo.style.zIndex = '1000';
});

// Prevenir que o botão "Não" seja clicado facilmente no mobile
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const randomX = Math.random() * (window.innerWidth - 150);
    const randomY = Math.random() * (window.innerHeight - 50);

    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
});

// Botão Confirmar Data
btnConfirmDate.addEventListener('click', () => {
    if (!dateInput.value) {
        alert('Por favor, escolha uma data! 📅');
        return;
    }

    selectedDate = dateInput.value;

    // Formatar a data para exibição
    const date = new Date(selectedDate + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('pt-BR', options);

    // Capitalizar primeira letra
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    document.getElementById('date-display').textContent = capitalizedDate;

    document.getElementById('screen-2').classList.remove('active');
    document.getElementById('screen-3').classList.add('active');
});

// Botão WhatsApp
btnWhatsapp.addEventListener('click', () => {
    if (!selectedDate) return;

    const date = new Date(selectedDate + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('pt-BR', options);
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    // ⚠️ IMPORTANTE: Substitua o número abaixo pelo seu número de WhatsApp!
    // Formato: 55 + DDD + número (sem caracteres especiais)
    // Exemplo: 5585987654321 (55 = Brasil, 85 = Fortaleza, resto do número)
    const phoneNumber = '5518997314496';
    const message = `Oi! Eu aceito sair com você! Nossa data especial é: ${capitalizedDate} `;
    const encodedMessage = encodeURIComponent(message);

    // Link do WhatsApp
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');
});
