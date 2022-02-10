FROM node:12.18.2

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
RUN yarn 

RUN apt-get update && apt-get install -y python-fontforge

COPY . .

CMD ["node", "dist/server.js"]
