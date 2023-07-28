import { c as create_ssr_component, a as compute_rest_props, g as getContext, b as subscribe, d as createEventDispatcher, e as spread, f as escape_attribute_value, h as escape_object, o as onDestroy, i as is_promise, n as noop, v as validate_component, m as missing_component, s as setContext, j as add_attribute, k as each, l as escape } from "../../chunks/index3.js";
import { w as writable, d as derived } from "../../chunks/index2.js";
const styles = "";
const LOCATION = {};
const ROUTER = {};
const HISTORY = {};
const PARAM = /^:(.+)/;
const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;
const segmentize = (uri) => uri.replace(/(^\/+|\/+$)/g, "").split("/");
const stripSlashes = (string) => string.replace(/(^\/+|\/+$)/g, "");
const rankRoute = (route, index) => {
  const score = route.default ? 0 : segmentize(route.path).reduce((score2, segment) => {
    score2 += SEGMENT_POINTS;
    if (segment === "") {
      score2 += ROOT_POINTS;
    } else if (PARAM.test(segment)) {
      score2 += DYNAMIC_POINTS;
    } else if (segment[0] === "*") {
      score2 -= SEGMENT_POINTS + SPLAT_PENALTY;
    } else {
      score2 += STATIC_POINTS;
    }
    return score2;
  }, 0);
  return { route, score, index };
};
const rankRoutes = (routes) => routes.map(rankRoute).sort(
  (a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
);
const pick = (routes, uri) => {
  let match;
  let default_;
  const [uriPathname] = uri.split("?");
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === "";
  const ranked = rankRoutes(routes);
  for (let i = 0, l = ranked.length; i < l; i++) {
    const route = ranked[i].route;
    let missed = false;
    if (route.default) {
      default_ = {
        route,
        params: {},
        uri
      };
      continue;
    }
    const routeSegments = segmentize(route.path);
    const params = {};
    const max = Math.max(uriSegments.length, routeSegments.length);
    let index = 0;
    for (; index < max; index++) {
      const routeSegment = routeSegments[index];
      const uriSegment = uriSegments[index];
      if (routeSegment && routeSegment[0] === "*") {
        const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);
        params[splatName] = uriSegments.slice(index).map(decodeURIComponent).join("/");
        break;
      }
      if (typeof uriSegment === "undefined") {
        missed = true;
        break;
      }
      const dynamicMatch = PARAM.exec(routeSegment);
      if (dynamicMatch && !isRootUri) {
        const value = decodeURIComponent(uriSegment);
        params[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        missed = true;
        break;
      }
    }
    if (!missed) {
      match = {
        route,
        params,
        uri: "/" + uriSegments.slice(0, index).join("/")
      };
      break;
    }
  }
  return match || default_ || null;
};
const addQuery = (pathname, query) => pathname + (query ? `?${query}` : "");
const resolve = (to, base) => {
  if (to.startsWith("/"))
    return to;
  const [toPathname, toQuery] = to.split("?");
  const [basePathname] = base.split("?");
  const toSegments = segmentize(toPathname);
  const baseSegments = segmentize(basePathname);
  if (toSegments[0] === "")
    return addQuery(basePathname, toQuery);
  if (!toSegments[0].startsWith(".")) {
    const pathname = baseSegments.concat(toSegments).join("/");
    return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
  }
  const allSegments = baseSegments.concat(toSegments);
  const segments = [];
  allSegments.forEach((segment) => {
    if (segment === "..")
      segments.pop();
    else if (segment !== ".")
      segments.push(segment);
  });
  return addQuery("/" + segments.join("/"), toQuery);
};
const combinePaths = (basepath, path) => `${stripSlashes(
  path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
)}/`;
const canUseDOM = () => typeof window !== "undefined" && "document" in window && "location" in window;
const Link = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let ariaCurrent;
  let $$restProps = compute_rest_props($$props, ["to", "replace", "state", "getProps"]);
  let $location, $$unsubscribe_location;
  let $base, $$unsubscribe_base;
  let { to = "#" } = $$props;
  let { replace = false } = $$props;
  let { state = {} } = $$props;
  let { getProps = () => ({}) } = $$props;
  const location = getContext(LOCATION);
  $$unsubscribe_location = subscribe(location, (value) => $location = value);
  const { base } = getContext(ROUTER);
  $$unsubscribe_base = subscribe(base, (value) => $base = value);
  getContext(HISTORY);
  createEventDispatcher();
  let href, isPartiallyCurrent, isCurrent, props;
  if ($$props.to === void 0 && $$bindings.to && to !== void 0)
    $$bindings.to(to);
  if ($$props.replace === void 0 && $$bindings.replace && replace !== void 0)
    $$bindings.replace(replace);
  if ($$props.state === void 0 && $$bindings.state && state !== void 0)
    $$bindings.state(state);
  if ($$props.getProps === void 0 && $$bindings.getProps && getProps !== void 0)
    $$bindings.getProps(getProps);
  href = to === "/" ? $base.uri : resolve(to, $base.uri);
  isPartiallyCurrent = $location.pathname.startsWith(href);
  isCurrent = href === $location.pathname;
  ariaCurrent = isCurrent ? "page" : void 0;
  props = getProps({
    location: $location,
    href,
    isPartiallyCurrent,
    isCurrent,
    existingProps: $$restProps
  });
  $$unsubscribe_location();
  $$unsubscribe_base();
  return `<a${spread(
    [
      { href: escape_attribute_value(href) },
      {
        "aria-current": escape_attribute_value(ariaCurrent)
      },
      escape_object(props),
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({ active: !!ariaCurrent }) : ``}</a>`;
});
const Route = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $activeRoute, $$unsubscribe_activeRoute;
  let { path = "" } = $$props;
  let { component = null } = $$props;
  let routeParams = {};
  let routeProps = {};
  const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
  $$unsubscribe_activeRoute = subscribe(activeRoute, (value) => $activeRoute = value);
  const route = {
    path,
    // If no path prop is given, this Route will act as the default Route
    // that is rendered if no other Route in the Router is a match.
    default: path === ""
  };
  registerRoute(route);
  onDestroy(() => {
    unregisterRoute(route);
  });
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  {
    if ($activeRoute && $activeRoute.route === route) {
      routeParams = $activeRoute.params;
      const { component: c, path: path2, ...rest } = $$props;
      routeProps = rest;
      if (c) {
        if (c.toString().startsWith("class "))
          component = c;
        else
          component = c();
      }
      canUseDOM() && window?.scrollTo(0, 0);
    }
  }
  $$unsubscribe_activeRoute();
  return `${$activeRoute && $activeRoute.route === route ? `${component ? `${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return ``;
    }
    return function(resolvedComponent) {
      return `
            ${validate_component(resolvedComponent?.default || resolvedComponent || missing_component, "svelte:component").$$render($$result, Object.assign({}, routeParams, routeProps), {}, {})}
        `;
    }(__value);
  }(component)}` : `${slots.default ? slots.default({ params: routeParams }) : ``}`}` : ``}`;
});
const getLocation = (source) => {
  return {
    ...source.location,
    state: source.history.state,
    key: source.history.state && source.history.state.key || "initial"
  };
};
const createHistory = (source) => {
  const listeners = [];
  let location = getLocation(source);
  return {
    get location() {
      return location;
    },
    listen(listener) {
      listeners.push(listener);
      const popstateListener = () => {
        location = getLocation(source);
        listener({ location, action: "POP" });
      };
      source.addEventListener("popstate", popstateListener);
      return () => {
        source.removeEventListener("popstate", popstateListener);
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    },
    navigate(to, { state, replace = false } = {}) {
      state = { ...state, key: Date.now() + "" };
      try {
        if (replace)
          source.history.replaceState(state, "", to);
        else
          source.history.pushState(state, "", to);
      } catch (e) {
        source.location[replace ? "replace" : "assign"](to);
      }
      location = getLocation(source);
      listeners.forEach(
        (listener) => listener({ location, action: "PUSH" })
      );
      document.activeElement.blur();
    }
  };
};
const createMemorySource = (initialPathname = "/") => {
  let index = 0;
  const stack = [{ pathname: initialPathname, search: "" }];
  const states = [];
  return {
    get location() {
      return stack[index];
    },
    addEventListener(name, fn) {
    },
    removeEventListener(name, fn) {
    },
    history: {
      get entries() {
        return stack;
      },
      get index() {
        return index;
      },
      get state() {
        return states[index];
      },
      pushState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        index++;
        stack.push({ pathname, search });
        states.push(state);
      },
      replaceState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        stack[index] = { pathname, search };
        states[index] = state;
      }
    }
  };
};
const globalHistory = createHistory(
  canUseDOM() ? window : createMemorySource()
);
const Router = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $location, $$unsubscribe_location;
  let $routes, $$unsubscribe_routes;
  let $base, $$unsubscribe_base;
  let $activeRoute, $$unsubscribe_activeRoute;
  let { basepath = "/" } = $$props;
  let { url = null } = $$props;
  let { history = globalHistory } = $$props;
  setContext(HISTORY, history);
  const locationContext = getContext(LOCATION);
  const routerContext = getContext(ROUTER);
  const routes = writable([]);
  $$unsubscribe_routes = subscribe(routes, (value) => $routes = value);
  const activeRoute = writable(null);
  $$unsubscribe_activeRoute = subscribe(activeRoute, (value) => $activeRoute = value);
  let hasActiveRoute = false;
  const location = locationContext || writable(url ? { pathname: url } : history.location);
  $$unsubscribe_location = subscribe(location, (value) => $location = value);
  const base = routerContext ? routerContext.routerBase : writable({ path: basepath, uri: basepath });
  $$unsubscribe_base = subscribe(base, (value) => $base = value);
  const routerBase = derived([base, activeRoute], ([base2, activeRoute2]) => {
    if (!activeRoute2)
      return base2;
    const { path: basepath2 } = base2;
    const { route, uri } = activeRoute2;
    const path = route.default ? basepath2 : route.path.replace(/\*.*$/, "");
    return { path, uri };
  });
  const registerRoute = (route) => {
    const { path: basepath2 } = $base;
    let { path } = route;
    route._path = path;
    route.path = combinePaths(basepath2, path);
    if (typeof window === "undefined") {
      if (hasActiveRoute)
        return;
      const matchingRoute = pick([route], $location.pathname);
      if (matchingRoute) {
        activeRoute.set(matchingRoute);
        hasActiveRoute = true;
      }
    } else {
      routes.update((rs) => [...rs, route]);
    }
  };
  const unregisterRoute = (route) => {
    routes.update((rs) => rs.filter((r) => r !== route));
  };
  if (!locationContext) {
    setContext(LOCATION, location);
  }
  setContext(ROUTER, {
    activeRoute,
    base,
    routerBase,
    registerRoute,
    unregisterRoute
  });
  if ($$props.basepath === void 0 && $$bindings.basepath && basepath !== void 0)
    $$bindings.basepath(basepath);
  if ($$props.url === void 0 && $$bindings.url && url !== void 0)
    $$bindings.url(url);
  if ($$props.history === void 0 && $$bindings.history && history !== void 0)
    $$bindings.history(history);
  {
    {
      const { path: basepath2 } = $base;
      routes.update((rs) => rs.map((r) => Object.assign(r, { path: combinePaths(basepath2, r._path) })));
    }
  }
  {
    {
      const bestMatch = pick($routes, $location.pathname);
      activeRoute.set(bestMatch);
    }
  }
  $$unsubscribe_location();
  $$unsubscribe_routes();
  $$unsubscribe_base();
  $$unsubscribe_activeRoute();
  return `${slots.default ? slots.default({
    route: $activeRoute && $activeRoute.uri,
    location: $location
  }) : ``}`;
});
const data1 = [
  {
    id: 1,
    name: "Toyota",
    description: "Let's Go Places",
    data2: [
      { id: 1, model: "Innova Hycross", price: "Rs. 19.67 Lakh Onwards" },
      { id: 2, model: "Toyota Urban Cruiser", price: "Rs. 10.86 Lakh Onwards" },
      { id: 3, model: "Toyota Fortuner", price: "Rs. 32.98 Lakh Onwards" },
      { id: 4, model: "Toyota Glanza", price: "Rs. 6.81 Lakh Onwards" },
      { id: 5, model: "Toyota Land Cruiser", price: "Rs. 2.10 Crore Onwards" },
      { id: 6, model: "Toyota Innova Crysta", price: "Rs. 43.22 Lakh Onwards" },
      { id: 7, model: "Toyota Vellfire", price: "Rs. 96.44 Lakh Onwards" },
      { id: 8, model: "Toyota Hilux", price: "Rs. 30.41 Lakh Onwards" }
    ]
  },
  {
    id: 2,
    name: "Ford",
    description: "Description of Company 2",
    data2: [
      { model: "Ford EcoSport", price: "Rs. 7.91 Lakh Onwards" },
      { model: "Ford Endeavour", price: "Rs. 29.19 Lakh Onwards" },
      { model: "Ford Figo", price: "Rs. 5.23 Lakh Onwards" },
      { model: "Ford Aspire", price: "Rs. 5.99 Lakh Onwards" },
      { model: "Ford Freestyle", price: "Rs. 5.91 Lakh Onwards" },
      { model: "Ford Mustang", price: "Rs. 74.61 Lakh Onwards" },
      { model: "Ford Fiesta", price: "Rs. 8.63 Lakh Onwards" },
      { model: "Ford Icon", price: "Rs. 4.97 Lakh Onwards" }
    ]
  },
  {
    id: 3,
    name: "Tata",
    description: "Description of Company 2",
    data2: [
      { model: "Tata Harrier", price: "Rs. 15.20 Lakh Onwards" },
      { model: "Tata Altroz", price: "Rs. 6.60 Lakh Onwards" },
      { model: "Tata Nexon", price: "Rs. 8.00 Lakh Onwards" },
      { model: "Tata Punch", price: "Rs. 6.00 Lakh Onwards" },
      { model: "Tata Tiago", price: "Rs. 5.60 Lakh Onwards" },
      { model: "Tata Sagfari", price: "Rs. 15.85 Lakh Onwards" },
      { model: "Tata Tigore", price: "Rs. 6.30 Lakh Onwards" },
      { model: "Tata Curvv", price: "Rs. 15.60 Lakh Onwards" }
    ]
  }
  // Add more companies and their data as needed
];
const SideBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredData1;
  let { data1: data12 } = $$props;
  let { setSelectedCard } = $$props;
  let searchQuery = "";
  if ($$props.data1 === void 0 && $$bindings.data1 && data12 !== void 0)
    $$bindings.data1(data12);
  if ($$props.setSelectedCard === void 0 && $$bindings.setSelectedCard && setSelectedCard !== void 0)
    $$bindings.setSelectedCard(setSelectedCard);
  filteredData1 = data12.filter((card) => card.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return `<div class="w-1/4 bg-gray-200 p-4 h-full"><input type="text" placeholder="Search for a card..." class="w-full p-2 mb-4 rounded"${add_attribute("value", searchQuery, 0)}>

  ${each(filteredData1, (card) => {
    return `<div class="bg-white p-4 mb-2 cursor-pointer hover:bg-gray-100"><h2 class="font-semibold">${escape(card.name)}</h2>
      <p class="text-sm">${escape(card.description)}</p>
    </div>`;
  })}</div>`;
});
const Content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { selectedCard } = $$props;
  let { setSelectedCard } = $$props;
  let searchQuery = "";
  if ($$props.selectedCard === void 0 && $$bindings.selectedCard && selectedCard !== void 0)
    $$bindings.selectedCard(selectedCard);
  if ($$props.setSelectedCard === void 0 && $$bindings.setSelectedCard && setSelectedCard !== void 0)
    $$bindings.setSelectedCard(setSelectedCard);
  {
    if (selectedCard) {
      sessionStorage.setItem("selectedCard", JSON.stringify(selectedCard));
    }
  }
  return `<div class="w-full bg-gray-100 p-4">${validate_component(Link, "Link").$$render($$result, { to: "/content" }, {}, {
    default: () => {
      return `<button class="mb-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center">Expand
    </button>`;
    }
  })}
  ${selectedCard ? `<h1 class="text-xl mb-4 font-semibold">Selected Card: ${escape(selectedCard.name)}</h1>

    <button class="bg-green-500 text-white px-4 py-2 rounded">Add New Card
