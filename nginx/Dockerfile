FROM nginx:1.21.3-alpine AS main

FROM main AS cert

COPY ./cert.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

FROM main AS dev
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
