import { Headers, CompressionTypes, RequestMethod, ContentTypes } from "./constants.ts";

const todos: string[] = [];

const server = Bun.serve({
  port: 8000,
  async fetch(request: Request) {

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

console.log(`Listening on http://localhost:${server.port}`);

const html = ({ todos = [] }: { todos: string[] }) => `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TODO APP</title>
        <script src="https://unpkg.com/htmx.org@2.0.0"></script>
    </head>
    <body>
        <h1>Todo List</h1>
        <form method="POST" action="/">
          <input type="text" name="todo"></input>
          <button type="submit">Submit</button>
        </form>
        <ul>
          ${todos.map(todo => (
            `<li>${todo}</li>`
          ))}
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
