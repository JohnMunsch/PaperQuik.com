FROM node:16-alpine3.12

WORKDIR .

ENV NODE_ENV production

COPY package*.json ./
RUN npm install

COPY ./index.mjs ./
COPY ./public ./public

EXPOSE 6080
CMD [ "npm", "start" ]
