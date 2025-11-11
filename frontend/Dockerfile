ARG NODE_VERSION=20

# Stage pour installer les dépendances
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Stage développement 
FROM node:${NODE_VERSION}-alpine AS development
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules


EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# Stage pour builder la version production
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app

# Copier node_modules depuis deps
COPY --from=deps /app/node_modules /app/node_modules

# Copier tout le code source
COPY . .

# Builder l'application
RUN npm run build

# Stage production avec Nginx
FROM nginx:alpine AS production

# Copier les fichiers buildés
COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
