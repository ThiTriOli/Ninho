document.addEventListener("DOMContentLoaded", function () {
    // Cria os expanded-boxes para cada personagem
    characters.forEach(character => {
        const box = document.querySelector(`.box[data-index="${character.id}"]`) || 
                   document.querySelector(`.box1[data-index="${character.id}"]`) || 
                   document.querySelector(`.box2[data-index="${character.id}"]`);
        
        if (box) {
            const expandedBox = document.createElement("div");
            expandedBox.classList.add("expanded-box");
            
            // Estrutura HTML do conteúdo expandido
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
                    </div>
                </div>
            `;
            
            document.body.appendChild(expandedBox);

            box.addEventListener("mouseenter", function () {
                const boxRect = box.getBoundingClientRect();
                expandedBox.style.left = `${boxRect.left + window.scrollX}px`;
                expandedBox.style.top = `${boxRect.top + window.scrollY - expandedBox.offsetHeight - 10}px`;
                expandedBox.style.display = "block";
            });

            box.addEventListener("mouseleave", function () {
                expandedBox.style.display = "none";
            });
        }
    });

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
