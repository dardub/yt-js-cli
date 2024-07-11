import { Headers, CompressionTypes, RequestMethod, ContentTypes } from "./constants.ts";
import { TodoListForm } from "./todo-list/todoListForm.ts";
import { TodoList, Todo } from "./todo-list/todoList.ts";
import { YT_API_KEY } from "./.env.json";
import Player from "./player/player.ts";
import Search from "./search.ts";
import Head from "./head.ts";
import Html from "./html.ts";

enum SearchType {
  Channel = 'channel',
  Video = 'video',
  Playlist = 'playlist',
}

class ID {
  public id: number;

  constructor() {
    this.id = 0;
  }

  next() {
    return this.id++;
  }
}

const DOMAIN = 'localhost'
const PORT = 8000;

// MAX_ORDER is the default sort order for items that haven't been sorted yet
const MAX_ORDER = 999999; 
const id = new ID();
const todos: Todo[] = [];

const server = Bun.serve({
  port: PORT,
  async fetch(request: Request) {

    const path = new URL(request.url)?.pathname;
    const search = new URL(request.url)?.search;
    const params = new URLSearchParams(search);

    if (path.lastIndexOf("static/") !== -1) {
      const file = Bun.file("." + path);
      return new Response(file);
    }

    if (request.method === RequestMethod.GET) {
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

    } else if (request.method === RequestMethod.POST && path === '/add') {
      

      try {
        const data = await request.formData();
        const todo = data.get("todo") as string;
        if (todo) {
          todos.push({ id: id.next(), name: todo, order: MAX_ORDER });
        }
        
      } catch (error) {
        throw new Error(error);
      }

      const res: Response = compressResponse(TodoListForm(todos), request, {
        headers: { [Headers.ContentType]: ContentTypes.Html }
      });
      return res;
    } else if (request.method === RequestMethod.POST && path === '/update-order') {
      try {
        const data = await request.formData();
        const todoList = data.getAll("todo");
        // console.log('data', data.getAll("todo"))
      for (let i = 0; i < todoList.length; i++) {
        const todo = todos.find(x => x.id === parseInt(todoList[i] as string, 10)); 
        if (todo) todo.order = i;
      }

      } catch (error) {
        throw new Error(error);
      }
  
      const res: Response = compressResponse(TodoList(todos), request, {
        headers: { [Headers.ContentType]: ContentTypes.Html }
      });
      return res;
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

function compressResponse(body: string, request: Request, options: ResponseInit): Response {
  const clientAcceptsGzip: boolean = request.headers.get(Headers.AcceptEncoding)?.indexOf(CompressionTypes.Gzip) !== -1;

  if (!clientAcceptsGzip) {
    return new Response(body, options);
  }

  const updatedBody = Bun.gzipSync(Buffer.from(body));
  const res = new Response(updatedBody, options);
  res.headers.append(Headers.ContentEncoding, CompressionTypes.Gzip);
  return res;
}

