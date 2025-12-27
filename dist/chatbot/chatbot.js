// entrée publique : init/start
import { colorThemes } from './themes';
import { createOpenButton } from './ui';
export function initChatbot(options) {
    const themeName = options?.theme ?? 'blue';
    const theme = (colorThemes[themeName] ?? colorThemes.blue);
    const session = { id: 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11), startedAt: Date.now() };
    const btn = createOpenButton(theme, session);
    document.body.appendChild(btn);
    // event listeners et logique supplémentaires ici
    btn.addEventListener('click', () => {
        console.log('Open chat for', session.id);
        // ouvrir UI, initialiser connexion, etc.
    });
    return { session, btn };
}
// export par défaut si tu préfères
export default initChatbot;
//# sourceMappingURL=chatbot.js.map