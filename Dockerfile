FROM node:20.9.0-alpine as base

WORKDIR /app

COPY package*.json ./

COPY ./prisma prisma
COPY ./src src

RUN npm ci --quiet --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]