const server = Bun.serve({
  port: 8000,
  fetch(request: Request) {  
    request;
    const res = new Response(html) as Response;
    res.headers.append("content-type", "text/html");
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
        <title>HTMX ⚡</title>
    </head>
    <body>
        <h1>HTMX Page</h1>
    </body>
  </html>
`