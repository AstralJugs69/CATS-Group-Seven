import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();


const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });