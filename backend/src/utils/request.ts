import { HttpError } from "./http.js";

export function routeParam(value: string | string[] | undefined, name: string) {
  if (!value) {
    throw new HttpError(400, `Missing route parameter: ${name}`);
  }

  return Array.isArray(value) ? value[0] : value;
}
