import { HEADERS, COMPRESSION_TYPES } from "./constants.ts";

const server = Bun.serve({
  port: 8000,
  fetch(request: Request) {
    // request;
    const res: Response = compressResponse(html, request);
    res.headers.append(HEADERS.CONTENT_TYPE, "text/html");
    return res;
  },
});

console.log(`Listening on http://localhost:${server.port}`);

const html = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TODO APP</title>
        <script src="https://unpkg.com/htmx.org@2.0.0"></script>
    </head>
    <body>
        <h1>HTMX Page</h1>
        <ul>
          <li></li>
    </body>
  </html>
`;
function compressResponse(body: string, request: Request): Response {
  const clientAcceptsEncoding = request.headers.has(HEADERS.CONTENT_ENCODING);
  const clientAcceptsGzip: boolean =
    clientAcceptsEncoding &&
    request.headers.get(HEADERS.CONTENT_ENCODING)?.indexOf(COMPRESSION_TYPES.GZIP) !== -1;

  if (clientAcceptsGzip) {
    return new Response(body);
  }

  const updatedBody = Bun.gzipSync(Buffer.from(body));
  const res = new Response(updatedBody);
  res.headers.append(HEADERS.CONTENT_ENCODING, COMPRESSION_TYPES.GZIP);
  return res;
}
