FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8181

# Run migrations then start the server
CMD ["sh", "-c", "yarn migration:run:prod && yarn start"]
