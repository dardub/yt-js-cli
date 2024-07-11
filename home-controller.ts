import { Headers, CompressionTypes, RequestMethod, ContentTypes } from "./constants.ts";
import { YT_API_KEY } from "./.env.json";
import Player from "./player/player.ts";
import Search from "./search.ts";
import Head from "./head.ts";
import Html from "./html.ts";
import { compressResponse } from "./utils.ts";

export default async function HomeController(request: Request): Promise<Response> {
    const search = new URL(request.url)?.search;
    const params = new URLSearchParams(search);
    const searchParams = params.has("s") && params.get("s");
    const typeParams = params.has("type") && params.get("type");
    const isValidType = typeParams && Object.values<string>(SearchType).includes(typeParams);

    // search
    if (searchParams) {
      let url = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&part=snippet&q=${searchParams}`;

      if (isValidType) {
        url += "&type=" + typeParams;
      } 
      try {
        const ytResponse = await fetch(url);

        if (!ytResponse.ok) throw new Error("Response status: " + ytResponse.status);

        const json = await ytResponse.json();
        const html = Html({
          head: Head({
            pageTitle: "Search Results for " + searchParams,
          }),
          body: Search(json),
        });

        const res: Response = compressResponse(html, request, {
          headers: { [Headers.ContentType]: ContentTypes.Html }
        });
        return res;

        
      } catch (error) {
        console.log("Error ocurred: ", error);
      }
    }
    
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

enum SearchType {
    Channel = 'channel',
    Video = 'video',
    Playlist = 'playlist',
}