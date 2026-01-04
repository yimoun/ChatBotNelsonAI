import cors from 'cors';
import express from 'express';
import { config } from 'dotenv';
import axios from 'axios';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';


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
  const userMsg = req.body.text;
  console.log('userMsg content', userMsg);
  const sessionID = req.body.sessionId || 'default';

  if(!userMsg) return res.status(400).json({ error: 'Message manquant' });

  try {
    let messages;

    messages = [
        // Prompt system
        {
            role:'system', 
            content:
          'Tu es un assistant utile pour un site de e-commerce qui s\'appelle ShopEx et qui vend des produits high-tech. ' +
          'Si l\'utilisateur pose une question relative à la navigation sur le site, la création ou la gestion de compte, l\'achat, la commande, le paiement ou la livraison, tu dois répondre EXACTEMENT avec un objet JSON seul, par exemple {"tool":"documentation"} ou {"tool":"delivery"} selon le cas — aucune explication supplémentaire, rien d\'autre. ' +
          'Si la question concerne les frais de livraison, réponds exactement {"tool":"delivery"}. ' +
          'Si la question concerne la création/gestion de compte ou navigation, réponds exactement {"tool":"documentation"}. ' +
          'Si la question ne correspond à ces cas, réponds normalement en texte.'

        },
        // Prompt user
        {
            role: 'user',
            content: userMsg
        }
    ];

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

    const botReply = response.data.choices[0].message.content;
    res.json({ reply: botReply });
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
