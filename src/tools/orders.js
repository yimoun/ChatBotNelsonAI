// ordersDB.js : Fonctions pour accéder aux commandes et générer une facture PDF
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../db/orders.json');

const getOrderById = (id) => {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return data.orders.find(o => o.id === id);
}

const generateInvoicePDF = (loggedUserId,id, outputPath) => {
    const order = getOrderById(id);
    if (!order) throw new Error('Commande introuvable');
    if(order.userId !== loggedUserId) return false;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(outputPath));

    doc.fontSize(20).text('Facture', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Numéro de commande : ${order.id}`);
    doc.text(`Utilisateur : ${order.userId}`);
    doc.text(`Date : ${order.date}`);
    doc.text(`Statut : ${order.status}`);
    doc.moveDown();
    doc.text('Articles :');
    order.items.forEach(item => {
        doc.text(`- ${item.name} x${item.qty} : ${item.price.toFixed(2)}€`);
    });
    doc.moveDown();
    doc.fontSize(14).text(`Total : ${order.total.toFixed(2)}€`, { align: 'right' });
    doc.end();
}

export { getOrderById, generateInvoicePDF };
