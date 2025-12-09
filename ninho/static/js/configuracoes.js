document.addEventListener("DOMContentLoaded", function () {
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

    // Aplica o tema ao carregar a página
    applyTheme(checkTheme());

    // Event listeners para os botões de tema na seção de privacidade
    const lightModeBtn = document.querySelector('.light-mode-btn');
    const darkModeBtn = document.querySelector('.dark-mode-btn');

    if (lightModeBtn) {
        lightModeBtn.addEventListener('click', () => applyTheme('light'));
    }

    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => applyTheme('dark'));
    }

    // Detecta mudança de tema do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    const sideButtons = document.querySelectorAll('.side-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');

    function setActiveSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    function setActiveButton(buttonId) {
        sideButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(buttonId).classList.add('active');
    }

    sideButtons.forEach(button => {
        button.addEventListener('click', function () {
            const contentId = this.dataset.contentId;
            setActiveSection(contentId);
            setActiveButton(this.id);
        });
    });

    // Ao carregar, a seção de perfil é a padrão
    setActiveSection('user-info-section');
    setActiveButton('user-info-btn');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function () {
            $('#editProfileModal').modal('show');
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function () {
            const newNickname = document.getElementById('new-nickname').value;
            const newUsername = document.getElementById('new-username').value;
            const newPhone = document.getElementById('new-phone').value;

            if (newNickname) {
                document.getElementById('user-name').textContent = newNickname;
                document.getElementById('display-nickname').textContent = newNickname;
            }
            if (newUsername) {
                document.getElementById('user-username').textContent = `@${newUsername}`;
                document.getElementById('display-username').textContent = `@${newUsername}`;
            }
            if (newPhone) {
                document.getElementById('display-phone').textContent = newPhone;
            }

            // Oculta o modal
            $('#editProfileModal').modal('hide');
            
            try {
                function getCookie(name) {
                    let cookieValue = null;
                    if (document.cookie && document.cookie !== '') {
                        const cookies = document.cookie.split(';');
                        for (let i = 0; i < cookies.length; i++) {
                            const cookie = cookies[i].trim();
                            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }

                const csrftoken = getCookie('csrftoken');

                fetch(window.location.pathname, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        nickname: newNickname || null,
                        telefone: newPhone || null,
                    })
                }).then(r => r.json()).then(data => {
                    if (!data.ok) {
                        console.error('Erro ao salvar configuração:', data.error || data);
                    }
                }).catch(err => {
                    console.error('Erro de rede ao salvar configuração:', err);
                });
            } catch (e) {
                console.error('Erro ao enviar configuração:', e);
            }
        });
    }

    // Ações para a lista de chats (opcional, pode ser ajustado)
    const chatListItems = document.querySelectorAll('#chat-list-section .chat-item');
    if (chatListItems) {
        chatListItems.forEach(item => {
            item.addEventListener('click', function() {
                // Lógica para abrir um chat específico
                console.log('Chat clicado:', this.querySelector('h4').textContent);
            });
        });
    }
});