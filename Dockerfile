FROM node:14-buster-slim

WORKDIR /src

RUN npm install -g @quasar/cli

COPY package*.json ./
RUN npm install

COPY . .

RUN quasar build

EXPOSE 80
CMD ["quasar", "serve", "--silent", "--port", "80", "dist/spa"]