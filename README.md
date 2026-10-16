# 🚀 GoMyCode Deployment Checkpoint — CloudOps Hub

> **Étudiant** : Darius Ange (Karma-22)  
> **Formation** : Full Stack Software Developer Bootcamp — GoMyCode  
> **Technologies** : Docker, Docker Compose, GitHub Actions CI/CD, Node.js, Express, Healthchecks, Cloud PaaS (Render / Railway / Azure)

---

## 🎯 Objectifs du Checkpoint

1. **Architecture de Production Complète** :
   - Serveur Express optimisé pour la production avec en-têtes de sécurité HTTP (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).
   - Gestion du CORS, compression, et arrêt gracieux (*graceful shutdown*) sur signaux `SIGTERM` et `SIGINT`.
2. **Conteneurisation Avancée avec Docker** :
   - `Dockerfile` multi-stage (builder + runner Alpine minimal) réduisant considérablement la taille de l'image.
   - Exécution sous utilisateur non-root (`USER node`) pour le durcissement de sécurité.
   - Sonde de santé intégrée (`HEALTHCHECK`) testant l'endpoint `/health` toutes les 30s.
3. **Orchestration Multi-Conteneurs** :
   - `docker-compose.yml` déclarant l'application et une instance MongoDB avec volumes persistants et réseau isolé.
4. **Pipeline CI/CD Automatisé** :
   - Workflow GitHub Actions (`.github/workflows/deploy.yml`) vérifiant les tests et la compilation Docker à chaque push.
5. **Monitoring & Télémétrie** :
   - Endpoints `/health`, `/api/ping`, `/api/info` et tableau de bord client avec monitoring de latence réseau en direct.
6. **Documentation & Guides de Déploiement** :
   - [DEPLOYMENT_GUIDE.md](file:///c:/Users/HP/Documents/logo/19-deployment-checkpoint/DEPLOYMENT_GUIDE.md) détaillant le déploiement sur Docker, Render, Railway et Azure App Service.

---

## 📁 Architecture

```
19-deployment-checkpoint/
├── .github/
│   └── workflows/
│       └── deploy.yml       # Pipeline CI/CD GitHub Actions
├── client/
│   └── dist/
│       └── index.html       # Dashboard de monitoring de déploiement
├── server/
│   └── index.js             # Serveur Express de production avec sondes de santé
├── tests/
│   └── deployment.test.js   # 7 tests unitaires et de conformité de déploiement
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml       # Orchestration locale App + MongoDB
├── Dockerfile               # Multi-stage production build
├── package.json
├── DEPLOYMENT_GUIDE.md      # Procédure de déploiement multi-cloud
└── README.md
```

---

## 🚀 Installation & Tests Locaux

```bash
# 1. Installer les dépendances
npm install

# 2. Exécuter la suite de tests automatisés
npm test

# 3. Démarrer le serveur de production
npm start
```
Accédez au dashboard sur [http://localhost:8080](http://localhost:8080).
