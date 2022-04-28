FROM node:16-alpine3.12

WORKDIR .

ENV NODE_ENV production
LABEL org.opencontainers.image.source="https://github.com/JohnMunsch/PaperQuik.com"

COPY package*.json ./
RUN npm install

COPY ./index.mjs ./
COPY ./public ./public

EXPOSE 6080
CMD [ "npm", "start" ]
