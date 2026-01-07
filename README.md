# Fitness Workout Manager

Une application backend complète pour la gestion d'exercices, de workouts et d'utilisateurs, construite avec Node.js, Express, MongoDB et PostgreSQL.

## Fonctionnalités

### Exercices

- Création et gestion d'exercices avec détails complets
- Filtrage par titre, niveau, rating
- Recherche insensible à la casse
- Limitation des résultats ou récupération complète

### Workouts

- Création de programmes d'entraînement personnalisés
- Association d'exercices aux workouts
- Gestion de la durée et de la date
- Population automatique des exercices associés

### Utilisateurs

- Gestion complète des utilisateurs
- Suivi des workouts complétés
- Historique de connexion
- Mots de passe sécurisés avec bcrypt

## Stack Technique

- **Backend**: Node.js, Express.js
- **Bases de données**:
  - MongoDB (Exercises, Workouts)
  - PostgreSQL (Users)
- **Authentification**: Bcrypt pour le hachage des mots de passe
- **Tests**: Jest pour les tests unitaires
- **CORS**: Gestion des requêtes cross-origin

## Prérequis

- Node.js (v14 ou supérieur)
- MongoDB
- PostgreSQL
- npm ou yarn
- Docker et Docker Compose (optionnel, pour le déploiement)

## Installation

1. **Cloner le repository**

```bash
git clone <votre-repo>
cd fitness-workout-manager
```

### Node.js

2. **Installer les dépendances**

```bash
npm install
```

3. **Configuration des bases de données**

**MongoDB**:

- Assurez-vous que MongoDB est en cours d'exécution
- L'application se connecte automatiquement à `mongodb://localhost:27017`

**PostgreSQL**:

- Créer une base de données PostgreSQL
- Configurer la connexion dans `config/db.postgres.js`
- Initialiser la table users :

```bash
curl http://localhost:3000/init-db
```

utiliser pgAdmin ou un autre outil pour exécuter le script SQL dans `sql/init.sql`.

4. **Variables d'environnement**
   Créer un fichier `.env` :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fitness
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=fitness
PG_USER=your_username
PG_PASSWORD=your_password
```

### Docker (optionnel)

1. **Variables d'environnement**
   Créer un fichier `.env.docker` :

```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/gimfit
PGUSER=postgres
PGHOST=postgres
PGPASSWORD=password
PGDATABASE=gimfit
PGPORT=5432
JWT_ACCESS_SECRET=secret
JWT_REFRESH_SECRET=secret
```

2. **Construire et démarrer les conteneurs**

```bash
docker-compose up --build api
```

en savoir plus dans le fichier `Docker.md`.

## Démarrage

### Node.js

**Mode développement :**

```bash
npm run dev
```

**Mode production :**

```bash
npm start
```

### Docker

```bash
docker-compose up api
```

### Arrêter les conteneurs

```bash
docker-compose down
```

L'application sera accessible sur `http://localhost:3000`

## API Endpoints

### Exercices (`/api/exercises`)

- `GET /` - Récupérer tous les exercices (avec filtres)
- `GET /:id` - Récupérer un exercice par ID
- `POST /` - Créer un nouvel exercice
- `PUT /:id` - Mettre à jour un exercice
- `DELETE /:id` - Supprimer un exercice

### Workouts (`/api/workouts`)

- `GET /` - Récupérer tous les workouts
- `GET /:id` - Récupérer un workout par ID
- `POST /` - Créer un nouveau workout
- `PUT /:id` - Mettre à jour un workout
- `DELETE /:id` - Supprimer un workout

### Utilisateurs (`/api/users`)

- `GET /` - Récupérer tous les utilisateurs
- `GET /:id` - Récupérer un utilisateur par ID
- `POST /` - Créer un nouvel utilisateur
- `PUT /:id` - Mettre à jour un utilisateur
- `PUT /:id/password` - Mettre à jour le mot de passe
- `PUT /:id/last-login` - Mettre à jour la dernière connexion
- `PUT /:id/workouts-completed` - Incrémenter les workouts complétés
- `DELETE /:id` - Supprimer un utilisateur

## Tests

**Exécuter tous les tests :**

```bash
npm test
```

**Tests avec couverture :**

```bash
npm run test:coverage
```

**Tests en mode watch :**

```bash
npm run test:watch
```

### Structure des tests

- `tests/` - Contient tous les tests unitaires
  - `user.test.js` - Tests du contrôleur User
  - `workout.test.js` - Tests du contrôleur Workout
  - `exercise.test.js` - Tests du contrôleur Exercise

## Structure du Projet

```
src/
├── controllers/          # Contrôleurs
│   ├── User.controller.js
│   ├── Workout.controller.js
│   └── Exercise.controller.js
├── models/              # Modèles
│   ├── User.model.js
│   ├── Workout.model.js
│   └── Exercise.model.js
├── routes/              # Routes
│   ├── user.routes.js
│   ├── workout.routes.js
│   └── exercise.routes.js
├── config/              # Configuration
│   ├── db.postgres.js
│   └── db.mongo.js
└── tests/               # Tests
    ├── user.test.js
    ├── workout.test.js
    └── exercise.test.js
```

## Scripts Disponibles

- `npm start` - Démarrer en production
- `npm run dev` - Démarrer en développement avec nodemon
- `npm test` - Exécuter les tests
- `npm run test:coverage` - Tests avec rapport de couverture
- `npm run test:watch` - Tests en mode watch

## Modèles de Données

### Exercise (MongoDB)

```javascript
{
  Title: String,
  Desc: String,
  Type: String,
  BodyPart: String,
  Equipment: String,
  Level: String,
  Rating: Number,
  RatingDesc: String
}
```

### Workout (MongoDB)

```javascript
{
  name: String,
  duration: Number,
  date: Date,
  exercises: [ObjectId], // Références aux exercices
  userId: [Number]       // Références aux utilisateurs
}
```

### User (PostgreSQL)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  workouts_completed INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);
```

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Auteurs

lucas et yanis

## Support

Si vous rencontrez des problèmes, veuillez ouvrir une issue sur le repository GitHub.
