function extensionFromDataUrl(dataUrl: string): string {
  if (dataUrl.startsWith("data:image/png")) return "png";
  if (dataUrl.startsWith("data:image/webp")) return "webp";
  if (dataUrl.startsWith("data:image/gif")) return "gif";
  return "jpg";
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

type ExportOk = {
  ok: true;
  publicPath?: string;
  publicPaths?: string[];
  key?: string;
  productId?: string;
};

type ExportErr = { ok: false; error: string };

/** Writes file into client/public/artifacts and updates staticArtifacts.ts (dev only). */
export async function publishProcessArtifact(
  key: string,
  dataUrl: string
): Promise<ExportOk> {
  const res = await fetch("/__viktor__/export-artifact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "process", key, dataUrl }),
  });
  const json = (await res.json()) as ExportOk | ExportErr;
  if (!res.ok || !json.ok) {
    throw new Error(
      !json.ok ? json.error : `Export failed (${res.status})`
    );
  }
  return json;
}

export async function publishProductArtifacts(
  productId: string,
  dataUrls: string[]
): Promise<ExportOk> {
  const res = await fetch("/__viktor__/export-artifact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "product", productId, dataUrls }),
  });
  const json = (await res.json()) as ExportOk | ExportErr;
  if (!res.ok || !json.ok) {
    throw new Error(
      !json.ok ? json.error : `Export failed (${res.status})`
    );
  }
  return json;
}

export async function publishStackArtifacts(
  stackId: string,
  dataUrls: string[]
): Promise<ExportOk> {
  const res = await fetch("/__viktor__/export-artifact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "stack", stackId, dataUrls }),
  });
  const json = (await res.json()) as ExportOk | ExportErr;
  if (!res.ok || !json.ok) {
    throw new Error(
      !json.ok ? json.error : `Export failed (${res.status})`
    );
  }
  return json;
}

/** Fallback if not on vite dev server */
export function exportProcessArtifact(key: string, dataUrl: string) {
  const ext = extensionFromDataUrl(dataUrl);
  const filename = `process-${key.replace(":", "-")}.${ext}`;
  const publicPath = `/artifacts/process/${filename}`;
  const snippet = `  "${key}": "${publicPath}",`;
  downloadDataUrl(dataUrl, filename);
  void navigator.clipboard?.writeText(snippet);
  return { filename, publicPath, snippet };
}
