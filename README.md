# ⚡ GoMyCode REST API Checkpoint — UserPulse API

> **Étudiant** : Darius Ange (Karma-22)  
> **Formation** : Full Stack Software Developer Bootcamp — GoMyCode  
> **Technologies** : Node.js, Express.js, MongoDB, Mongoose ODM, Dotenv, Supertest

---

## 🎯 Objectifs Réalisés

Ce projet implémente une API REST complète respectant les standards de l'industrie avec Express.js et Mongoose :

1. **Serveur Express & Variables d'Environnement** :
   - Chargement dynamique de `PORT` et `MONGO_URI` via le module `dotenv`.
   - Middleware natif pour le parsing JSON et URL-encoded.
2. **Modèle de Données User** (`models/User.js`) :
   - `name`: Chaîne de caractères obligatoire.
   - `email`: Chaîne unique avec validation regex du format email.
   - `age`: Nombre entier positif.
   - `role`: Enumération `user` ou `admin`.
   - `timestamps`: Génération automatique de `createdAt` et `updatedAt`.
3. **4 Routes CRUD Fondamentales** :
   - `GET /api/users` : Retourne la liste complète de tous les utilisateurs triés par date.
   - `POST /api/users` : Crée et persiste un nouvel utilisateur avec validation des doublons.
   - `PUT /api/users/:id` : Met à jour un utilisateur existant via son identifiant MongoDB.
   - `DELETE /api/users/:id` : Supprime un utilisateur existant par son identifiant.
4. **Interface d'Exploration Web Interactive** :
   - Dashboard moderne en Dark Glassmorphism accessible sur la racine `/`.
   - Permet de tester visuellement les 4 verbes HTTP en direct dans le navigateur.
5. **Tests d'Intégration & Validation** :
   - 7 tests automatisés couvrant les schémas, validations, codes HTTP (200, 201, 400, 404, 409).

---

## 📁 Architecture du Projet

```
18-rest-api-checkpoint/
├── models/
│   └── User.js              # Schéma Mongoose et règles de validation
├── routes/
│   └── userRoutes.js        # Contrôleurs et routes CRUD /api/users
├── public/
│   └── index.html           # Interface utilisateur Dashboard REST API
├── tests/
│   └── users.test.js        # Suite de tests unitaires et d'intégration
├── .env.example
├── .gitignore
├── package.json
├── server.js                # Point d'entrée de l'application
└── README.md
```

---

## 🚀 Installation & Démarrage

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration des variables d'environnement
Copiez `.env.example` en `.env` :
```bash
cp .env.example .env
```

### 3. Démarrer le serveur
```bash
npm start
```
Accédez au dashboard sur [http://localhost:5000](http://localhost:5000).

### 4. Lancer les tests
```bash
npm test
```
