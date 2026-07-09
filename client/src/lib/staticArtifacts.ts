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

export const processArtifactImages: Record<string, string> = {
  // "0:0": "/artifacts/process/problem-statement.png",
};

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
