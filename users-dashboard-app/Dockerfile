FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY src/ ./src

EXPOSE 4000

CMD ["node", "src/app.js"]

