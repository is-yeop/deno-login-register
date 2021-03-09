import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {renderFileToString} from "https://deno.land/x/dejs/mod.ts";
import {hashSync, compareSync} from "https://deno.land/x/bcrypt/mod.ts";
import {create, getNumericDate, Payload, Header} from "https://deno.land/x/djwt/mod.ts";
import type {Algorithm} from "https://deno.land/x/djwt/algorithm.ts";
import {users, User} from "./users.ts";
import "https://deno.land/x/dotenv/load.ts"

const header: Header = {
    alg: Deno.env.get('ALG') as Algorithm || 'none',
    typ: "JWT"
}

export const home = async (ctx: RouterContext) => {
    const currentUser = ctx.state.currentUser;
    ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/home.ejs`, {
        user: currentUser,
    });
}

export const login = async (ctx: RouterContext) => {
    ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/login.ejs`, {
        error: 0
    });
}

export const register = async (ctx: RouterContext) => {
    ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/register.ejs`, {});
}

export const protectedRoute = async (ctx: RouterContext) => {
    ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/protected.ejs`, {});
}

export const postLogin = async (ctx: RouterContext) => {
    const value = await ctx.request.body().value;
    const username = value.get('username');
    const password = value.get('password');

    const user = users.find((u: User) => u.username === username)
    if (!user) {
        ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/login.ejs`, {
            error: "Incorrect username"
        });
    } else if (!compareSync(password, user.password)) {
        ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/login.ejs`, {
            error: "Incorrect password"
        });
    } else {
        console.log("Success");
        const payload: Payload = {
            iss: user.username,
            exp: getNumericDate(60 * 60)
        }
        const jwt = await create(header, payload, Deno.env.get("JWT_KEY") || '');
        ctx.cookies.set('jwt', jwt);
        ctx.response.redirect('/');
    }
}

export const postRegister = async (ctx: RouterContext) => {
    const value = await ctx.request.body().value;
    const name = value.get('name');
    const username = value.get('username');
    const password = value.get('password');

    const hashedPassword = hashSync(password);
    const user = {
        name,
        username,
        password: hashedPassword,
    };
    users.push(user);
    ctx.response.redirect('/login');
}

export const logout = async (ctx: RouterContext) => {
    ctx.cookies.delete('jwt');
    ctx.response.redirect('/');
}
