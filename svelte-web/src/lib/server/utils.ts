import {FASTIFY_BACKEND_URL} from "$env/static/private";

let api_url = FASTIFY_BACKEND_URL;
if (!FASTIFY_BACKEND_URL.endsWith('/')) {
  api_url = FASTIFY_BACKEND_URL + '/'
}

if (!FASTIFY_BACKEND_URL.startsWith('http')) {
  throw Error('Backend URL must start with http');
}

export function $api(path: string) {
  return api_url + path;
}