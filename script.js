/* ==========================================================================
   ROMANTIC WEBSITE INTERACTIVITY & LOGIC
   Created with love for Vitória
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Coleção de cantadas românticas de TI, músicas e jogos para surpreender sua namorada
    const romanticPhrases = [
        "Meu amor por você é como um loop infinito: não tem fim e consome toda a minha memória. 💻💖",
        "Você não é Wi-Fi, mas sinto uma conexão inexplicável e perfeita com você. 📶✨",
        "Se você fosse um repositório, eu faria 'git clone' e guardaria para sempre no meu coração. 🐙",
        "Você é a chave primária que dá sentido e organiza todo o banco de dados da minha vida. 🔑❤️",
        "O meu mundo estava em modo offline até você chegar e atualizar tudo. ⚡",
        "Você é o acorde perfeito que faltava na melodia mais bonita da minha vida. 🎵",
        "Minha mente é como uma playlist que só toca a sua risada em loop. 🎧💕",
        "Se o amor fosse uma música, você seria o refrão que eu nunca me canso de cantar. 🎤✨",
        "Você é a batida certa que dita o ritmo acelerado do meu coração. 🥁💓",
        "Nem a sinfonia mais bonita do mundo chega perto do som da sua voz.",
        "Você é o meu Player 2 favorito para toda a vida. Vamos jogar juntos para sempre? 🎮",
        "Eu enfrentaria o Boss mais difícil e a fase mais complicada só para ver você sorrir. 👾⭐",
        "Você é o loot mais raro, lendário e precioso que encontrei nessa jornada. 💎",
        "Sem você por perto, meu inventário fica vazio e minha barra de vida zera. Você é meu item de cura. 🧪❤️",
        "Mesmo se eu tivesse 99 vidas extras, gastaria todas elas tentando te fazer a pessoa mais feliz do mundo. 💖",
        "Você deve ter usado algum cheat code, porque é bonita e perfeita demais para ser verdade! 🎮✨",
        "Você é o meu 'Save Game' favorito. Do seu lado, me sinto sempre seguro. 💾🏡",
        "Você não é CSS, mas trouxe toda a cor, estilo e beleza para o código do meu dia a dia. 🎨",
        "Se eu pudesse programar o nosso futuro, faria uma linha direta para o nosso 'felizes para sempre'. 💻💍",
        "O meu maior achievement (conquista) foi ter conquistado o amor da minha vida. 🏆❤️"
    ];

    // ----------------------------------------------------------------------
    // 2. DOM ELEMENTS
    // ----------------------------------------------------------------------
    const phraseDisplay = document.getElementById("phrase-display");
    const phraseBtn = document.getElementById("phrase-btn");
    
    const musicToggle = document.getElementById("music-toggle");
    const bgMusic = document.getElementById("background-music");
    
    const heartBgContainer = document.getElementById("heart-bg-container");

    let lastPhraseIndex = -1;

    // ----------------------------------------------------------------------
    // 4. RANDOM PHRASE GENERATOR WITH FADE EFFECT
    // ----------------------------------------------------------------------
    function generatePhrase() {
        phraseDisplay.classList.add("phrase-changing");

        // Aguarda a transição de fade-out do CSS terminar antes de mudar o texto
        setTimeout(() => {
            let randomIndex;
            
            // Garante que não repete a mesma frase mostrada logo antes
            do {
                randomIndex = Math.floor(Math.random() * romanticPhrases.length);
            } while (randomIndex === lastPhraseIndex && romanticPhrases.length > 1);

            lastPhraseIndex = randomIndex;
            phraseDisplay.textContent = romanticPhrases[randomIndex];
            
            // Remove a classe para disparar o fade-in suave
            phraseDisplay.classList.remove("phrase-changing");
        }, 300);
    }

    // ----------------------------------------------------------------------
    // 5. FLOATING BACKGROUND HEARTS ENGINE
    // ----------------------------------------------------------------------
    const heartSymbols = ["❤️", "💖", "💕", "💘", "💜", "🌸"];

    function createFloatingHeart() {
        const heart = document.createElement("div");
        heart.classList.add("floating-heart");
        
        // Customização aleatória para parecer natural e orgânico
        const randomSymbol = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.innerText = randomSymbol;
        
        // Posição horizontal aleatória (0 a 100% da largura da tela)
        heart.style.left = Math.random() * 100 + "vw";
        
        // Tamanhos aleatórios (font-size de 12px a 28px)
        const randomSize = Math.random() * 16 + 12;
        heart.style.fontSize = randomSize + "px";
        
        // Duração da animação aleatória (de 6 a 12 segundos)
        const duration = Math.random() * 6 + 6;
        heart.style.animation = `floatHeart ${duration}s linear forwards`;
        
        // Rotação inicial e opacidades variadas
        heart.style.opacity = Math.random() * 0.5 + 0.2;
        
        heartBgContainer.appendChild(heart);
        
        // Limpa o elemento do DOM após a animação concluir
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // Cria corações flutuando no fundo em intervalos regulares
    setInterval(createFloatingHeart, 1000);
    // Cria alguns corações iniciais logo ao carregar a página
    for (let i = 0; i < 8; i++) {
        setTimeout(createFloatingHeart, Math.random() * 3000);
    }

    // ----------------------------------------------------------------------
    // 6. BUTTON HEART BURST / EXPLOSION PARTICLES
    // ----------------------------------------------------------------------
    function createHeartBurst(x, y) {
        const burstCount = 15; // Número de corações por clique
        
        for (let i = 0; i < burstCount; i++) {
            const particle = document.createElement("div");
            particle.classList.add("click-heart");
            
            const randomSymbol = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            particle.innerText = randomSymbol;
            
            // Define a posição inicial no ponto de clique
            particle.style.left = x + "px";
            particle.style.top = y + "px";
            
            // Direções aleatórias em um círculo (valores de translação para animação CSS)
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 120 + 50; // Distância que a partícula percorre
            
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            // Define variáveis CSS personalizadas que serão usadas pelo @keyframes popOut
            particle.style.setProperty("--tx", tx + "px");
            particle.style.setProperty("--ty", ty + "px");
            particle.style.setProperty("--r", Math.random() * 360 + "deg"); // Rotação final
            particle.style.setProperty("--s", Math.random() * 0.8 + 0.6);   // Escala final
            
            document.body.appendChild(particle);
            
            // Remove a partícula após terminar a animação
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    }

    // Event listener do clique no botão de gerar frases
    phraseBtn.addEventListener("click", (e) => {
        // Altera a frase
        generatePhrase();

        // Obtém coordenadas do clique. Se disparado via teclado, usa o centro do botão.
        let clickX, clickY;
        if (e.clientX && e.clientY) {
            clickX = e.clientX;
            clickY = e.clientY;
        } else {
            const rect = phraseBtn.getBoundingClientRect();
            clickX = rect.left + rect.width / 2;
            clickY = rect.top + rect.height / 2;
        }

        // Dispara a explosão de corações
        createHeartBurst(clickX, clickY);
    });

    // ----------------------------------------------------------------------
    // 7. BACKGROUND MUSIC PLAYER CONTROLS
    // ----------------------------------------------------------------------
    musicToggle.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play()
                .then(() => {
                    musicToggle.classList.add("playing");
                    musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                })
                .catch(error => {
                    console.log("Autoplay bloqueado pelo navegador ou falha no áudio: ", error);
                });
        } else {
            bgMusic.pause();
            musicToggle.classList.remove("playing");
            musicToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
        }
    });
});
