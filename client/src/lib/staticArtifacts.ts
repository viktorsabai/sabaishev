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

export function getProcessPreview(
  key: string,
  localPreview: string | undefined,
  isAdmin: boolean
): string | undefined {
  const published = processArtifactImages[key];
  if (isAdmin && localPreview) return localPreview;
  if (published) return published;
  return isAdmin ? localPreview : undefined;
}
