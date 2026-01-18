import initChatbot from './chatbot/chatbot';

document.addEventListener('DOMContentLoaded', () => {
    // démarrer le widget avec thème optionnel
    initChatbot({ theme: 'green' });
});