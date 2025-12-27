export function createOpenButton(theme, session) {
    const btn = document.createElement('button');
    btn.id = 'chatbot-open-btn';
    btn.textContent = 'Nelson ChatBot-IA';
    btn.style.backgroundColor = theme.primary;
    btn.style.color = '#fff';
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
//# sourceMappingURL=ui.js.map