import {Application, Router} from "https://deno.land/x/oak/mod.ts";
import {home} from "./routes.ts";

const PORT = 8000;

const app = new Application();

const router = new Router();

router
    .get('/', home)
;

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({port: PORT});
console.log("Server started on port: " + PORT);