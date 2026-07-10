/**
 * Published artifact images — visible to all visitors on production.
 * Put files in client/public/artifacts/ and list paths here, then push to git.
 *
 * Example:
 *   productArtifactImages.taika = ["/artifacts/taika/01.png", "/artifacts/taika/02.png"]
 *   processArtifactImages["3:2"] = "/artifacts/process/ux-wireframes.png"
 */

export const productArtifactImages: Record<string, string[]> = {
  // taika: ["/artifacts/taika/01.png"],
  taika: ["/artifacts/taika/taika-01.jpg", "/artifacts/taika/taika-02.jpg", "/artifacts/taika/taika-03.jpg", "/artifacts/taika/taika-04.jpg"],
  moo: ["/artifacts/moo/moo-01.jpg", "/artifacts/moo/moo-02.jpg", "/artifacts/moo/moo-03.jpg", "/artifacts/moo/moo-04.jpg", "/artifacts/moo/moo-05.jpg"],

};

export const stackArtifactImages: Record<string, string[]> = {
  // "design-to-code": ["/artifacts/stack/design-to-code-01.png"],
  "design-to-code": ["/artifacts/stack/design-to-code-01.png"],
  "supercharged-dev": ["/artifacts/stack/supercharged-dev-01.jpg"],
  "ai-integration": ["/artifacts/stack/ai-integration-01.png"],

};

export const processArtifactImages: Record<string, string> = {
  "0:0": "/artifacts/process/process-0-0.png",
  "0:1": "/artifacts/process/process-0-1.png",
  "0:2": "/artifacts/process/process-0-2.png",
  "0:3": "/artifacts/process/process-0-3.png",
  "0:4": "/artifacts/process/process-0-4.png",
  "1:0": "/artifacts/process/process-1-0.png",
  "1:1": "/artifacts/process/process-1-1.png",
  "1:2": "/artifacts/process/process-1-2.png",
  "1:3": "/artifacts/process/process-1-3.png",
  "1:4": "/artifacts/process/process-1-4.png",
  "2:0": "/artifacts/process/process-2-0.png",
  "2:1": "/artifacts/process/process-2-1.png",
  "2:2": "/artifacts/process/process-2-2.png",
  "2:3": "/artifacts/process/process-2-3.png",
  "2:4": "/artifacts/process/process-2-4.png",
  "3:0": "/artifacts/process/process-3-0.png",
  "3:1": "/artifacts/process/process-3-1.png",
  "3:2": "/artifacts/process/process-3-2.png",
  "3:3": "/artifacts/process/process-3-3.png",
  "3:4": "/artifacts/process/process-3-4.png",
  "4:0": "/artifacts/process/process-4-0.png",
  "4:1": "/artifacts/process/process-4-1.png",
  "4:2": "/artifacts/process/process-4-2.png",
  "4:3": "/artifacts/process/process-4-3.png",
  "4:4": "/artifacts/process/process-4-4.png",
  "5:0": "/artifacts/process/process-5-0.png",
  "5:1": "/artifacts/process/process-5-1.png",
  "5:2": "/artifacts/process/process-5-2.png",
  "5:3": "/artifacts/process/process-5-3.png",
  "5:4": "/artifacts/process/process-5-4.png",
  "6:0": "/artifacts/process/process-6-0.png",
  "6:1": "/artifacts/process/process-6-1.png",
  "6:2": "/artifacts/process/process-6-2.png",
  "6:3": "/artifacts/process/process-6-3.png",
  "6:4": "/artifacts/process/process-6-4.png",
  "7:0": "/artifacts/process/process-7-0.png",
  "7:1": "/artifacts/process/process-7-1.png",
  "7:2": "/artifacts/process/process-7-2.png",
  "7:3": "/artifacts/process/process-7-3.png",
  "7:4": "/artifacts/process/process-7-4.png",

};

export function getStackImages(
  stackId: string,
  localImages: string[],
  isAdmin: boolean
): string[] {
  const published = stackArtifactImages[stackId] ?? [];
  if (isAdmin && localImages.length > 0) return localImages;
  if (published.length > 0) return published;
  return isAdmin ? localImages : [];
}

export function getProductImages(
  productId: string,
  localImages: string[],
  isAdmin: boolean
): string[] {
  const published = productArtifactImages[productId] ?? [];
  if (isAdmin && localImages.length > 0) return localImages;
  if (published.length > 0) return published;
  return isAdmin ? localImages : [];
}

export function isProcessLocalDraft(
  preview: string | null | undefined
): preview is string {
  return (
    typeof preview === "string" &&
    (preview.startsWith("data:") || preview.startsWith("blob:")) &&
    preview.length > 256
  );
}

export function getProcessPreview(
  key: string,
  localPreview: string | null | undefined,
  isAdmin: boolean
): string | undefined {
  const published = processArtifactImages[key];
  if (isAdmin) {
    if (localPreview === null) return undefined;
    if (isProcessLocalDraft(localPreview)) return localPreview;
    return published;
  }
  if (published) return published;
  return undefined;
}
