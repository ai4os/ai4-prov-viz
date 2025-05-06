ARG BACKEND_TAG=dev
FROM node:23-alpine3.20 AS frontbuilder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
ENV VITE_BACKEND_URL="https://dev.ai4eosc.predictia.es"
COPY . .
RUN npm run build


FROM (BACKEND_IMAGE)
COPY --from=frontbuilder /app/dist /frontend
ENV SPRING_WEB_RESOURCES_STATIC_LOCATIONS=file:/frontend,file:/resources
