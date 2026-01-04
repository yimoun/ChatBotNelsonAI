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
   // Simulation: pour le moment le bot reponds juste ...
    addMessage('...', 'bot', messages, themeName);

   // le but plus tard sera d'appeler une vrai IA  via une API
   try {
       const res = await fetch('http://localhost:3000/chat', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({ text: userText }),
       });
       console.log("Réponse du serveur de notre API reçue :", res);
       if (!res.ok) {
           throw new Error('Network response was not ok');
       }

       const data = await res.json();
       messages.lastChild?.remove(); //On retire les "..." avant d'afficher la réponse du Bot
       addMessage(data.reply || 'Réponse indisponible', 'bot', messages, themeName);
       //TODO: Gérer les messages ou informations supplémentaires (ex: fichiers) dans la réponse
       if(data.extra) addMessage(data.extra, 'bot', messages, themeName);
   }
   catch (error) {
       messages.lastChild?.remove(); // On retire les "..." en cas d'erreur
       addMessage('Erreur serveur.', 'bot', messages, themeName);
       console.error("Erreur lors de la réponse du bot :", error);
   }
}


      
