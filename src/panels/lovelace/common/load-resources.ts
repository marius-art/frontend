import { loadModule, loadCSS, loadJS } from "../../../common/dom/load_resource";

import { LovelaceConfig } from "../../../data/lovelace";

// Resources should only be imported once.
const CSS_CACHE = {};
const JS_CACHE = {};
const MODULE_CACHE = {};

export const loadLovelaceResources = (
  resources: NonNullable<LovelaceConfig["resources"]>,
  hassUrl: string
) =>
  resources.forEach((resource) => {
    const normalizedUrl = new URL(resource.url, hassUrl).toString();
    switch (resource.type) {
      case "css":
        if (normalizedUrl in CSS_CACHE) {
          break;
        }
        CSS_CACHE[normalizedUrl] = loadCSS(normalizedUrl);
        break;

      case "js":
        if (normalizedUrl in JS_CACHE) {
          break;
        }
        JS_CACHE[normalizedUrl] = loadJS(normalizedUrl);
        break;

      case "module":
        if (normalizedUrl in MODULE_CACHE) {
          break;
        }
        MODULE_CACHE[normalizedUrl] = loadModule(normalizedUrl);
        break;

      case "html":
        import(/* webpackChunkName: "import-href-polyfill" */ "../../../resources/html-import/import-href").then(
          ({ importHref }) => importHref(normalizedUrl)
        );
        break;

      default:
        // tslint:disable-next-line
        console.warn(`Unknown resource type specified: ${resource.type}`);
    }
  });
