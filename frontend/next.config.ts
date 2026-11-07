import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // backend v TypeScriptu
  transpilePackages: ["backend"],
  agentRules: false,
  // Tailwind
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
