/**
 * Utility to compute robust browser-resolvable URLs for public assets.
 * Handles both local development and Internet Computer deployment scenarios.
 */

/**
 * Attempts to resolve a public asset URL that works in both development and IC production.
 * @param canonicalPath - The canonical public asset path (e.g., "/assets/generated/image.jpg")
 * @returns The resolved URL that should work in the current environment
 */
export function getPublicAssetUrl(canonicalPath: string): string {
  // In production on IC, assets are served from the same origin
  // In development, Vite serves them from the public directory
  // Both should work with the canonical path, but we provide this utility
  // for future flexibility if base path handling is needed
  
  // Remove leading slash if present for consistency
  const normalizedPath = canonicalPath.startsWith('/') ? canonicalPath.slice(1) : canonicalPath;
  
  // Return the canonical path with leading slash
  return `/${normalizedPath}`;
}

/**
 * Creates a fallback URL resolver that tries multiple path variations.
 * Useful for environments where base path might vary.
 * @param canonicalPath - The canonical public asset path
 * @returns Array of URLs to try in order
 */
export function getAssetUrlFallbacks(canonicalPath: string): string[] {
  const urls: string[] = [];
  
  // Primary: canonical path
  urls.push(getPublicAssetUrl(canonicalPath));
  
  // Fallback: try with explicit /public prefix (some build configs)
  if (!canonicalPath.includes('/public/')) {
    const withPublic = canonicalPath.replace('/assets/', '/public/assets/');
    urls.push(withPublic);
  }
  
  // Fallback: try without leading slash (relative)
  const relativePath = canonicalPath.startsWith('/') ? canonicalPath.slice(1) : canonicalPath;
  if (relativePath !== canonicalPath) {
    urls.push(relativePath);
  }
  
  return urls;
}
