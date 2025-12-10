# ------------  BUILD STAGE  -------------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ------------  RUN STAGE  -------------
FROM node:20-alpine AS run

WORKDIR /app

COPY --from=build /app/dist/loan/browser ./dist/loan/browser
COPY --from=build /app/dist/loan/server ./dist/loan/server
COPY --from=build /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 4000

CMD [ "node", "dist/loan/server/server.mjs" ]
