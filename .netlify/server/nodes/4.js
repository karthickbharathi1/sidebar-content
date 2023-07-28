import * as server from '../entries/pages/sverdle/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/sverdle/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/sverdle/+page.server.js";
export const imports = ["_app/immutable/nodes/4.70c9208e.js","_app/immutable/chunks/index.1e98c1b5.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/singletons.0c2b4e0f.js","_app/immutable/chunks/index.ab318d7a.js"];
export const stylesheets = ["_app/immutable/assets/4.9d501049.css"];
export const fonts = [];
