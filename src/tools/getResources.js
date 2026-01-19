import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getHelpResources() {
  try {
    const filePath = path.join(__dirname, '../../db/resources.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    let response = `${data.title}\n\n${data.description}\n\n`;
    
    data.resources.forEach(resource => {
      switch (resource.type) {
        case 'link':
          response += `${resource.icon} **${resource.label}** : <a href="${resource.url}" target="_blank">${resource.text}</a>\n`;
          break;
        case 'contact':
          response += `${resource.icon} **${resource.label}** : ${resource.email} | Tél: ${resource.phone}\n`;
          break;
        case 'text':
          response += `${resource.icon} **${resource.label}** : ${resource.text}\n`;
          break;
        case 'download':
          response += `${resource.icon} **${resource.label}** : <a href="${resource.url}" target="_blank">${resource.text}</a>\n`;
          break;
      }
    });
    
    response += `\n${data.footer}`;
    return response;
    
  } catch (error) {
    console.error('Erreur lors de la lecture des ressources d\'aide:', error);
    return 'Désolé, je ne peux pas accéder aux ressources d\'aide pour le moment. Veuillez contacter support@shopex.com';
  }
}