import { Headers, CompressionTypes, RequestMethod, ContentTypes } from "./constants.ts";
import { TodoListForm } from "./todoListForm.ts";
import { TodoList, Todo } from "./todoList.ts";

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

    if (path.lastIndexOf("static/") !== -1) {
      const file = Bun.file("." + path);
      return new Response(file);
    }

    if (request.method === RequestMethod.GET) {
      const res: Response = compressResponse(html({ todos }), request, {
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

const html = ({ todos = [] }: { todos: Todo[] }) => `
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
        ${TodoListForm(todos)}
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

