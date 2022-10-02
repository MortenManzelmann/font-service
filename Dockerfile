FROM node:16.13.0 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install

COPY . .

RUN yarn build


FROM archlinux

WORKDIR /app

RUN pacman -Scc && pacman -Sy archlinux-keyring --noconfirm && pacman -Sy archlinux-keyring --noconfirm  && pacman -S --noconfirm \
    fontforge \
    nodejs 


COPY . .

COPY --from=build /app/dist /dist 

CMD ["node", "dist/server.js"]
