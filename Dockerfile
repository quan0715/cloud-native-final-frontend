# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN echo "VITE_API_BASE_URL: $VITE_API_BASE_URL"

ARG VITE_ENV_TAG
ENV VITE_ENV_TAG=$VITE_ENV_TAG
RUN echo "VITE_ENV_TAG: $VITE_ENV_TAG"

RUN npm install
RUN VITE_API_BASE_URL=$VITE_API_BASE_URL VITE_ENV_TAG=$VITE_ENV_TAG npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]