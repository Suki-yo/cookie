FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY packages/web/package.json ./packages/web/
RUN npm install --workspace=@cookie/web

# Build
COPY tsconfig.base.json ./
COPY packages/web ./packages/web
ARG VITE_API_URL=http://localhost:3000
ARG VITE_KEYCLOAK_URL=http://localhost:8080/realms/cookie
ARG VITE_KEYCLOAK_CLIENT_ID=cookie-app
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID
RUN npm run build --workspace=@cookie/web

FROM nginx:alpine AS runtime
COPY --from=base /app/packages/web/dist /usr/share/nginx/html
COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
