import cors from 'cors';
import express from 'express';
import { config } from 'dotenv';
import axios from 'axios';


config();
const app = express();

// Configuration de l'Application app
app.use(cors());
app.use(express.json());

// Trois constantes pour l'API de Groq
const GROQ_API_URL = process.env.GROQ_API_URL!;
const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const MODEL = process.env.GROQ_MODEL!;

// Création des différentes routes 
// Route / chat pour générer les réponses du bot IA
 // Juste générer une répônse pour un début
app.post('/chat', async (req, res) => {
  const userMsg = req.body.message;
  const sessionID = req.body.sessionId || 'default';

  if(!userMsg) return res.status(400).json({ error: 'Message manquant' });

  try {
    let messages;

    messages = [
        // Prompt system
        {
            role:'system', 
            content: 'Tu es un assistant utile pour un site de e-commerce qui s\'appelle ShopEx et qui vend des produits high-tech.'
        },
        // Prompt user
        {
            role: 'user',
            content: userMsg
        }
    ];

    // On obtient la réponse en faisant un appel POST à l'API de Groq
    const response = await axios.post(GROQ_API_URL, {
      model: MODEL,
      messages: [{ role: 'user', content: userMsg }],
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

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
