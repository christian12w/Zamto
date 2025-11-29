import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'https://content.tinajs.io/1.4/content/6e2aac42-bc7d-4839-a465-f44e0140e2ea/github/main', token: '8c9607c325a9a7361dfa10c41d2d7222aaad0cde', queries });
export default client;
  