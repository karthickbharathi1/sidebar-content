export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.9add8ed7.js","app":"_app/immutable/entry/app.d0402050.js","imports":["_app/immutable/entry/start.9add8ed7.js","_app/immutable/chunks/index.1e98c1b5.js","_app/immutable/chunks/singletons.0c2b4e0f.js","_app/immutable/chunks/index.ab318d7a.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/entry/app.d0402050.js","_app/immutable/chunks/index.1e98c1b5.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/4.js'))
		],
		routes: [
			{
				id: "/sverdle",
				pattern: /^\/sverdle\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
