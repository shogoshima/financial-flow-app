FROM --platform=linux/amd64 node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

# prisma migrations
RUN npx prisma migrate dev --name init

EXPOSE 3000

CMD [ "npm", "run", "dev" ]