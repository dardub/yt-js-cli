export const HEADERS = {
  CONTENT_TYPE: "Content-Type",
  CONTENT_ENCODING: "Content-Encoding",
} as const;

export type ResposeHeaders = keyof typeof HEADERS;

export const COMPRESSION_TYPES = {
  GZIP: "gzip",
};

export type CompressionTypes = keyof typeof COMPRESSION_TYPES;
