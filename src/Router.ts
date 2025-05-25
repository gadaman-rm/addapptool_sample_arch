import resourceManager from "./manager/lifecycle/ResourceManager";

class Router {
  routes: { [key: string]: (option?: any) => void };
  routEndHandlerArr: (() => void)[] = [];
  nowRoute: string;
  constructor() {
    this.routes = {};
    this.nowRoute = "/login";

    // Listen for back/forward browser navigation
    window.addEventListener("popstate", () => {
      this.endPageLoading();
      this.handleRoute(location.pathname);
    });
  }

  // Method to register routes
  addRoute(path: string, handler: (option?: any) => void) {
    this.routes[path] = handler;
  }

  // Method to navigate to a route
  navigateTo(path: string, option?: any) {
    this.endPageLoading();
    history.pushState({}, "", path);
    this.handleRoute(path, option);
    this.nowRoute = path;
  }

  // Route handling logic
  handleRoute(path: string, option?: any) {
    const routeHandler = this.routes[path] || this.routes["/404"];
    routeHandler(option);
  }

  endPageLoading() {
    resourceManager.clearAll();
    if (this.routEndHandlerArr.length) {
      this.routEndHandlerArr.pop()!();
    }
  }

  registerRouteEndHandler(handler: () => void) {
    this.routEndHandlerArr.push(handler);
  }
}

export const router = new Router();
