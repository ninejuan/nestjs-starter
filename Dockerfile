FROM node:latest

COPY . /app
WORKDIR /app

ENV TZ=Asia/Seoul
RUN corepack enable && corepack prepare yarn@stable --activate
RUN yarn install

WORKDIR /app/package/database

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN yarn db generate
RUN echo "DATABASE_URL: ${DATABASE_URL}"
RUN DATABASE_URL=${DATABASE_URL} yarn db prisma migrate deploy

EXPOSE 3000

WORKDIR /app
RUN yarn api build

CMD [ "yarn", "api", "start" ]
