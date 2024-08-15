FROM node:16.17.1-alpine3.16 as build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.21.3-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80