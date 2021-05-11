FROM node:14-alpine3.10

WORKDIR .

ENV NODE_ENV production

COPY package*.json ./
RUN npm install

COPY ./dist ./dist

CMD [ "npm", "start" ]
