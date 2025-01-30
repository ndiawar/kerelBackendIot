# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY yarn.lock* ./

# Installer les dépendances (y compris devDependencies pour les tests)
RUN npm ci --include=dev

# Copier tout le code source
COPY . .

# Étape de production
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV MONGO_URI=mongodb://mongo:27017/iotdb
ENV JWT_SECRET=your_secure_jwt_secret_here
ENV PORT=3000

# Copier depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Permissions de sécurité
RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["npm", "start"]