# ChatBotNelsonAI
Ce repository contient tout ce qui est en lien avec le tuto sur Udemy
# 🤖 ChatBot IA E-commerce - ShopEx


## Description

ChatBot IA intelligent développé pour un site e-commerce fictif (ShopEx) qui vend des produits high-tech. Ce projet démontre l'intégration d'une IA générative avec des outils métiers concrets pour automatiser le support client et améliorer l'expérience utilisateur.

### 🎯 Objectifs du projet

- Créer un assistant conversationnel capable de comprendre le contexte utilisateur
- Intégrer l'IA avec des outils métiers (base de données, génération de documents, notifications)
- Implémenter un système de sécurité pour protéger les données sensibles
- Développer une architecture modulaire et maintenable

## ✨ Fonctionnalités principales

### 🔧 Outils IA (Tools)

1. **Documentation dynamique** 📚
   - Récupération automatique de la documentation depuis Notion
   - Réponses contextuelles basées sur la doc du site

2. **Calcul des frais de livraison** 🚚
   - Tarification dynamique selon le pays/région
   - Informations en temps réel

3. **Gestion du compte utilisateur** 👤
   - Modification d'adresse
   - Validation des autorisations

4. **Génération de factures PDF** 📄
   - Création automatique de factures
   - Vérification des droits d'accès
   - Téléchargement sécurisé

5. **Système de demandes incomplètes** 🔄
   - Gestion des conversations multi-étapes
   - Demande d'informations complémentaires
   - Expiration automatique après 5 minutes

6. **Signalement de bugs** 🐛
   - Envoi automatique vers Discord via webhook
   - Notification de l'équipe technique en temps réel

7. **Centre d'aide** 💡
   - Ressources d'aide (documentation, tutoriels, contacts)
   - Liens vers guides PDF et vidéos YouTube
   - Configuration depuis fichier JSON externe

8. **Tutoriels vidéo intégrés** 🎥
   - Injection contextuelle de vidéos dans le chat
   - Guides visuels pour créer un compte, changer mot de passe, etc.

## 🏗️ Architecture technique

### Stack technologique

**Backend :**
- Node.js / Express.js
- Groq API (LLM Claude Sonnet 4.5)
- Puppeteer (scraping de documentation)
- PDFKit (génération de factures)
- SQLite (base de données)

**Frontend :**
- HTML5 / CSS3 / JavaScript vanilla
- Fetch API pour les appels asynchrones
- Design responsive

**Sécurité :**
- Variables d'environnement (.env)
- Validation des autorisations utilisateur
- Protection contre les injections SQL
- Gestion des sessions

### Architecture modulaire

```
ChatBotNelsonAI-main/
├── chatbot-server.js          # Serveur Express principal
├── src/
│   ├── tools/
│   │   ├── fetchDocumentation.js   # Scraping Notion
│   │   ├── fetchDeliveryPrices.js  # Calcul livraison
│   │   ├── userDB.js               # Gestion BDD utilisateurs
│   │   ├── orders.js               # Gestion commandes + PDF
│   │   └── helpResources.js        # Ressources d'aide
│   └── data/
│       └── helpResources.json      # Config centre d'aide
├── public/
│   ├── index.html             # Interface chatbot
│   ├── chatbot.js             # Logique frontend
│   └── videos/                # Tutoriels vidéo
├── invoices/                  # Factures générées
└── .env                       # Variables d'environnement
```

## 🚀 Installation et démarrage

### Prérequis

- Node.js 18+ et npm
- Compte Groq (pour l'API Key)
- Git

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/ChatBotNelsonAI.git
cd ChatBotNelsonAI

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env et ajouter votre GROQ_API_KEY
```

### Configuration .env

```env
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_API_KEY=votre_clé_api_groq
GROQ_MODEL=llama-3.3-70b-versatile
PORT=3000
```

### Démarrage

```bash
# Lancer le serveur
npm start

# Le chatbot sera accessible sur http://localhost:3000
```

## 🧪 Tests et démonstration

### Scénarios de test

1. **Documentation :**
   - "Comment créer un compte ?"
   - "Comment passer une commande ?"

2. **Livraison :**
   - "Quels sont les frais de livraison pour la France ?"

3. **Gestion compte :**
   - "Change mon adresse en 15 rue de la Paix, Paris"

4. **Factures :**
   - "Envoie-moi la facture de la commande 101"
   - "Je veux ma facture" (demande le numéro)

5. **Aide :**
   - "J'ai besoin d'aide"
   - "Où trouver la documentation ?"

6. **Signalement :**
   - "Le site plante quand je clique sur payer"

## 📊 Points techniques avancés

### Gestion des outils (Tool Calling)

Le système détecte automatiquement l'intention de l'utilisateur et active l'outil approprié :

```javascript
// L'IA retourne un objet JSON structuré
{"tool":"invoice", "id":101}
{"tool":"updateAddress", "userId":1, "value":"nouvelle adresse"}
{"tool":"askOrderId"}
```

### Système de demandes incomplètes
### Génération de PDF dynamique

## 🎓 Compétences démontrées

- ✅ **IA & NLP** : Intégration LLM, prompt engineering, tool calling
- ✅ **Backend** : API REST, Express.js, architecture modulaire
- ✅ **Génération de documents** : PDFKit
- ✅ **Web scraping** : Puppeteer
- ✅ **Webhooks** : Intégration Discord
- ✅ **Architecture** : Séparation des responsabilités, code maintenable
- ✅ **Frontend** : JavaScript vanilla, Fetch API, responsive design

## 📈 Améliorations futures

- [ ] Authentification JWT
- [ ] Base de données PostgreSQL
- [ ] Tests unitaires et d'intégration (Jest)
- [ ] Docker containerization
- [ ] CI/CD avec GitHub Actions
- [ ] Analytics et métriques utilisateur
- [ ] Rate limiting et cache Redis
