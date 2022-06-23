FROM node

EXPOSE 4000

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV PORT=4000

CMD ["npm", "run", "start"]