</button>

    
    

    <input type="text" placeholder="Search nested data..." class="w-full p-2 mb-4 rounded"${add_attribute("value", searchQuery, 0)}>

  ${selectedCard.data2 && selectedCard.data2.length > 0 ? `${each(selectedCard.data2.filter((nestedData) => nestedData.model.toLowerCase().includes(searchQuery.toLowerCase())), (nestedData, index) => {
    return `<div${add_attribute("key", index, 0)} class="bg-gray-300 p-2 mb-2"><h2 class="font-semibold">${escape(nestedData.model)}</h2>
      <p class="text-sm">${escape(nestedData.price)}</p>
    </div>`;
  })}` : `<p>No nested data found.</p>`}

    ` : `<p class="text-xl">Select a card from the sidebar to view its details.</p>`}
 ${``}</div>`;
});
const Page1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedCard;
  function setSelectedCard(card) {
    selectedCard = card;
  }
  return `<div class="flex bg-gray-100 min-h-screen">${validate_component(SideBar, "Sidebar").$$render(
    $$result,
    {
      class: "w-1/4 p-4",
      data1,
      setSelectedCard
    },
    {},
    {}
  )}

  ${selectedCard ? `${validate_component(Content, "Content").$$render(
    $$result,
    {
      class: "w-3/4 p-4",
      selectedCard,
      setSelectedCard
    },
    {},
    {}
  )}` : ``}</div>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedCard = null;
  return `${validate_component(Router, "Router").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}
  ${validate_component(Route, "Route").$$render($$result, { path: "/" }, {}, {
        default: () => {
          return `${validate_component(Page1, "Page1").$$render(
            $$result,
            {
              selectedCard,
              setSelectedCard: (val) => selectedCard = val
            },
            {},
            {}
          )}`;
        }
      })}
  ${validate_component(Route, "Route").$$render($$result, { path: "/content" }, {}, {
        default: () => {
          return `${validate_component(Content, "Content").$$render(
            $$result,
            {
              selectedCard,
              setSelectedCard: (val) => selectedCard = val
            },
            {},
            {}
          )}`;
        }
      })}`;
    }
  })}`;
});
export {
  Layout as default
};
