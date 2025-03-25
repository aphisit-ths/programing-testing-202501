FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install
RUN rm -f ./lookup_urls.sqlite
RUN touch lookup_urls.sqlite
RUN bun run db:migrate

EXPOSE 80

CMD ["bun", "run", "dev"]