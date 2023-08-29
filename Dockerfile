FROM node:18-alpine as base
RUN apk update && apk add git
WORKDIR /app

FROM base as prod-deps
COPY package.json yarn.lock ./
RUN yarn install --production

FROM prod-deps as dev-deps
RUN yarn install

FROM dev-deps as assets
COPY . .
RUN yarn build
RUN rm -rf node_modules

FROM prod-deps
COPY --from=assets /app /app
WORKDIR /app
CMD yarn db:migrate && yarn seed:run && yarn start:prod
