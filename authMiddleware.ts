import type {Context} from "https://deno.land/x/oak/mod.ts";
import {verify} from "https://deno.land/x/djwt/mod.ts";
import {users, User} from "./users.ts";

const authMiddleware = async (ctx: Context, next: Function) => {
    if (!ctx.state.currentUser) {
        ctx.response.redirect('/login')
    } else {
        await next();
    }
};

export default authMiddleware;