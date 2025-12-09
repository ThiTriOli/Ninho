
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
   // Adicionar máscara de CPF em tempo real
const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', function(e) {
    let value = e.target.value;
    
    // Remove tudo que não for dígito
    value = value.replace(/\D/g, "");

    // Aplica a máscara de forma progressiva
    if (value.length > 3) {
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
    }
    if (value.length > 6) {
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    }
    if (value.length > 9) {
        value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    }

    e.target.value = value;
});

// Opcional: Adiciona um evento para evitar que o "Enter" envie o formulário
// caso o usuário pressione-o no campo de CPF
cpfInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

// ===== MODAL DE TERMOS DE USO =====
const termosMod = document.getElementById('termos-modal');
const btnAceitar = document.getElementById('aceitar-termos');
const btnRejeitar = document.getElementById('rejeitar-termos');
const btnFecharModal = document.getElementById('close-modal');

// Verificar se há mensagem de sucesso para mostrar o modal
document.addEventListener('DOMContentLoaded', function() {
    const messages = document.querySelectorAll('.messages li');
    
    // Se houver mensagem de sucesso (cadastro realizado)
    messages.forEach(msg => {
        if (msg.textContent.includes('sucesso') || msg.textContent.includes('Cadastro realizado')) {
            // Mostrar modal de termos
            setTimeout(() => {
                termosMod.style.display = 'flex';
            }, 500);
        }
    });
});

// Fechar modal ao clicar no X
btnFecharModal.addEventListener('click', () => {
    termosMod.style.display = 'none';
});

// Aceitar termos - redirecionar para login
btnAceitar.addEventListener('click', () => {
    termosMod.style.display = 'none';
    // Salvar que o usuário aceitou os termos
    localStorage.setItem('termos_aceitos', 'true');
    // Redirecionar para home/login
    window.location.href = '{% url "ninho:home" %}';
});

// Rejeitar termos - voltar para cadastro
btnRejeitar.addEventListener('click', () => {
    termosMod.style.display = 'none';
    alert('Você precisa aceitar os termos de uso para continuar.');
    // Limpar formulário
    document.querySelector('form').reset();
});

// Fechar modal ao clicar fora dele
termosMod.addEventListener('click', (e) => {
    if (e.target === termosMod) {
        // Não fechar ao clicar fora - forçar decisão do usuário
        alert('Você precisa aceitar ou recusar os termos de uso.');
    }
});