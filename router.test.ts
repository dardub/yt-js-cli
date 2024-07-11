import { expect, test } from "bun:test";
import Router from "./router.ts";

const router = new Router();

test("Register multiple static get routes", () => {
    router.Get("/users", handler);
    router.Get("/users/profile", handler);
    router.Get("/users/profile/update", handler);
    router.Get("/users/profile/settings", handler);
    router.Get("/videos/recommended", handler);

    expect(router.getRoot().path).toBe("/");
    expect(router.getRoot().children[0].path).toBe("users");
    expect(router.getRoot().children[0].children[0].path).toBe("profile");
    expect(router.getRoot().children[0].children[0].children[0].path).toBe("update");
    expect(router.getRoot().children[0].children[0].children[1].path).toBe("settings");
    expect(router.getRoot().children[1].path).toBe("videos");
});

test("Register multiple static get routes with new intermediate paths", () => {
    router.Get("/users", handler);
    router.Get("/users/profile/update", handler);

    expect(router.getRoot().path).toBe("/");
    expect(router.getRoot().children[0].path).toBe("users");
    expect(router.getRoot().children[0].children[0].path).toBe("profile");
    expect(router.getRoot().children[0].children[0].children[0].path).toBe("update");

    expect(router.getRoot().children[0].handler).toBe(handler);
    expect(router.getRoot().children[0].children[0].handler).toBeEmpty();
});


function handler() {
    console.log('handler', router);
}