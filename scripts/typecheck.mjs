import { dependencyRequire } from "./dependencies.mjs";
import { dirname, resolve } from "node:path";
const ts = dependencyRequire("typescript");
const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  process.cwd(),
);
const typesRoot = dirname(
  dirname(dependencyRequire.resolve("@types/react/package.json")),
);
const options = {
  ...parsed.options,
  typeRoots: [typesRoot],
  baseUrl: process.cwd(),
  paths: {
    react: [resolve(typesRoot, "react/index.d.ts")],
    "react/jsx-runtime": [resolve(typesRoot, "react/jsx-runtime.d.ts")],
    "react-dom/client": [resolve(typesRoot, "react-dom/client.d.ts")],
  },
};
const program = ts.createProgram(parsed.fileNames, options);
const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
if (diagnostics.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getCanonicalFileName: (p) => p,
      getNewLine: () => "\n",
    }),
  );
  process.exit(1);
}
console.log("Typecheck passed.");
