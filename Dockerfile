FROM node:20.9.0-alpine

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD npm run start
