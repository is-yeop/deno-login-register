import {Context} from "https://deno.land/x/oak/mod.ts";
import {verify} from "https://deno.land/x/djwt/mod.ts";
import type {Algorithm} from "https://deno.land/x/djwt/algorithm.ts";
import "https://deno.land/x/dotenv/load.ts"
import {User, users} from "./users.ts";

const userMiddleware = async (ctx: Context, next: Function) => {
    const jwt = ctx.cookies.get('jwt');
    if (jwt) {
        const payload = await verify(jwt, Deno.env.get('JWT_KEY') || '', Deno.env.get('ALG') as Algorithm || "none");
        if (payload) {
            const user = await users.find((u: User) => u.username === payload.iss);
            ctx.state.currentUser = user;
        } else {
            ctx.cookies.delete('jwt');
            ctx.state.currentUser = null;
        }
        console.log(payload);
    } else {
        ctx.state.currentUser = null;
    }
    await next();
};

export default userMiddleware;