FROM node:20-alpine

WORKDIR .

ENV NODE_ENV production
LABEL org.opencontainers.image.source="https://github.com/JohnMunsch/PaperQuik.com"

COPY package*.json ./
RUN npm install

COPY ./index.mjs ./
COPY ./dist ./public

EXPOSE 6080
CMD [ "npm", "start" ]
