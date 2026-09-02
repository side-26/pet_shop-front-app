import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { NextConfig } from 'next';

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'flagpedia.net', pathname: '/data/flags/**' }],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  ...(process.env.PETSHOP_CYPRESS_COMPONENT_TEST === 'true'
    ? {
        webpack(config, { webpack }) {
          config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(
              /^@\/entities\/auth\/auth\.actions$/,
              path.resolve(projectDirectory, 'cypress/support/auth.actions.mock.ts'),
            ),
          );

          return config;
        },
      }
    : {}),
};

export default nextConfig;
