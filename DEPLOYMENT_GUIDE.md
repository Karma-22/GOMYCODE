# 🚀 Guide Complet de Déploiement Cloud — GoMyCode

Ce guide décrit pas à pas la procédure de déploiement de l'application sur les principales plateformes cloud.

---

## 1. Déploiement avec Docker & Docker Compose (Local & VPS)

### Prérequis
- Docker Engine >= 20.10
- Docker Compose v2

### Commandes
```bash
# 1. Construire l'image Docker multi-stage
docker build -t gomycode-app:latest .

# 2. Démarrer l'infrastructure complète (App + MongoDB)
docker-compose up -d

# 3. Vérifier les logs et sondes de santé
docker-compose logs -f app
docker inspect --format='{{json .State.Health}}' gomycode_app
```
L'application est disponible sur `http://localhost:8080`.

---

## 2. Déploiement sur Render (PaaS)

1. Connectez votre compte GitHub sur [Render.com](https://render.com).
2. Cliquez sur **New +** -> **Web Service**.
3. Sélectionnez le dépôt `Karma-22/gomycode-deployment-checkpoint`.
4. Renseignez la configuration :
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node server/index.js`
5. Ajoutez les variables d'environnement dans l'onglet **Environment Variables** :
   - `NODE_ENV` = `production`
   - `PORT` = `8080`
   - `MONGO_URI` = `mongodb+srv://...` (votre cluster MongoDB Atlas)
6. Cliquez sur **Create Web Service**.

---

## 3. Déploiement sur Railway

1. Rendez-vous sur [Railway.app](https://railway.app).
2. Sélectionnez **Deploy from GitHub repo** -> `gomycode-deployment-checkpoint`.
3. Railway détecte automatiquement le `Dockerfile` et démarre la compilation conteneurisée.
4. Dans **Variables**, injectez `MONGO_URI` et `NODE_ENV=production`.
5. Générez un domaine public dans **Settings > Networking > Generate Domain**.

---

## 4. Déploiement sur Microsoft Azure App Service

1. Via le portail Azure ou Azure CLI :
```bash
# Créer le groupe de ressources
az group create --name gomycode-rg --location westeurope

# Créer le plan App Service Linux
az appservice plan create --name gomycode-plan --resource-group gomycode-rg --sku B1 --is-linux

# Déployer l'application conteneurisée
az webapp create --resource-group gomycode-rg --plan gomycode-plan --name gomycode-darius-app --deployment-container-image-name gomycode/deployment-checkpoint:latest
```
