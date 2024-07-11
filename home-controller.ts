import { Headers, CompressionTypes, RequestMethod, ContentTypes } from "./constants.ts";
import Player from "./player/player.ts";
import Head from "./head.ts";
import Html from "./html.ts";
import { compressResponse } from "./utils.ts";
import { YT_API_KEY } from "./.env.json";

export default async function HomeController(request: Request): Promise<Response> {
    let url = `https://www.googleapis.com/youtube/v3/videos?key=${YT_API_KEY}&part=snippet,statistics&chart=mostPopular`;

    try {
      const ytResponse = await fetch(url);
      if (!ytResponse.ok) throw new Error("Response status: " + ytResponse.status);

      const json = await ytResponse.json();
      
        const html = Html({
          head: Head({
            pageTitle: "MyTube Home Page",
          }),
          body: Player(json),
        })
        const res: Response = compressResponse(html, request, { 
          headers: { [Headers.ContentType]: ContentTypes.Html }
        });
        return res;

    } catch (error) {
      return new Response(`<pre>${error}\n${error.stack}</pre>`, {
        headers: {
          [Headers.ContentType]: ContentTypes.Html,
        },
      });
    }
}