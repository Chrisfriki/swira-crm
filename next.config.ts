import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const basePath = isGitHubPages ? '/swira-crm' : '';

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
