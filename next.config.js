const createNextIntlPlugin = require("next-intl/plugin");
const path = require("path");

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
      },
      {
        protocol: "https",
        hostname: "repository-images.githubusercontent.com",
      },
    ],
    minimumCacheTTL: 600,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    silenceDeprecations: ["mixed-decls", "legacy-js-api"],
  },
};

module.exports = withNextIntl(nextConfig);
