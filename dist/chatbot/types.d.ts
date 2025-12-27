export type ThemeName = 'blue' | 'red' | 'green' | 'dark';
export interface ColorTheme {
    primary: string;
    background: string;
    messagesBg: string;
    userBg: string;
    botBg: string;
    botText: string;
    border: string;
    shadow: string;
    shadowLight: string;
}
export interface ChatSession {
    id: string;
    startedAt: number;
}
//# sourceMappingURL=types.d.ts.map