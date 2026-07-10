import fs from "node:fs";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";

type ProcessBody = {
  kind: "process";
  key: string;
  dataUrl: string;
};

type ProductBody = {
  kind: "product";
  productId: string;
  dataUrls: string[];
};

type StackBody = {
  kind: "stack";
  stackId: string;
  dataUrls: string[];
};

type Body = ProcessBody | ProductBody | StackBody;

function extFromDataUrl(dataUrl: string): string {
  if (dataUrl.startsWith("data:image/png")) return "png";
  if (dataUrl.startsWith("data:image/webp")) return "webp";
  if (dataUrl.startsWith("data:image/gif")) return "gif";
  return "jpg";
}

function writeDataUrl(filePath: string, dataUrl: string) {
  const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
}

function tsMapKey(key: string): string {
  return JSON.stringify(key);
}

function upsertMapEntry(
  filePath: string,
  mapName: "processArtifactImages" | "productArtifactImages" | "stackArtifactImages",
  key: string,
  valueLiteral: string
) {
  const keyLiteral = tsMapKey(key);
  let src = fs.readFileSync(filePath, "utf-8");
  const mapRe = new RegExp(
    `(export const ${mapName}[^=]*=\\s*\\{)([\\s\\S]*?)(\\n\\};)`
  );
  const match = src.match(mapRe);
  if (!match) throw new Error(`Could not find ${mapName} in staticArtifacts.ts`);

  let body = match[2];
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const entryRe = new RegExp(
    `\\n\\s*(?:${keyLiteral.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}|${escapedKey})\\s*:\\s*[^\\n]+,?`
  );

  if (entryRe.test(body)) {
    body = body.replace(entryRe, `\n  ${keyLiteral}: ${valueLiteral},`);
  } else {
    body = body.replace(/\n\s*$/, "");
    if (body.trim() && !body.trimEnd().endsWith(",")) {
      // keep as-is
    }
    body = `${body}\n  ${keyLiteral}: ${valueLiteral},\n`;
  }

  src = src.replace(mapRe, `$1${body}$3`);
  fs.writeFileSync(filePath, src, "utf-8");
}

function readJson(req: import("http").IncomingMessage): Promise<Body> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(Buffer.from(c)));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf-8")) as Body);
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

/** Dev-only: POST /__viktor__/export-artifact → writes files + updates staticArtifacts.ts */
export function vitePluginArtifactExport(projectRoot: string): Plugin {
  const publicRoot = path.join(projectRoot, "client", "public", "artifacts");
  const mapFile = path.join(
    projectRoot,
    "client",
    "src",
    "lib",
    "staticArtifacts.ts"
  );

  return {
    name: "viktor-artifact-export",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/__viktor__/export-artifact", async (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: "POST only" }));
          return;
        }

        try {
          const body = await readJson(req);

          if (body.kind === "process") {
            if (!body.key || !body.dataUrl) {
              throw new Error("key and dataUrl required");
            }
            const ext = extFromDataUrl(body.dataUrl);
            const filename = `process-${body.key.replace(":", "-")}.${ext}`;
            const abs = path.join(publicRoot, "process", filename);
            const publicPath = `/artifacts/process/${filename}`;
            writeDataUrl(abs, body.dataUrl);
            upsertMapEntry(
              mapFile,
              "processArtifactImages",
              body.key,
              `"${publicPath}"`
            );
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                ok: true,
                kind: "process",
                key: body.key,
                publicPath,
                file: abs,
              })
            );
            return;
          }

          if (body.kind === "product") {
            if (!body.productId || !body.dataUrls?.length) {
              throw new Error("productId and dataUrls required");
            }
            const safeId = body.productId.replace(/[^a-zA-Z0-9_-]/g, "");
            if (!safeId) throw new Error("invalid productId");
            const publicPaths: string[] = [];
            body.dataUrls.forEach((dataUrl, i) => {
              const ext = extFromDataUrl(dataUrl);
              const num = String(i + 1).padStart(2, "0");
              const filename = `${safeId}-${num}.${ext}`;
              const abs = path.join(publicRoot, safeId, filename);
              const publicPath = `/artifacts/${safeId}/${filename}`;
              writeDataUrl(abs, dataUrl);
              publicPaths.push(publicPath);
            });
            const list = `[${publicPaths.map((p) => `"${p}"`).join(", ")}]`;
            upsertMapEntry(mapFile, "productArtifactImages", safeId, list);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                ok: true,
                kind: "product",
                productId: safeId,
                publicPaths,
              })
            );
            return;
          }

          if (body.kind === "stack") {
            if (!body.stackId || !body.dataUrls?.length) {
              throw new Error("stackId and dataUrls required");
            }
            const safeId = body.stackId.replace(/[^a-zA-Z0-9_-]/g, "");
            if (!safeId) throw new Error("invalid stackId");
            const publicPaths: string[] = [];
            body.dataUrls.forEach((dataUrl, i) => {
              const ext = extFromDataUrl(dataUrl);
              const num = String(i + 1).padStart(2, "0");
              const filename = `${safeId}-${num}.${ext}`;
              const abs = path.join(publicRoot, "stack", filename);
              const publicPath = `/artifacts/stack/${filename}`;
              writeDataUrl(abs, dataUrl);
              publicPaths.push(publicPath);
            });
            const list = `[${publicPaths.map((p) => `"${p}"`).join(", ")}]`;
            upsertMapEntry(mapFile, "stackArtifactImages", safeId, list);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                ok: true,
                kind: "stack",
                stackId: safeId,
                publicPaths,
              })
            );
            return;
          }

          throw new Error("Unknown kind");
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              ok: false,
              error: e instanceof Error ? e.message : String(e),
            })
          );
        }
      });
    },
  };
}
