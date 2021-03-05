import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {renderFileToString} from "https://deno.land/x/dejs/mod.ts";

export const home = async (ctx: RouterContext) => {
    ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/home.ejs`, {});
}
