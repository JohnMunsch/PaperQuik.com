FROM node:24-alpine

RUN apk add --no-cache python3 py3-pip make g++

ENV NODE_ENV=production
LABEL org.opencontainers.image.source="https://github.com/JohnMunsch/PaperQuik.com"

WORKDIR /usr/app/ui
COPY ui/package*.json ./
RUN npm install --include=dev

COPY ui/tsconfig.json ./
COPY ui/index.html ./
COPY ui/vite.config.js ./
COPY ui/src ./src
COPY ui/public ./public
RUN npm run build

WORKDIR /usr/app/server
COPY server/package*.json ./
RUN npm install --include=dev

COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build

WORKDIR /usr/app
RUN cp -r /usr/app/ui/dist /usr/app/server/public

WORKDIR /usr/app/server
EXPOSE 6080
CMD [ "npm", "start" ]
