FROM node:22.16-alpine3.21 as base

RUN node -v
RUN npm -v
RUN pwd
RUN ls -al

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

ENTRYPOINT ["npm","run","start"]