FROM node:20.10.0

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

RUN yarn install && npx prisma generate

COPY . .
COPY ./dist ./dist

CMD ["yarn", "dev"]