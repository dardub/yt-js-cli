import { expect, test } from "bun:test";
import Router from "./router.ts";

const router = new Router();

test("Register multiple static get routes", () => {
    router.Get("/users", handler);
    router.Get("/users/profile", handler);
    router.Get("/users/profile/update", handler);
    router.Get("/users/profile/settings", handler);
    router.Get("/videos/recommended", handler);
    console.log('router', router);
    // TODO: expect(router.match("users/profile/update").toExecute(handler))
});

test("Register multiple static get routes with new intermediate paths", () => {
    router.Get("/users", handler);
    router.Get("/users/profile/update", handler);
});


function handler() {
    console.log('handler', router);
}