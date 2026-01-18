// DOM, styles inline ou CSS module
import type { ColorTheme, ChatSession } from './types';

// Création du bouton d'ouverture du chat
export function createOpenButton(theme: ColorTheme, session: ChatSession): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.id = 'chatbot-open-btn';
    btn.style.position = 'fixed';
    btn.style.bottom = '32px';
    btn.style.right = '32px';
    btn.style.zIndex = '9999';
    btn.textContent = 'Nelson ChatBot-IA';
    btn.style.background = theme.primary;
    btn.style.color = theme.usertext;
    btn.style.border = 'none';
    btn.style.borderRadius = '50px';
    btn.style.padding = '0.8rem 1.4rem';
    btn.style.fontWeight = '700';
    btn.style.boxShadow = `0 2px 8px ${theme.shadowLight}`;
    btn.style.cursor = 'pointer';
    // data attribs utiles
    btn.dataset.sessionId = session.id;

    return btn;
}

//  Création de la fenêtre de chat (simplifiée)
export function createChatWindow(theme: ColorTheme): HTMLDivElement {
    const chatWindow = document.createElement('div');
    chatWindow.id = 'chatbot-window';
    chatWindow.style.position = 'fixed';
    chatWindow.style.bottom = '90px';
    chatWindow.style.right = '32px';
    chatWindow.style.width = '320px';
    chatWindow.style.height = '420px';
    chatWindow.style.background = theme.background;
    chatWindow.style.borderRadius = `12px`;
    chatWindow.style.boxShadow = `0 4px 24px ${theme.shadow}`;
    chatWindow.style.display = 'none'; // caché par défaut
    chatWindow.style.flexDirection = 'column';
    chatWindow.style.overflow = 'hidden';
    chatWindow.style.zIndex = '10000';

    return chatWindow
}

// Création du header du chat
export function createChatHeader(theme: ColorTheme): HTMLDivElement {
    const header = document.createElement('div');
    header.style.background = theme.primary;
    header.style.color = theme.usertext;
    header.style.padding = '1rem';
    header.style.fontWeight = '700';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.innerHTML = '<span>Nelson ChatBot-IA</span>' 
    +'<span style="cursor: pointer; font-weight: 900;" id="chatbot-close">&#10005;</span>'; 

    return header;
}

// Création de la zone des messages
export function createMessagesContainer(theme: ColorTheme): HTMLDivElement {
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'chatbot-messages';
    messagesContainer.style.flex = '1';
    messagesContainer.style.padding = '1rem';   
    messagesContainer.style.background = theme.messagesBg;
    messagesContainer.style.overflowY = 'auto';

    return messagesContainer;
}

// Création  du chat input
export function createChatInput(theme: ColorTheme): HTMLDivElement {
    const inputArea = document.createElement('div');
    inputArea.style.display = 'flex';
    inputArea.style.padding = '0.8rem';
    inputArea.style.background = theme.background;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Écrire un message...';
    input.style.flex = '1';
    input.style.padding = '0.5rem';
    input.style.border = `1px solid ${theme.border}`;
    input.style.borderRadius = '6px';
    input.style.outline = 'none';
    inputArea.appendChild(input);

    const sendBtn = document.createElement('button');
    sendBtn.innerText = 'Envoyer';
    sendBtn.style.marginLeft = '0.5rem';
    sendBtn.style.background = theme.primary;
    sendBtn.style.color = theme.usertext;
    sendBtn.style.border = 'none';
    sendBtn.style.borderRadius = '6px';
    sendBtn.style.padding = '0.5rem 1rem';
    sendBtn.style.fontWeight = '700';
    sendBtn.style.cursor = 'pointer';

    inputArea.appendChild(sendBtn);

    return inputArea;
}