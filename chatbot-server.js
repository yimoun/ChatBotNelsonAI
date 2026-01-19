import cors from 'cors';
import express from 'express';
import { config } from 'dotenv';
import axios from 'axios';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { isAccountIntent, normalizeText } from './helpers.js';
import {updateAddress} from './src/tools/userDB.js';
import { generateInvoicePDF, getOrderById } from './src/tools/orders.js';
import { getHelpResources } from './src/tools/getResources.js';


config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de l'Application app
app.use(cors());
app.use(express.json());
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));


// Trois constantes pour l'API de Groq
const GROQ_API_URL = process.env.GROQ_API_URL;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL;
const loggedUserId = 1; // Simuler un utilisateur connecté avec l'ID 1

//système de gestion des demandes incomplètes
const pendingRequests = new Map();

// Nettoyage automatiques des demanndes expirées (5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, { request }] of pendingRequests.entries()) {
    if (now - request.timestamp > 300000) { // 5 minutes
      pendingRequests.delete(sessionId);
    }
  }
}, 60000); // Vérification toutes les minutes


if (!GROQ_API_URL || !GROQ_API_KEY || !GROQ_MODEL) {
  console.error('Missing GROQ configuration in environment variables.');
  process.exit(1);
}

// Systeme de gestion des demandes incomplètes

// Route /fetch-doc pour récupérer la documentation
app.get('/fetch-doc', async (req, res) => {
  exec('node src/tools/fetchDocumentation.js', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error('Error fetching documentation:', error);
      res.status(500).send('erreur lors de la récupération de documentation');
      return;
    }
    res.json({ doc: stdout });
  });
});

// Route /fetchDelivery pour récupérer les frais de livraison dynamiquement
app.get('/fetch-delivery', async (req, res) => {
  exec('node src/tools/fetchDeliveryPrices.js', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send('erreur lors de la récupération des frais de livraison');
      return;
    }
    res.json({ delivery: stdout });
  });
});

// Route / chat pour générer les réponses du bot IA
 // Juste générer une répônse pour un début
