// Interpreteur markdown simple pour les messages du chatbot
    export function parseMarkdown(md: string): string {
        let html = md;
        // Titres
        html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
        // Gras
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italique
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Souligné
        html = html.replace(/__(.*?)__/g, '<u>$1</u>');
        // Barré
        html = html.replace(/~~(.*?)~~/g, '<s>$1</s>');
        // Liens
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
        // Listes à puces
        html = html.replace(/(^|\n)- (.*)/g, '$1<li>$2</li>');
        // Regroupe les <li> consécutifs en <ul>
        html = html.replace(/(<li>.*?<\/li>(?:<br>?<li>.*?<\/li>)*)/g, function(m) {
            return '<ul>' + m.replace(/<br>/g, '') + '</ul>';
        });
        // Listes numérotées (rendu en <ul> comme les puces)
        html = html.replace(/(^|\n)(\d+)\. (.*)/g, '$1<li>$3</li>');
        // Regroupe toutes les <li> consécutifs en <ul>
        html = html.replace(/(<li>.*?<\/li>(?:<br>?<li>.*?<\/li>)*)/g, function(m) {
            return '<ul>' + m.replace(/<br>/g, '') + '</ul>';
        });
        // Sauts de ligne
        html = html.replace(/\n/g, '<br>');
        return html;
    }
