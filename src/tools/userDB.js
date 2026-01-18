// CRUD POUR LES UTILISATEURS

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../db/usersDB.json');

// Fonction pour lire la base de données des utilisateurs
const readDB = () => {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  return data.users || [];
};

// Fonction pour écrire dans la base de données des utilisateurs
const writeDB = (data) => {
  const dbContent = { users: data };
  fs.writeFileSync(dbPath, JSON.stringify(dbContent, null, 2), 'utf-8');
};

// Créer un nouvel utilisateur
const createUser = (user) => {
  const db = readDB();
  db.push(user);
  writeDB(db);
};

// Supprimer un utilisateur par ID
const deleteUserById = (id) => {
  let db = readDB();
  db = db.filter(user => user.id !== id);
  writeDB(db);
};

// Lire un utilisateur par ID
const getUserById = (id) => {
  const db = readDB();
  return db.find(user => user.id === id);
};

// Mettre à jour un utilisateur par ID
const updateUserById = (id, updatedInfo) => {
  const db = readDB();
  const userIndex = db.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    db[userIndex] = { ...db[userIndex], ...updatedInfo };
    writeDB(db);
    return db[userIndex];
  }
  return null;
};

// Mettre à jour l'adress de l'utilisateur 
const updateAddress = (id, value) => {
  const db = readDB();
  const userIndex = db.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    db[userIndex].address = value;
    writeDB(db);
    return true;
  }
  return false;
};

export {
  createUser,
  deleteUserById,
  getUserById,
  updateUserById, 
  updateAddress
};
