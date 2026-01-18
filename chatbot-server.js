import cors from 'cors';
import express from 'express';
import { config } from 'dotenv';
import axios from 'axios';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { isAccountIntent, normalizeText } from './helpers.js';
import {updateUserById, getUserById, createUser, deleteUserById, updateAddress} from './src/tools/userDB.js';


config();
const app = express();

// Configuration de l'Application app
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Trois constantes pour l'API de Groq
const GROQ_API_URL = process.env.GROQ_API_URL;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL;

const loggedUserId = 1; // Simuler un utilisateur connecté avec l'ID 1

if (!GROQ_API_URL || !GROQ_API_KEY || !GROQ_MODEL) {
  console.error('Missing GROQ configuration in environment variables.');
  process.exit(1);
}


// Création des différentes routes 

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
  const sessionID = req.body.sessionId || 'default';

  if(!userMsg) return res.status(400).json({ error: 'Message manquant' });

  console.log("req.body", req.body);

  try {
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
          'Tu es un assistant utile pour un site de e-commerce qui s\'appelle ShopEx et qui vend des produits high-tech. ' +
          'Si l\'utilisateur pose une question relative à la navigation sur le site, la création ou la gestion de compte, l\'achat, la commande, le paiement ou la livraison, tu dois répondre EXACTEMENT avec un objet JSON seul, par exemple {"tool":"documentation"} ou {"tool":"delivery"} selon le cas — aucune explication supplémentaire, rien d\'autre. \n\n' +
          'Si la question concerne les frais de livraison, réponds exactement {"tool":"delivery"}. ' +
          'Si la question concerne la création/gestion de compte ou navigation, réponds exactement {"tool":"documentation"}. ' +
          'Si l\'utilisateur demande à changer son adresse, tu dois répondre exactement {"tool":"updateAddress", "id":1, "value":"NOUVELLE_ADRESSE"} en adapatant la valeur. \n\n' +
          'Si la question ne correspond à ces cas, réponds normalement en texte.'
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
