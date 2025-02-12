const createNextIntlPlugin = require("next-intl/plugin");
const path = require("path");

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    silenceDeprecations: ["mixed-decls", "legacy-js-api"],
  },
};

module.exports = withNextIntl(nextConfig);
