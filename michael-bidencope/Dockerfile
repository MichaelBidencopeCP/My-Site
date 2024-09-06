
FROM nginx:1.21.3-alpine as cert
COPY .default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80


FROM node:16.17.1 as dev
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]


FROM node:16.17.1-alpine3.16 as prod
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:1.21.3-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80