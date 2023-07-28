

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.28c57e35.js","_app/immutable/chunks/index.1e98c1b5.js","_app/immutable/chunks/singletons.0c2b4e0f.js","_app/immutable/chunks/index.ab318d7a.js"];
export const stylesheets = [];
export const fonts = [];
