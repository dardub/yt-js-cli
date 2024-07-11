import { Headers, CompressionTypes } from "./constants.ts";

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

export {
    compressResponse
}

