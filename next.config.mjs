/** @type {import('next').NextConfig} */
// GitHub Pages serves a project site under /<repo>, so basePath is set via the
// PAGES_BASE_PATH env var in the Pages workflow only. Vercel and Render serve
// at the root and leave it empty.
const base = process.env.PAGES_BASE_PATH || "";
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: base || undefined,
  assetPrefix: base || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: base },
};
export default nextConfig;
