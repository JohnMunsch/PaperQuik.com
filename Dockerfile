FROM node:14-alpine3.10

WORKDIR .

ENV NODE_ENV production

COPY package*.json ./
RUN npm install

COPY ./index.mjs ./
COPY ./public ./public

EXPOSE 3000
CMD [ "npm", "start" ]
