



FROM node:16.17.1 AS dev
WORKDIR /app
COPY package.json ./
COPY public ./public
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]

FROM node:16.17.1-alpine3.16 AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:1.21.3-alpine AS prod
COPY --from=build /app/build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80