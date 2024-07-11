import { Headers, CompressionTypes, RequestMethod, ContentTypes } from "./constants.ts";
import Router from './router.ts';
import HomeController from "./home-controller.ts";
import SearchController from "./search-controller.ts";

const DOMAIN = 'localhost'
const PORT = 8000;

// Router
const router = new Router();
router.Get("/", HomeController);
router.Get("/search", SearchController);


const server = Bun.serve({
  port: PORT,
  async fetch(request: Request) {

    const path = new URL(request.url)?.pathname;
    
    // Serve any files within a "static" directory
    if (path.lastIndexOf("static/") !== -1) {
      const file = Bun.file("." + path);
      return new Response(file);
    }
    
    const match = router.getMatch(path);
    if (match && match.handler) {
      return match.handler(request);
    }
    
    throw new Error("404 - Not Found");

  },
  error(error) {
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {
      headers: {
        [Headers.ContentType]: ContentTypes.Html,
      },
    });
  }
});

console.log(`Listening on http://${DOMAIN}:${server.port}`);
