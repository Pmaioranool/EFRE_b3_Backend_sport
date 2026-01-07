# Documentation Docker - Projet GimFit Backend

## Vue d'ensemble

Ce projet utilise Docker Compose pour orchestrer 3 services:

- **API Node.js** (port 3000)
- **MongoDB** (port 27017)
- **PostgreSQL** (port 5432)

---

## Docker Compose (`docker-compose.yml`)

### Structure générale

```yaml
version: "3.9" # Version de l'API Docker Compose
services: # Les 3 services du projet
volumes: # Volumes persistants pour les bases de données
```

---

## Services

### **MongoDB** (Base de données NoSQL)

```yaml
mongo:
  image: mongo:7 # Image officielle MongoDB version 7
  ports:
    - "27017:27017" # Expose le port 27017 (protocole: conteneur → hôte)
  volumes:
    - mongo_data:/data/db # Volume persistant pour les données
    - ./megaGymDataset.csv:/megaGymDataset.csv:ro # Mount du CSV (lecture seule)
    - ./sql/init-mongo.sh:/docker-entrypoint-initdb.d/init-mongo.sh:ro # Script d'init
```

**Volumes expliqués:**

- `mongo_data:/data/db` - Stocke les données MongoDB de manière persistante
- `./megaGymDataset.csv:/megaGymDataset.csv:ro` - Rend le CSV accessible au container (`:ro` = read-only)
- `./sql/init-mongo.sh:...` - Script bash qui s'exécute au premier démarrage pour importer le CSV

**Initialisation:**
Le script `init-mongo.sh` s'exécute automatiquement et:

- Attend que MongoDB soit prêt
- Exécute `mongoimport` pour charger le CSV dans la collection `exercises`

---

### **PostgreSQL** (Base de données relationnelle)

```yaml
postgres:
  image: postgres:15 # Image officielle PostgreSQL version 15
  environment:
    POSTGRES_USER: postgres # Utilisateur PostgreSQL
    POSTGRES_PASSWORD: postgres # Mot de passe
    POSTGRES_DB: gimfit # Nom de la base de données créée au démarrage
  ports:
    - "5432:5432" # Expose le port PostgreSQL
  volumes:
    - pg_data:/var/lib/postgresql/data # Volume persistant pour les données
    - ./sql/init.sql:/docker-entrypoint-initdb.d/init.sql:ro # Script SQL d'init
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres -d gimfit"] # Vérifie que PostgreSQL est prêt
    interval: 5s # Vérifie toutes les 5 secondes
    timeout: 3s # Timeout de 3 secondes par vérification
    retries: 10 # Essai pendant 50 secondes max
    start_period: 5s # Attend 5s avant la première vérification
```

**Initialisation:**

- Le fichier `./sql/init.sql` s'exécute automatiquement au premier démarrage
- Crée la table `users` avec tous les champs (id, name, email, password, etc.)

**Healthcheck:**

- L'API attend que PostgreSQL soit `healthy` (pas juste `started`)
- Cela garantit que la base de données est vraiment opérationnelle

---

### **API Node.js** (Application Express)

```yaml
api:
  build: ./ # Build l'image depuis le Dockerfile du répertoire courant
  depends_on:
    mongo:
      condition: service_started # L'API démarre après MongoDB (peu importe si prêt)
    postgres:
      condition: service_healthy # L'API attend que PostgreSQL soit healthy
  ports:
    - "3000:3000" # Expose le port 3000 (développement)
```

**Dépendances:**

- `service_started` pour MongoDB = le conteneur doit être lancé (pas nécessairement prêt)
- `service_healthy` pour PostgreSQL = le healthcheck doit passer

**Raison de la différence:**
MongoDB démarre très vite, PostgreSQL nécessite un healthcheck pour être vraiment utilisable.

---

## Dockerfile

```dockerfile
FROM node:20-alpine AS base    # Image de base: Node.js 20 sur Alpine (léger)
WORKDIR /app                   # Répertoire de travail dans le conteneur
ENV NODE_ENV=production        # Mode production

COPY package*.json ./          # Copie package.json et package-lock.json
RUN npm ci --omit=dev         # Installe les dépendances (ci = clean install)

COPY . .                       # Copie tout le code source
COPY .env .env                 # Copie les variables d'environnement

EXPOSE 3000                    # Documente que le port 3000 est utilisé
CMD ["npm", "start"]           # Lance: npm start (= node src/server.js)
```

**Explications:**

- `node:20-alpine` = Image Node.js 20 basée sur Alpine Linux (très léger ~150MB)
- `npm ci` = Installe les dépendances de manière déterministe (meilleur pour Docker)
- `--omit=dev` = Ne pas installer les devDependencies (production seulement)
- `COPY .env .env` = Inclut les variables d'environnement dans l'image

---

## Volumes

```yaml
volumes:
  mongo_data: # Volume nommé pour MongoDB - persiste après un docker-compose down
  pg_data: # Volume nommé pour PostgreSQL - persiste après un docker-compose down
```

Ces volumes assurent que les données restent même si vous supprimez les conteneurs.

---

## Connectivité réseau interne

À l'intérieur du réseau Docker Compose, les services se trouvent par nom:

- MongoDB accessible à: `mongo:27017`
- PostgreSQL accessible à: `postgres:5432`
- API accessible à: `api:3000`

C'est pourquoi le `.env` utilise:

```
MONGODB_URI=mongodb://mongo:27017/gimfit
PGHOST=postgres
```

(Non `127.0.0.1` ou `localhost` qui ne fonctionneraient pas)

---

## Commandes pratiques

```bash
# Lancer tous les services
docker-compose up

# Lancer en arrière-plan
docker-compose up -d

# Lancer en arrière-plan les services MongoDB et PostgreSQL seulement
docker-compose up api

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (réinitialise les BD)
docker-compose down -v

# Rebuild l'API après modifications du code
docker-compose up --build api
```

---

## Points importants

1. **Initialisation des bases:**

   - PostgreSQL: `init.sql` s'exécute **une seule fois** au premier démarrage
   - MongoDB: `init-mongo.sh` s'exécute aussi **une seule fois**

2. **Pour réinitialiser:**

   ```bash
   docker-compose down -v
   docker-compose up -d mongo postgres
   ```

3. **Variables d'environnement:**

   - Le `.env` est copié **dans le Dockerfile**
   - Modifications du `.env` nécessitent un rebuild: `docker-compose up --build api`

4. **Persistance des données:**
   - Les volumes `mongo_data` et `pg_data` sauvegardent les données
   - Un `docker-compose down` ne supprime PAS les données
   - Un `docker-compose down -v` supprime les volumes et réinitialise les BD

---

## Dépannage

| Problème                            | Solution                                                           |
| ----------------------------------- | ------------------------------------------------------------------ |
| `ECONNREFUSED 127.0.0.1:27017`      | Utiliser `mongo` au lieu de `127.0.0.1` dans la connexion          |
| PostgreSQL ne démarre pas           | Vérifier que le port 5432 est libre ou changer dans docker-compose |
| Données anciennes après redémarrage | Faire `docker-compose down -v` puis relancer                       |
| L'API n'accède pas aux BD           | Vérifier que les services sont en good health: `docker-compose ps` |

---

## État des services

Pour vérifier l'état:

```bash
docker-compose ps
```

Affichera quelque chose comme:

```
NAME       COMMAND                  SERVICE    STATUS
api-1      npm start                api        Up (healthy)
mongo-1    mongod                   mongo      Up
postgres-1 postgres                 postgres   Up (healthy)
```
