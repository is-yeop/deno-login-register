import {Application, Router} from "https://deno.land/x/oak/mod.ts";
import {home, login, register, protectedRoute, postLogin, postRegister, logout} from "./routes.ts";

const PORT = 8000;

const app = new Application();

const router = new Router();

router
    .get('/', home)
    .get('/login', login)
    .get('/register', register)
    .get('/protected', protectedRoute)
    .post('/login', postLogin)
    .post('/register', postRegister)
    .get('/logout', logout)
;

app.use(router.routes());
app.use(router.allowedMethods());

// Error 처리
app.addEventListener('error', event => {
   console.log(event.error);
});

app.listen({port: PORT});
console.log("Server started on port: " + PORT);