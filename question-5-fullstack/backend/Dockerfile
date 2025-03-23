FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

RUN touch user.sqlite
RUN bun run db:migrate
RUN bun run db:seed

EXPOSE 7777

CMD ["bun", "run", "dev"]