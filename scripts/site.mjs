import { dependencyRequire } from "./dependencies.mjs";
import { cp, mkdir, readFile, rm, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { createServer } from "node:http";
const esbuild = dependencyRequire("esbuild");
const command = process.argv[2] || "dev";
const options = {
  entryPoints: ["src/main.tsx"],
  bundle: true,
  minify: true,
  format: "esm",
  outdir: "dist/assets",
  entryNames: "app-[hash]",
  assetNames: "[name]-[hash]",
  metafile: true,
  loader: { ".woff2": "file" },
  target: ["es2022"],
  define: { "process.env.NODE_ENV": '"production"' },
  alias: {
    react: dependencyRequire.resolve("react"),
    "react/jsx-runtime": dependencyRequire.resolve("react/jsx-runtime"),
    "react-dom/client": dependencyRequire.resolve("react-dom/client"),
    "react-dom": dependencyRequire.resolve("react-dom"),
  },
};
async function prepare() {
  await rm("dist", { recursive: true, force: true });
  await mkdir("dist", { recursive: true });
  await cp("public", "dist", { recursive: true });
}
async function html(result) {
  const outputs = Object.entries(result.metafile.outputs);
  const entry = outputs.find(([, info]) => info.entryPoint === "src/main.tsx");
  if (!entry) throw new Error("Missing JavaScript build output");
  const js = "./" + entry[0].replace(/^dist\//, "");
  const css = "./" + entry[1].cssBundle.replace(/^dist\//, "");
  const source = await readFile("index.html", "utf8");
  const { writeFile } = await import("node:fs/promises");
  await writeFile(
    "dist/index.html",
    source
      .replace("./src/main.tsx", js)
      .replace("</head>", `<link rel="stylesheet" href="${css}"/></head>`),
  );
}
if (command !== "preview") {
  await prepare();
  if (command === "dev") {
    const context = await esbuild.context({
      ...options,
      plugins: [
        {
          name: "export-html",
          setup(build) {
            build.onEnd(async (result) => {
              if (!result.errors.length) await html(result);
            });
          },
        },
      ],
    });
    await context.watch();
  } else {
    const result = await esbuild.build(options);
    await html(result);
    console.log(
      `Production export built: ${Object.keys(result.metafile.outputs).length} bundled assets + local media → dist/`,
    );
  }
}
if (command !== "build") {
  const root = resolve("dist");
  const mime = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".woff2": "font/woff2",
  };
  createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const file = resolve(
        root,
        "." + pathname + (pathname.endsWith("/") ? "index.html" : ""),
      );
      if (!file.startsWith(root + sep)) {
        res.writeHead(403).end();
        return;
      }
      const info = await stat(file);
      if (!info.isFile()) throw new Error("Not a file");
      res.writeHead(200, {
        "Content-Type": mime[extname(file)] || "application/octet-stream",
      });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404).end("Not found");
    }
  }).listen(4173, "127.0.0.1", () =>
    console.log("Preview: http://127.0.0.1:4173"),
  );
}
