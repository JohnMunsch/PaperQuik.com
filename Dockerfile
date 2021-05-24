FROM node:14-alpine3.10

WORKDIR .

ENV NODE_ENV production

COPY package*.json ./
RUN npm install

COPY ./index.mjs ./
COPY ./public ./public

CMD [ "npm", "start" ]
