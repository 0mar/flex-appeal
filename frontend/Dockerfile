FROM node:22 AS build-stage

ENV APP_PATH="/app"
WORKDIR ${APP_PATH}

COPY package*.json ${APP_PATH}
RUN npm install
COPY . ${APP_PATH}
ARG VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Set up Nginx for production
FROM nginx:1

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf