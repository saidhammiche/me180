# Image de base
FROM node:18

# Dossier de travail
WORKDIR /app

# Copier les fichiers
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier le reste
COPY . .

# Exposer le port
EXPOSE 4000

# Lancer l'app
CMD ["npm", "start"]