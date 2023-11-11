FROM node:latest

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .
COPY ./dist ./dist

CMD ["yarn", "dev"]