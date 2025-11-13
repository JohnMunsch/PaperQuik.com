FROM node:24-alpine

ENV NODE_ENV=production
LABEL org.opencontainers.image.source="https://github.com/JohnMunsch/PaperQuik.com"

WORKDIR /usr/app
COPY package*.json ./
RUN npm install --include=dev

COPY ./index.html ./
COPY ./index.mjs ./
COPY ./vite.config.js ./
COPY ./src ./src
COPY ./public ./public
RUN npm run build

EXPOSE 6080
CMD [ "npm", "start" ]
