FROM node:23-alpine3.20 AS frontbuilder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build


FROM registry.cloud.ai4eosc.eu/ai4os/prov-api:latest
COPY --from=frontbuilder /app/dist /frontend
ENV SPRING_WEB_RESOURCES_STATIC_LOCATIONS=file:/frontend,file:/resources
