// CRUD POUR LES COMMANDES

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../db/orders.json');

// Fonction pour lire la base de données des commandes
const readDB = () => {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  return data.orders || [];
};

// Lire une commande par ID
const getOrderById = (orderId) => {
  const db = readDB();
  return db.find(order => order.orderId === parseInt(orderId));
};

// Générer une facture formatée
const generateInvoice = (orderId) => {
  const order = getOrderById(orderId);
  
  if (!order) {
    return null;
  }

  let invoice = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  invoice += `           🧾 FACTURE SHOPEX\n`;
  invoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  invoice += `📋 Commande N° : ${order.orderId}\n`;
  invoice += `👤 Client ID    : ${order.userId}\n`;
  invoice += `📅 Date         : ${order.date}\n`;
  invoice += `📦 Statut       : ${order.status}\n\n`;
  invoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  invoice += `ARTICLES\n`;
  invoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  order.items.forEach(item => {
    invoice += `📦 ${item.name}\n`;
    invoice += `   Quantité : ${item.qty} x ${item.price.toFixed(2)}€\n`;
    invoice += `   Sous-total : ${(item.qty * item.price).toFixed(2)}€\n\n`;
  });
  
  invoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  invoice += `💰 TOTAL : ${order.total.toFixed(2)}€\n`;
  invoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  invoice += `Merci de votre confiance ! 🙏\n`;
  
  return invoice;
};

export {
  getOrderById,
  generateInvoice
};
