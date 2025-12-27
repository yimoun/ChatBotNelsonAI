import { parseMarkdown } from "./helpers";
import type { ColorTheme } from "./types";
import { ColorThemes } from "./themes";
//Envoi de message
export async function sendMessage(input: HTMLInputElement, messages: HTMLDivElement, themeName: string, message?: string): Promise<void> {
    const text = input.value.trim();
    
    if (text === '') return;
    addMessage(text, 'user', messages, themeName);
    input.value = '';

    await botReply(text, messages, themeName);
    console.log("Message envoyé :", text);
}

//Ajout de message dans la fenêtre de chat
export function addMessage(
    text: string,
    from: 'user' | 'bot',
    messages: HTMLDivElement,
    themeName: string = 'blue'
): HTMLDivElement {
    const msg = document.createElement('div');
    msg.style.marginBottom = '0.7rem';
    msg.style.textAlign = from === 'user' ? 'right' : 'left';

    let content = from === 'bot' ? parseMarkdown(text) : text;
    const colorThemes: Record<string, ColorTheme> = ColorThemes;
    const theme: ColorTheme = (colorThemes[themeName] ?? colorThemes['blue']) as ColorTheme;
    const bgcolor = from === 'user' ? theme.userBg : theme.botBg;
    const textcolor = from === 'user' ? theme.usertext : theme.botText;
    msg.innerHTML = `<span style="background: ${bgcolor}; color: ${textcolor};` +
                    `padding: 0.5rem 1rem; border-radius: 16px; display:`+ 
                     `inline-block;max-width:80%;">${content}</span>`;

    messages.appendChild(msg);
    // Scroll vers le bas
    messages.scrollTop = messages.scrollHeight;

    return msg;
}

export async function botReply(userText: string, messages: HTMLDivElement, themeName: string): Promise<void> {
   addMessage('...', 'bot', messages, themeName);

   // le but plus tard sera d'appeler une vrai IA  via une API
}
