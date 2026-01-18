// // // Widget simple CHATBOT IA
// // (function() {
// //     // Palettes de couleurs
// //     const colorThemes = {
// //         blue: {
// //             primary: '#2d6cdf',
// //             background: '#fff',
// //             messagesBg: '#f6f7fb',
// //             userBg: '#2d6cdf',
// //             botBg: '#eee',
// //             botText: '#222',
// //             border: '#eee',
// //             shadow: 'rgba(45, 108, 223, 0.15)',
// //             shadowLight: 'rgba(45, 108, 223, 0.1)'
// //         },
// //         red: {
// //             primary: '#ff4d4f',
// //             background: '#fff',
// //             messagesBg: '#f6f7fb',
// //             userBg: '#ff4d4f',
// //             botBg: '#eee',
// //             botText: '#222',
// //             border: '#eee',
// //             shadow: 'rgba(255, 77, 79, 0.15)',
// //             shadowLight: 'rgba(255, 77, 79, 0.1)'
// //         },
// //         green: {
// //             primary: '#52c41a',
// //             background: '#fff',
// //             messagesBg: '#f6f7fb',
// //             userBg: '#52c41a',
// //             botBg: '#eee',
// //             botText: '#222',
// //             border: '#eee',
// //             shadow: 'rgba(82, 196, 26, 0.15)',
// //             shadowLight: 'rgba(82, 196, 26, 0.1)'
// //         },
// //         dark: {
// //             primary: '#1d1d1d',
// //             background: '#fff',
// //             messagesBg: '#f6f7fb',
// //             userBg: '#1d1d1d',
// //             botBg: '#eee',
// //             botText: '#222',
// //             border: '#eee',
// //             shadow: 'rgba(29, 29, 29, 0.15)',
// //             shadowLight: 'rgba(29, 29, 29, 0.1)'
// //         }

// //     } // Fin pallettes couleurs

// //     // Récupération du thème depuis le script
// //     const currentScript = document.currentScript;
// //     const requestedThemeRaw = currentScript?.getAttribute('theme');
// //     type ThemeName = keyof typeof colorThemes;
// //     const requestedTheme: ThemeName = (requestedThemeRaw && requestedThemeRaw in colorThemes)
// //         ? requestedThemeRaw as ThemeName
// //         : 'blue';
// //     const colors = colorThemes[requestedTheme];

// //     // Générer une sessionId unique pour cette session de chat
// //     const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// //     // Injection du bouton dans le DOM de la page
// //     document.body.appendChild(chatBtn);

// // })();

// import { colorThemes } from './themes';
// import { createOpenButton } from './ui';
// import type { ThemeName, ChatSession } from './types';

// export function generateSessionId(): string {
//     return 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
// }

// export function initChatbot(options?: { theme?: ThemeName }) {
//     const themeName = options?.theme ?? 'blue';
//     const theme = colorThemes[themeName] ?? colorThemes.blue;
//     const session: ChatSession = { id: generateSessionId(), startedAt: Date.now() };

//     const btn = createOpenButton(theme, session);
//     document.body.appendChild(btn);

//     btn.addEventListener('click', () => {
//         // ouvrir UI / initialiser connexion API etc.
//         console.log('Open chat for', session.id);
//     });

//     return { session, btn };
// }

// export default initChatbot;