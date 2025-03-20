import { Elysia } from "elysia";

const app = new Elysia()
app
    .get("/", () => "Hello Elysia")

app.listen(process.env.PORT || 7777)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
