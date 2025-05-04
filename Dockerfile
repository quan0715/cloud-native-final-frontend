# build stage
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install --frozen-lockfile
RUN npm run build

# production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 