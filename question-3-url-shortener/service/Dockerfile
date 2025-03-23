FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

RUN touch user.sqlite
RUN bun run db:migrate

EXPOSE 80

CMD ["bun", "run", "dev"]