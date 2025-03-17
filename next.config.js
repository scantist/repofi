/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  images: {
    domains: ["storage.googleapis.com", "download.echocow.cn"],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty");
    return config;
  }
}

export default config;
