// const colorThemes export
import type { ColorTheme } from './types';

export const ColorThemes: Record<string, ColorTheme> = {
    blue: {
        primary: '#2d6cdf',
        background: '#fff',
        messagesBg: '#f6f7fb',
        userBg: '#2d6cdf',
        usertext: '#fff',   
        botBg: '#eee',
        botText: '#222',
        border: '#eee',
        shadow: 'rgba(45, 108, 223, 0.15)',
        shadowLight: 'rgba(45, 108, 223, 0.1)'
    },
     red: {
            primary: '#ff4d4f',
            background: '#fff',
            messagesBg: '#f6f7fb',
            userBg: '#ff4d4f',
            usertext: '#fff',
            botBg: '#eee',
            botText: '#222',
            border: '#eee',
            shadow: 'rgba(255, 77, 79, 0.15)',
            shadowLight: 'rgba(255, 77, 79, 0.1)'
        },
        green: {
            primary: '#52c41a',
            background: '#fff',
            messagesBg: '#f6f7fb',
            userBg: '#52c41a',
            usertext: '#fff',
            botBg: '#eee',
            botText: '#222',
            border: '#eee',
            shadow: 'rgba(82, 196, 26, 0.15)',
            shadowLight: 'rgba(82, 196, 26, 0.1)'
        },
        dark: {
            primary: '#1d1d1d',
            background: '#fff',
            messagesBg: '#f6f7fb',
            userBg: '#1d1d1d',
            usertext: '#fff',
            botBg: '#eee',
            botText: '#222',
            border: '#eee',
            shadow: 'rgba(29, 29, 29, 0.15)',
            shadowLight: 'rgba(29, 29, 29, 0.1)'
        }
};