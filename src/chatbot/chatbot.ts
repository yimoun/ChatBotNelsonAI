// entrée publique : init/start
import { ColorThemes } from './themes';
import { createOpenButton, createChatWindow, createChatHeader, createMessagesContainer, createChatInput } from './ui';
import type { ThemeName, ChatSession, ColorTheme } from './types';
import {  sendMessage } from './utils';

export function initChatbot(options?: { theme?: ThemeName }) {
    const themeName = options?.theme ?? 'blue';
    const theme: ColorTheme = (ColorThemes[themeName] ?? ColorThemes.blue) as ColorTheme;
    const session: ChatSession = { 
        id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2,9), 
        startedAt: Date.now() };

    const chatBtn = createOpenButton(theme, session);
    const chatWindow = createChatWindow(theme);

    document.body.appendChild(chatBtn);
    document.body.appendChild(chatWindow);


    const chatHeader = createChatHeader(theme);
    chatWindow.appendChild(chatHeader);
    const messagesContainer = createMessagesContainer(theme);
    chatWindow.appendChild(messagesContainer);
    const chatInput = createChatInput(theme);
    chatWindow.appendChild(chatInput);

    //Logique d'ouverture/fermeture du chat
    chatBtn.onclick = () => {
       chatWindow.style.display = 'flex';
       // focus sur l'input pour que l'utilisateur puisse taper immédiatement
       const inputEl = chatInput.querySelector('input') as HTMLInputElement | null;
       if (inputEl) inputEl.focus();
    }

    const closeBtn = chatHeader.querySelectorAll('#chatbot-close')[0] as HTMLElement | null;
    if (closeBtn) {
        closeBtn.onclick = () => {
            chatWindow.style.display = 'none';
        };
    }

//Ajout de message dans le fenetre de chat
//Envoi du message
// Atteindre le sentBtn dans le chatInput avant
const sendBtn = chatInput.querySelector('button') as HTMLButtonElement | null;
if (sendBtn) {
    sendBtn.onclick = () => {
        console.log('Is sendBtn: ?', sendBtn);
        const inputEl = chatInput.querySelector('input') as HTMLInputElement | null;
        if (inputEl) {
            sendMessage(inputEl, messagesContainer, themeName, session);
        }
    };
}

// Attacher l'écoute du champ une seule fois (en dehors du click)
// const inputEl = chatInput.querySelector('input') as HTMLInputElement | null;
// if (inputEl && !inputEl.dataset.chatListener) {
//     inputEl.addEventListener('keydown', (event) => {
//         if (event.key === 'Enter') {
//             sendMessage(inputEl, messagesContainer, themeName);
//         }
//     });
//     inputEl.dataset.chatListener = '1';
// }

    return { session, chatBtn };
}

// export par défaut si tu préfères
export default initChatbot;