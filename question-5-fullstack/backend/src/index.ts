import { Elysia } from "elysia";
import 'dotenv/config';
import {healthChecks} from "./db/schema";
import {db} from "./db/db";

const health = await db.select().from(healthChecks).limit(1);

const app = new Elysia()
app
    .get("/", () => health)

app.listen(process.env.PORT || 7777)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
