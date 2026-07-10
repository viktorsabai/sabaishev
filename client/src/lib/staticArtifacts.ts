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
};

export const stackArtifactImages: Record<string, string[]> = {
  // "design-to-code": ["/artifacts/stack/design-to-code-01.png"],
};

export const processArtifactImages: Record<string, string> = {
  "0:0": "/artifacts/process/process-0-0.png",
  "0:1": "/artifacts/process/process-0-1.png",
  "0:2": "/artifacts/process/process-0-2.png",
  "0:3": "/artifacts/process/process-0-3.png",
  "0:4": "/artifacts/process/process-0-4.png",
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
