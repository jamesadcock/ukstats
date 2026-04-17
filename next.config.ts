import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  // Supports remark/rehype plugins here if needed
});

const nextConfig: NextConfig = {
  // Allow .mdx files to be treated as pages
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default withMDX(nextConfig);
