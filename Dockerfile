FROM node:16-alpine3.16
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npx prisma generate
CMD ["npm", "start"]