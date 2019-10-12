FROM node:9-alpine

WORKDIR /src
COPY package.json /src
RUN yarn install
COPY . /src

EXPOSE 80

CMD ["yarn", "dev"]