import { Headers, CompressionTypes, RequestMethod, ContentTypes } from "./constants.ts";
import Player from "./player/player.ts";
import Head from "./head.ts";
import Html from "./html.ts";
import { compressResponse } from "./utils.ts";

export default async function HomeController(request: Request): Promise<Response> {
    const html = Html({
      head: Head({
        pageTitle: "MyTube Home Page",
      }),
      body: Player(),
    })
    const res: Response = compressResponse(html, request, { 
      headers: { [Headers.ContentType]: ContentTypes.Html }
    });
    return res;
}