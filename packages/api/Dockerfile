FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies (monorepo root + api package)
COPY package.json ./
COPY packages/api/package.json ./packages/api/
RUN npm install --workspace=@cookie/api

# Build
COPY tsconfig.base.json ./
COPY packages/api ./packages/api
RUN npm run build --workspace=@cookie/api

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/package.json ./
COPY --from=base /app/packages/api/package.json ./packages/api/
RUN npm install --workspace=@cookie/api --omit=dev

COPY --from=base /app/packages/api/dist ./packages/api/dist

EXPOSE 3000
CMD ["node", "packages/api/dist/index.js"]