app.post('/chat', async (req, res) => { 
  const userMsg = req.body.message;
  console.log('userMsg content', userMsg);
  const sessionId = req.body.sessionId || 'default';

  if(!userMsg) return res.status(400).json({ error: 'Message manquant' });

  console.log("req.body", req.body);

  let botReply;

  try {
  // Vérification des demandes en attente
          if (pendingRequests.has(sessionId)) {
              const pending = pendingRequests.get(sessionId);
              if (pending.type === 'invoice') {
                  // L'utilisateur répond avec le numéro de commande
                  const orderMatch = userMsg.match(/\d+/);
                  if (orderMatch) {
                      const orderId = parseInt(orderMatch[0]);
                      
                      pendingRequests.delete(sessionId); // Supprimer la demande en attente
                      
                      // Traiter la facture
                      try {            
                          const invoicesDir = path.join(__dirname, 'invoices');
                          if (!fs.existsSync(invoicesDir)) {
                            fs.mkdirSync(invoicesDir, { recursive: true });
                          }
                          const outputPath = path.join(invoicesDir, `invoice_${orderId}.pdf`);
                          let generateResult = generateInvoicePDF(loggedUserId, orderId, outputPath);
                          console.log('generateResult:', generateResult);
                          if(generateResult === false) {
                            botReply = 'Vous n\'êtes pas autorisé à accéder à cette facture.';
                          }
                          else {
                            botReply = `La facture pour la commande ${orderId} est générée. Vous pouvez la télécharger ici : <a href="/invoices/invoice_${orderId}.pdf" target="_blank">Télécharger la facture PDF</a>`;
                          }
                          // Retourner la réponse immédiatement
                          return res.json({ reply: botReply });
                        
                      } catch (e) {
                          return res.json({ reply: 'Erreur lors de la génération de la facture. Vérifiez que le numéro de commande existe.' });
                      }
                  } else {
                      return res.json({ reply: 'Je n\'ai pas trouvé de numéro dans votre message. Pouvez-vous me donner le numéro de votre commande ?' });
                  }
              }
          }
    let messages;

    if(req.body.documentation) {

       messages = [
        // Prompt system
        {
          role:'system', 
          content:
          'Tu es un assistant utile pour un site de e-commerce qui s\'appelle ShopEx et qui vend des produits high-tech. ' +
          'utilise la documentation fournie pour répondre répondre précisement à la question de l\'utilisateur.' +
          ' Ne propose pas d\'utiliser un outil, répond directement.' 
        },
        {
            role: 'system',
            content: 'Documentation du site:\n' + req.body.documentation
        },
        // Prompt user
        {
          role: 'user',
          content: userMsg
        }
           ];

    }else if(req.body.delivery) {
       messages = [
        // Prompt system
        {
          role:'system', 
          content:
          'Tu es un assistant utile pour un site de e-commerce qui s\'appelle ShopEx et qui vend des produits high-tech. ' +
          'utilise les informations sur les frais de livraison fournies pour répondre répondre précisement à la question de l\'utilisateur.' +
          ' Ne propose pas d\'utiliser un outil, répond directement.' 
        },
        {
          role: 'system',
          content: 'Informations sur les frais de livraison:\n' + req.body.delivery
        },
        // Prompt user
        {
          role: 'user',
          content: userMsg
        }
       ];
    //Scénario central: sans utilisation d\'outil
      } else {
          messages = [
        // Prompt system
        {
          role:'system',
          content: 
              'Tu es un assistant utile pour un site e-commerce qui s appelle ShopEx et qui vend des produits high tech.\n\n' +
            '- Si l\'utilisateur pose une question relative à la navigation sur le site, la création ou gestion de compte, l\'achat, la commande, le paiement ou la livraison, tu dois répondre exactement : {"tool":"documentation"} et rien d\'autre.\n\n' +
            '- Si la question concerne les frais de livraison, tu dois répondre exactement : {"tool":"delivery"} et rien d\'autre.\n\n' +
            '- Si l\'utilisateur demande à changer son adresse, tu dois répondre exactement : {"tool":"updateAddress", "userId":1, "value":"NOUVELLE_ADRESSE"} en adaptant la valeur.\n\n' +
            '- Si l\'utilisateur demande la facture d\'une commande avec un numéro précis (ex: "envoie-moi la facture de la commande 101"), tu dois répondre exactement : {"tool":"invoice", "id":NUMERO_COMMANDE} en adaptant le numéro.\n\n' +
            '- Si l\'utilisateur demande une facture sans préciser le numéro (ex: "je veux ma facture", "envoie-moi ma facture", "facture de ma dernière commande"), tu dois répondre exactement : {"tool":"askOrderId"} et rien d\'autre.\n\n' +
            '- Si l\'utilisateur signale un bug, un problème technique, un dysfonctionnement ou une erreur sur le site, tu dois répondre exactement : {"tool":"bugReport", "message":"MESSAGE_UTILISATEUR"} en remplaçant MESSAGE_UTILISATEUR par le message complet de l\'utilisateur.\n\n' +
            '- Si l\'utilisateur demande de l\'aide générale, des ressources, de la documentation, un guide, un tutoriel, ou des contacts (ex: "j\'ai besoin d\'aide", "où trouver de la doc ?", "comment vous contacter ?", "avez-vous des tutos ?"), tu dois répondre exactement : {"tool":"help"} et rien d\'autre.\n\n' +
            'Sinon, réponds normalement.'
         },
        // Prompt user
        {
          role: 'user',
          content: userMsg
        }
           ];
    }

    // On obtient la réponse en faisant un appel POST à l'API de Groq
    const response = await axios.post(GROQ_API_URL, {
      model: GROQ_MODEL,
      messages,
      temperature: 0,      // plus déterministe
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Groq raw response:', JSON.stringify(response.data, null, 2));

    let botReply = response.data.choices[0].message.content;
    console.log('Bot reply before tool handling:', botReply);
    let extraMsg = null; // Pour gerer les messages ou informations supplémentaires
    let toolUsed = false; // Flag pour savoir si un outil a été utilisé

    //Gestion des outils

    // Changement de l'adresse
    if(botReply.startsWith('{"tool":"updateAddress"')) {
      toolUsed = true;
      try {
        
        const toolObj = JSON.parse(botReply.replace(/'/g, '"'));
        if(toolObj.id !== loggedUserId) {
          botReply = 'Vous n\'êtes pas autorisé à mettre à jour l\'adresse d\'un autre utilisateur.';
        }
        else {
           let updateResult ;
        if(toolObj.tool === 'updateAddress' && toolObj.id && toolObj.value) {
          updateResult = updateAddress(toolObj.id, toolObj.value);
        }
        
        if(updateResult === true) {
          botReply = `Adresse mise à jour avec succès pour l'utilisateur ID ${toolObj.id}.`;
        } else {
          botReply = `Échec de la mise à jour de l'adresse pour l'utilisateur ID ${toolObj.id}.`;
        }
        }


       
      } catch (err) {
        console.error('Error parsing updateAddress response:', err);
        botReply = 'Erreur lors de la mise à jour de l\'adresse.';
      }
    }
    else if(botReply.startsWith('{"tool":"invoice"')) {
      toolUsed = true;
      try {
        const toolObj = JSON.parse(botReply.replace(/'/g, '"'));
        if(toolObj.tool === 'invoice' && toolObj.id) {
          // Générer la facture PDF
          const orderId = toolObj.id;
          const invoicesDir = path.join(__dirname, 'invoices');
          if (!fs.existsSync(invoicesDir)) {
            fs.mkdirSync(invoicesDir, { recursive: true });
          }
          const outputPath = path.join(invoicesDir, `invoice_${orderId}.pdf`);
          let generateResult = generateInvoicePDF(loggedUserId, orderId, outputPath);
          console.log('generateResult:', generateResult);
          if(generateResult === false) {
            botReply = 'Vous n\'êtes pas autorisé à accéder à cette facture.';
          }
          else {
             botReply = `La facture pour la commande ${orderId} est générée. Vous pouvez la télécharger ici : <a href="/invoices/invoice_${orderId}.pdf" target="_blank">Télécharger la facture PDF</a>`;
          }
         
        }
      } catch(err) {
        console.error('Error parsing invoice response:', err);
        botReply = 'Erreur lors de la génération de la facture.';
      }
    }
    else if (botReply.startsWith('{"tool":"askOrderId"')) {
        toolUsed = true; 
      // Demande le numéro de commande pour générer la facture
        pendingRequests.set(sessionId, { type: 'invoice', timestamp: Date.now() });
        botReply = 'Pour générer votre facture, merci de me donner le numéro de votre commande.';
        // Retourner immédiatement pour éviter de continuer l'exécution
        return res.json({ reply: botReply });
    }
    else if (botReply.startsWith('{"tool":"bugReport"')) {
                let toolObj;
                try {
                    toolObj = JSON.parse(botReply.replace(/'/g, '"'));
                } catch (e) {
                    // Extraction simple du message utilisateur si le JSON est mal formé
                    const match = botReply.match(/"message"\s*:\s*"([^"]+)"/);
                    toolObj = { tool: 'bugReport', message: match ? match[1] : userMsg };
                }
                if (toolObj.tool === 'bugReport' && toolObj.message) {
                    const webhookUrl = 'https://discord.com/api/webhooks/1462834415490174998/JvRtbLeQEt1Rx2taT4sUliV4rlqD6GvK6IRkl_IbOguoQ2ucO5UXnOKN23fb09Vy1T0V'; // Remplacez par votre URL de webhook Discord
                    // Nettoie le message pour éviter les problèmes avec Discord
                    const cleanMessage = toolObj.message.replace(/```/g, '').replace(/`/g, '').substring(0, 1900);
                    const payload = {
                        content: `🐛 **Nouveau rapport de bug**\n\`\`\`\n${cleanMessage}\n\`\`\``,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    try {
                        await axios.post(webhookUrl, payload);
                        botReply = 'Merci pour votre signalement ! Notre équipe technique a été notifiée et va examiner le problème rapidement.';
                    } catch (e) {
                        console.error('Erreur bugReport Discord:', e.message);
                        botReply = 'Merci pour votre signalement ! J\'ai bien noté votre problème et notre équipe va s\'en occuper.';
                    }
                }
    }
    else if (botReply.startsWith('{"tool":"help"') || botReply.trim() === '{"tool":"help"}') {
        toolUsed = true;
        // Lire et afficher les ressources d'aide depuis le fichier
        botReply = getHelpResources();
    }
    

    // Détecter les autres outils
    if(botReply === '{"tool":"documentation"}' || botReply === '{"tool":"delivery"}') {
      toolUsed = true;
    }
    
    //Injecter tuto vidéo si applicable (seulement si aucun outil n'a été utilisé)
    //Une analyse sémantique du UserMsg (on aurait pu utiliser une IA pour cela)
    // liste de patterns / synonymes prioritaires
    if(!toolUsed) {
      const patterns = [
        'creer un compte', 'creer compte', 'ouvrir un compte', 'ouvrir compte',
        'inscription', 'sinscrire', "s'inscrire", 'creer compte', 'creer un profil',
        'connexion', 'se connecter', 'mot de passe', 'mdp', 'changer mot de passe', 'reset password',
        'compte'
      ];
      const lowerMsg = userMsg.toLowerCase();
      if (isAccountIntent(lowerMsg, patterns)) {
        extraMsg = 'Cette vidéo pourrait vous intéresser :<br><video src="./videos/create-account.mp4" controls style="width:100%;max-width:320px;"></video>';
      } else if (/changer mon mot de passe|modifier mon mot de passe|changer de mot de passe|changement mot de passe/.test(normalizeText(userMsg))) {
        extraMsg = 'Cette vidéo pourrait vous intéresser :<br><video src="./videos/change-password.mp4" controls style="width:100%;max-width:320px;"></video>';
      }
    }
        // if (/créer un compte|ouvrir un compte|inscription/.test(lowerMsg)) {
        //     extraMsg = 'Cette vidéo pourrait vous intéresser :<br><video src="./videos/create-account.mp4" controls style="width:100%;max-width:320px;"></video>';
        // } else if (/changer mon mot de passe|modifier mon mot de passe|changer de mot de passe|changement mot de passe/.test(lowerMsg)) {
        //     extraMsg = 'Cette vidéo pourrait vous intéresser :<br><video src="./videos/change-password.mp4" controls style="width:100%;max-width:320px;"></video>';
        // }

     if (extraMsg) {
            res.json({ reply: botReply, extra: extraMsg });
        } else {
            res.json({ reply: botReply });
        }
  } catch (error) {
    console.log('Error fetching response from Groq API:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

const PORT = process.env.PORT || 3000;
// Démarrage du serveur sur le port 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
