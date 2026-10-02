import { createRequire } from "node:module";
import { resolve } from "node:path";
// An external dependency root lets restricted workers build without repository caches.
export const dependencyRequire = createRequire(
  process.env.IMD_DEPENDENCY_ROOT
    ? resolve(process.env.IMD_DEPENDENCY_ROOT, "package.json")
    : new URL("../package.json", import.meta.url),
);
