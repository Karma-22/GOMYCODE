# 🍃 GoMyCode Mongoose & NodeJS VS MongoDB Checkpoint

> **Étudiant** : Darius Ange (Karma-22)  
> **Formation** : Full Stack Software Developer Bootcamp — GoMyCode  
> **Technologies** : Node.js, Mongoose ODM, MongoDB, MongoMemoryServer, Node:test

---

## 🎯 Objectifs Réalisés

Ce projet implémente l'ensemble des 10 opérations fondamentales de modélisation et de manipulation de données avec **Mongoose** :

1. **Schéma Person** : Définition avec types stricts (`name`: String required, `age`: Number, `favoriteFoods`: [String]).
2. **`createAndSavePerson`** : Instanciation d'un document via `new Person()` et persistance avec `.save()`.
3. **`createManyPeople`** : Création groupée de documents avec `Person.create(arrayOfPeople)`.
4. **`findPeopleByName`** : Recherche multi-documents par critère `Person.find({ name })`.
5. **`findOneByFood`** : Recherche d'un document unique avec `Person.findOne({ favoriteFoods })`.
6. **`findPersonById`** : Recherche par identifiant MongoDB natif `Person.findById(personId)`.
7. **`performClassicUpdate`** : Mise à jour classique (Recherche par `_id`, modification du tableau avec `.push()`, puis `.save()`).
8. **`performNewUpdate`** : Mise à jour atomique avec `Person.findOneAndUpdate({ name }, { age: 20 }, { new: true })`.
9. **`removeById`** : Suppression d'un document unique par identifiant `Person.findByIdAndDelete()`.
10. **`removeManyMary`** : Suppression groupée avec `Person.deleteMany({ name: 'Mary' })`.
11. **`queryChain`** : Requête chaînée avec helpers Mongoose :
    - Filtre sur `favoriteFoods: 'burritos'`
    - Tri alphabétique sur le champ `name` (`.sort({ name: 1 })`)
    - Limitation aux 2 premiers résultats (`.limit(2)`)
    - Exclusion du champ `age` (`.select('-age')`)
    - Exécution finale via `.exec()`

---

## 📁 Architecture

```
17-mongoose-checkpoint/
├── models/
│   └── Person.js             # Modèle et Schéma Mongoose Person
├── services/
│   └── personService.js      # Les 10 fonctions de manipulation CRUD et requêtes chaînées
├── tests/
│   └── mongoose.test.js      # Suite de 10 tests unitaires complets
├── .env.example              # Modèle de variables d'environnement
├── .gitignore
├── index.js                  # Script de démonstration exécutable
├── package.json
└── README.md
```

---

## 🚀 Installation & Exécution

### 1. Installation des modules
```bash
npm install
```

### 2. Lancer la démonstration interactive
```bash
npm start
```
*Note : Si aucun cluster distant n'est spécifié dans `.env`, un serveur MongoDB en mémoire local s'initialise automatiquement pour exécuter toute la démo sans aucune configuration externe.*

### 3. Lancer les tests unitaires
```bash
npm test
```
Tous les tests valident à 100% les 10 critères requis par GoMyCode.
