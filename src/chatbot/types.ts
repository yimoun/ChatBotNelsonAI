// Interfaces et types pour le chatbot
export type ThemeName = 'blue' | 'red' | 'green' | 'dark';

export type ColorTheme = {
    primary: string;
    background: string;
    messagesBg: string;
    userBg: string;
    usertext: string;
    botBg: string;
    botText: string;
    border: string;
    shadow: string;
    shadowLight: string;
}

export type ChatSession = {
    id: string;
    startedAt: number;
}