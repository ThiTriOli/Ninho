document.addEventListener("DOMContentLoaded", function () {
    // Variáveis globais para controlar o modal ativo e seu temporizador
    let activeModal = null;
    let modalTimeout = null;

    // Configuração dos boxes de personagem
    const characters = [
        {
            id: 1,
            image: 'personagem1.jpg',
            name: 'Personagem 1',
            info: ['Idade: 25', 'Habilidade: Super força', 'Origem: Terra'],
            link: 'https://camila12301540.github.io/Ninho/info_perso/info_perso%20-%201.html'
        },
        {
            id: 2,
            image: 'personagem2.jpg',
            name: 'Personagem 2',
            info: ['Idade: 30', 'Habilidade: Invisibilidade', 'Origem: Marte'],
            link: 'https://camila12301540.github.io/Ninho/info_perso/info_perso%20-%202.html'
        },
        {
            id: 3,
            image: 'personagem3.jpg',
            name: 'Personagem 3',
            info: ['Idade: 22', 'Habilidade: Velocidade', 'Origem: Vênus'],
            link: 'https://camila12301540.github.io/Ninho/info_perso/info_perso%20-%203.html'
        },
        {
            id: 4,
            image: 'personagem4.jpg',
            name: 'Personagem 4',
            info: ['Idade: 28', 'Habilidade: Voar', 'Origem: Júpiter'],
            link: 'https://camila12301540.github.io/Ninho/info_perso/info_perso%20-%204.html'
        },
        {
            id: 5,
            image: 'personagem5.jpg',
            name: 'Personagem 5',
            info: ['Idade: 35', 'Habilidade: Telepatia', 'Origem: Saturno'],
            link: 'https://camila12301540.github.io/Ninho/info_perso/info_perso%20-%205.html'
        },
        {
            id: 6,
            image: 'personagem6.jpg',
            name: 'Personagem 6',
            info: ['Idade: 40', 'Habilidade: Teletransporte', 'Origem: Plutão'],
            link: 'https://camila12301540.github.io/Ninho/info_perso/info_perso%20-%206.html'
        }
    ];

    // Cria os expanded-boxes para cada personagem
    characters.forEach(character => {
        const box = document.querySelector(`.box[data-index="${character.id}"]`) || 
                    document.querySelector(`.box1[data-index="${character.id}"]`) || 
                    document.querySelector(`.box2[data-index="${character.id}"]`);
        
        if (box) {
            const expandedBox = document.createElement("div");
            expandedBox.classList.add("expanded-box");

            // Estrutura HTML do conteúdo expandido com link
            expandedBox.innerHTML = `
                <div class="character-container">
                    <div class="character-image">
                        <img src="${character.image}" alt="${character.name}">
                    </div>
                    <div class="character-info">
                        <h3>${character.name}</h3>
                        <ul>
                            ${character.info.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        <button class="btn btn-primary ver-mais-btn" data-href="${character.link}">Ver mais</button>
                    </div>
                </div>
            `;

            document.body.appendChild(expandedBox);

            // Listener direto no botão 'Ver mais' (abre em nova aba)
            const verMaisBtn = expandedBox.querySelector('.ver-mais-btn');
            if (verMaisBtn) {
                verMaisBtn.addEventListener('click', function (e) {
                    const href = this.getAttribute('data-href');
                    if (href) {
                        window.open(href, '_blank');
                    }
                });
            }

            box.addEventListener("mouseenter", function () {
                // Fecha o modal anterior (se existir) e limpa seu temporizador
                if (activeModal && activeModal !== expandedBox) {
                    activeModal.style.display = "none";
                    if (modalTimeout) {
                        clearTimeout(modalTimeout);
                    }
                }

                // Posiciona e exibe o novo modal
                const boxRect = box.getBoundingClientRect();
                expandedBox.style.left = `${boxRect.left + window.scrollX}px`;
                expandedBox.style.top = `${boxRect.top + window.scrollY - expandedBox.offsetHeight - 10}px`;
                expandedBox.style.display = "block";

                // Define este modal como o ativo
                activeModal = expandedBox;

                // Configura o temporizador para fechar após 5 segundos
                modalTimeout = setTimeout(() => {
                    expandedBox.style.display = "none";
                    activeModal = null;
                }, 5000);
            });

            box.addEventListener("mouseleave", function () {
                // Não faz nada aqui! O modal só some após os 5 segundos.
            });
        }
    });

    // Tema dark/light
    function checkTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedTheme || (systemPrefersDark ? 'dark' : 'light');
    }

    function applyTheme(theme) {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const currentTheme = checkTheme();
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    // Inicialização
    applyTheme(checkTheme());
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Observador de preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Fallback: delegação de clique para garantir que 'Ver mais' abra (abre em nova aba)
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('.character-link');
        if (anchor) {
            const href = anchor.getAttribute('href');
            if (href) {
                e.preventDefault();
                console.log('Opening link in new tab:', href);
                window.open(href, '_blank');
            }
        }
    });
});