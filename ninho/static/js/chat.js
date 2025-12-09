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

    function toggleTheme() {
        const currentTheme = checkTheme();
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    // Inicialização do tema
    applyTheme(checkTheme());
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Observador de preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Criar e sincronizar scrollbar fixa no canto (apenas visual/controle)
    if (chatMessages) {
        let external = document.querySelector('.external-scrollbar');
        if (!external) {
            external = document.createElement('div');
            external.className = 'external-scrollbar';
            const track = document.createElement('div');
            track.className = 'track';
            const thumb = document.createElement('div');
            thumb.className = 'thumb';
            track.appendChild(thumb);
            external.appendChild(track);
            document.body.appendChild(external);
        }

        const track = external.querySelector('.track');
        const thumb = external.querySelector('.thumb');

        function updateThumb() {
            const scrollHeight = chatMessages.scrollHeight;
            const clientHeight = chatMessages.clientHeight;
            const scrollTop = chatMessages.scrollTop;
            const trackHeight = track.clientHeight;

            if (scrollHeight <= clientHeight) {
                thumb.style.display = 'none';
                return;
            } else {
                thumb.style.display = 'block';
            }

            const visibleRatio = clientHeight / scrollHeight;
            const thumbHeight = Math.max(24, Math.floor(trackHeight * visibleRatio));
            const maxThumbTop = trackHeight - thumbHeight;
            const thumbTop = Math.floor((scrollTop / (scrollHeight - clientHeight)) * maxThumbTop);

            thumb.style.height = thumbHeight + 'px';
            thumb.style.top = thumbTop + 'px';
        }

        // atualizar quando a área de mensagens rolar
        chatMessages.addEventListener('scroll', updateThumb);
        window.addEventListener('resize', updateThumb);

        // clicar na track para mover
        track.addEventListener('click', function (e) {
            if (e.target === thumb) return;
            const rect = track.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const trackHeight = rect.height;
            const scrollHeight = chatMessages.scrollHeight;
            const clientHeight = chatMessages.clientHeight;
            const visibleRatio = clientHeight / scrollHeight;
            const thumbHeight = Math.max(24, Math.floor(trackHeight * visibleRatio));
            const maxThumbTop = trackHeight - thumbHeight;
            const targetThumbTop = Math.min(Math.max(0, clickY - thumbHeight / 2), maxThumbTop);
            const ratio = targetThumbTop / maxThumbTop;
            chatMessages.scrollTop = ratio * (scrollHeight - clientHeight);
        });

        // arrastar o thumb
        let isDragging = false;
        let dragStartY = 0;
        let startThumbTop = 0;

        thumb.addEventListener('mousedown', function (e) {
            isDragging = true;
            dragStartY = e.clientY;
            startThumbTop = parseInt(thumb.style.top || 0, 10);
            document.body.classList.add('no-select');
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            const rect = track.getBoundingClientRect();
            const trackHeight = rect.height;
            const delta = e.clientY - dragStartY;
            const newThumbTop = Math.min(Math.max(0, startThumbTop + delta), trackHeight - thumb.clientHeight);
            const ratio = newThumbTop / (trackHeight - thumb.clientHeight || 1);
            chatMessages.scrollTop = ratio * (chatMessages.scrollHeight - chatMessages.clientHeight);
        });

        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                document.body.classList.remove('no-select');
            }
        });

        // inicializa posição do thumb
        setTimeout(updateThumb, 50);
    }

    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'character-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Enviar mensagem quando Enter for pressionado
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});