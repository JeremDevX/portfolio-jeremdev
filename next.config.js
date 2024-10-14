const createNextIntlPlugin = require("next-intl/plugin");
const path = require("path");

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  async redirects() {
    return [
      {
        source: "/:path((?!fr|en).*)",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
