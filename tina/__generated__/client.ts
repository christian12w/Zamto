import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '8c9607c325a9a7361dfa10c41d2d7222aaad0cde', queries });
export default client;
  