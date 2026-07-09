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

export function exportProcessArtifact(key: string, dataUrl: string) {
  const ext = extensionFromDataUrl(dataUrl);
  const filename = `process-${key.replace(":", "-")}.${ext}`;
  const publicPath = `/artifacts/process/${filename}`;
  const snippet = `  "${key}": "${publicPath}",`;

  downloadDataUrl(dataUrl, filename);

  const fullSnippet = `// client/public/artifacts/process/${filename}\nprocessArtifactImages: {\n${snippet}\n}`;

  void navigator.clipboard?.writeText(snippet);

  return { filename, publicPath, snippet: fullSnippet };
}

export function exportProductArtifacts(
  productId: string,
  dataUrls: string[]
) {
  const lines: string[] = [];
  const files: string[] = [];

  dataUrls.forEach((dataUrl, index) => {
    const ext = extensionFromDataUrl(dataUrl);
    const num = String(index + 1).padStart(2, "0");
    const filename = `${productId}-${num}.${ext}`;
    const publicPath = `/artifacts/${productId}/${filename}`;
    downloadDataUrl(dataUrl, filename);
    lines.push(`"${publicPath}"`);
    files.push(filename);
  });

  const snippet = `// client/public/artifacts/${productId}/\nproductArtifactImages.${productId} = [${lines.join(", ")}];`;
  void navigator.clipboard?.writeText(
    `productArtifactImages.${productId} = [${lines.join(", ")}];`
  );

  return { files, snippet };
}
