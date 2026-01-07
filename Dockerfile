FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./

# Installer les dépendances
RUN npm ci

COPY . .

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copier les dépendances du builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copier le code source
COPY --chown=nodejs:nodejs . .

# Définir l'utilisateur non-root
USER nodejs

EXPOSE 3000

CMD ["npm", "start"]
