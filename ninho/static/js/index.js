// Verifica e aplica o tema salvo ou preferência do sistema
function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        return savedTheme;
    } else if (systemPrefersDark) {
        return 'dark';
    } else {
        return 'light';
    }
}

// Aplica o tema selecionado
function applyTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);
    localStorage.setItem('theme', theme);
}

// Alterna entre temas claro e escuro
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const theme = checkTheme();
    applyTheme(theme);
    
    // Adiciona evento de clique ao botão de tema
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

// Observa mudanças na preferência de tema do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
    }
});
