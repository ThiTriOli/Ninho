document.addEventListener("DOMContentLoaded", function () {
    console.log('personagens.js loaded');
    let activeModal = null;
    let modalTimeout = null;

    if (typeof characterData === 'undefined') {
        var characterData = {
            1: { info: "/ninho/info_perso/1/", chat: "/ninho/chat/" },
            2: { info: "/ninho/info_perso/2/", chat: "/ninho/chat/" },
            3: { info: "/ninho/info_perso/3/", chat: "/ninho/chat/" },
            4: { info: "/ninho/info_perso/4/", chat: "/ninho/chat/" },
            5: { info: "/ninho/info_perso/5/", chat: "/ninho/chat/" },
            6: { info: "/ninho/info_perso/6/", chat: "/ninho/chat/" }
        };
    }

    let characters = [
        { id: 1, image: '/static/images/perso01Icon.png', name: 'Tereza', info: ['Idade: 30','Personalidade:'] },
        { id: 2, image: '/static/images/miniPerso2.png', name: 'Personagem 2', info: ['Idade: 30', 'Personalidade:'] },
        { id: 3, image: '/static/images/miniPerso3.png', name: 'Personagem 3', info: ['Idade: 22', 'Personalidade:'] },
        { id: 4, image: '/static/images/miniPerso4.png', name: 'Personagem 4', info: ['Idade: 28', 'Personalidade:'] },
        { id: 5, image: '/static/images/miniPerso5.png', name: 'Personagem 5', info: ['Idade: 35', 'Personalidade:'] },
        { id: 6, image: '/static/images/miniPerso6.png', name: 'Personagem 6', info: ['Idade: 40', 'Personalidade:'] }
    ];

    characters.forEach(character => {
        const box = document.querySelector(`.box[data-index="${character.id}"]`);

        if (box) {
            const expandedBox = document.createElement("div");
            expandedBox.classList.add("expanded-box");

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
                        <div class="button-container">
                            <button class="btn btn-primary ver-mais-btn" data-href="${characterData[character.id].info}">Ver mais</button>
                            <a href="${characterData[character.id].chat}" class="character-chat">
                                <button class="btn btn-chat">Conversar</button>
                            </a>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(expandedBox);

            // Listener direto no botão 'Ver mais' (usa data-href)
            const verMaisBtn = expandedBox.querySelector('.ver-mais-btn');
            if (verMaisBtn) {
                verMaisBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    let href = this.getAttribute('data-href');
                    if (!href || href === '/ninho/personagens/' || href.includes('personagens')) {
                        href = `/ninho/info_perso/${character.id}/`;
                    }
                    console.log('ver-mais clicked for', href);
                    window.location.href = href;
                });
            }

            function showModal() {
                if (activeModal && activeModal !== expandedBox) {
                    hideModal(activeModal);
                }

                expandedBox.style.display = "block";
                expandedBox.style.visibility = "hidden";

                const boxRect = box.getBoundingClientRect();
                const modalHeight = expandedBox.offsetHeight;
                const modalWidth = expandedBox.offsetWidth;
                let topPosition;
                let leftPosition;

                const spaceAbove = boxRect.top;
                const spaceBelow = window.innerHeight - boxRect.bottom;

                if (spaceAbove >= modalHeight + 10 || spaceAbove > spaceBelow) {
                    topPosition = boxRect.top + window.scrollY - modalHeight - 10;
                } else {
                    topPosition = boxRect.bottom + window.scrollY + 10;
                }
                
                leftPosition = boxRect.left + window.scrollX + (boxRect.width / 2) - (modalWidth / 2);

                if (leftPosition < 10) {
                    leftPosition = 10;
                }
                if (leftPosition + modalWidth > window.innerWidth - 10) {
                    leftPosition = window.innerWidth - modalWidth - 10;
                }

                expandedBox.style.top = `${topPosition}px`;
                expandedBox.style.left = `${leftPosition}px`;
                expandedBox.style.visibility = "visible";
                expandedBox.classList.add('visible');

                activeModal = expandedBox;
            }

            function hideModal(modal) {
                if (modal) {
                    modal.classList.remove('visible');
                    setTimeout(() => {
                        modal.style.display = "none";
                    }, 300);
                }
            }
            
            let isHoveringBox = false;
            let isHoveringModal = false;

            box.addEventListener("mouseenter", () => {
                isHoveringBox = true;
                clearTimeout(modalTimeout);
                showModal();
            });

            box.addEventListener("click", () => {
                showModal();
            });

            box.addEventListener("mouseleave", () => {
                isHoveringBox = false;
                modalTimeout = setTimeout(() => {
                    if (!isHoveringModal) {
                        hideModal(expandedBox);
                        activeModal = null;
                    }
                }, 50);
            });

            expandedBox.addEventListener("mouseenter", () => {
                isHoveringModal = true;
                clearTimeout(modalTimeout);
            });

            expandedBox.addEventListener("mouseleave", () => {
                isHoveringModal = false;
                modalTimeout = setTimeout(() => {
                    if (!isHoveringBox) {
                        hideModal(expandedBox);
                        activeModal = null;
                    }
                }, 50);
            });
        }
    });

    // Funções de tema (mantidas como estavam)
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

    applyTheme(checkTheme());
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('.character-link');
        if (anchor) {
            const href = anchor.getAttribute('href');
            if (href) {
                e.preventDefault();
                console.log('Navigating to', href);
                window.location.href = href;
            }
        }
    });
});