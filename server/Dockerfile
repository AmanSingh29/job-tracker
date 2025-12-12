FROM node:20

WORKDIR /user/server

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5050

CMD ["npm", "run", "start"]
