import type { ChatSession } from "./types";
export declare function sendMessage(input: HTMLInputElement, messages: HTMLDivElement, themeName: string, chatSession?: ChatSession): Promise<void>;
export declare function addMessage(text: string, from: 'user' | 'bot', messages: HTMLDivElement, themeName?: string, chatSession?: ChatSession): HTMLDivElement;
export declare function botReply(userText: string, messages: HTMLDivElement, themeName: string, chatSession?: ChatSession): Promise<void>;
//# sourceMappingURL=utils.d.ts.map