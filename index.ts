import { Headers, CompressionTypes, RequestMethod, ContentTypes } from "./constants.ts";

const DOMAIN = 'localhost'
const PORT = 8000;
const todos: string[] = [];

const server = Bun.serve({
  port: PORT,
  async fetch(request: Request) {

    const path = new URL(request.url)?.pathname;

    if (path.lastIndexOf("static/") !== -1) {
      const file = Bun.file("." + path);
      return new Response(file);
    }

    if (request.method === RequestMethod.GET) {
      const res: Response = compressResponse(html({ todos }), request, {
        headers: { [Headers.ContentType]: ContentTypes.Html }
      });
      return res;

    } else if (request.method === RequestMethod.POST) {
      try {
        const data = await request.formData();
        const todo = data.get("todo") as string;
        if (todo) {
          todos.push(todo);
        }
        
      } catch (error) {
        throw new Error(error);
      }

      const res: Response = compressResponse(html({ todos }), request, {
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

const html = ({ todos = [] }: { todos: string[] }) => `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TODO APP</title>
        <style>
          #dropzone {
            width: 75%;
            height: 10px;
            transition: height 100ms ease-out;
          }
          #dropzone.active {
            height: 25px;
            border: 4px dashed red;
          }
        </style>
        <script src="https://unpkg.com/htmx.org@2.0.0"></script>
        <script src="./static/scripts.js"></script>
    </head>
    <body>
        <h1>Todo List</h1>
        <form method="POST" action="/">
          <input type="text" name="todo"></input>
          <button type="submit">Submit</button>
        </form>
        <ul>
          ${todos.reduce((prev, todo, idx) => {
            return prev + `
              <li key=${idx} id=${idx} class="item" draggable="true">
                <div id="dropzone" ondrop="dropHandler(event)" ondragover="dragoverHandler(event)" ondragleave="dragleaveHandler(event)"></div>
                <div>${todo}</div>
              </li>`
          }, "")}
        </ul>
    </body>
  </html>
`;

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