import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { NextConfig } from 'next';

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const dateFnsPathPattern = /node_modules[\\/]date-fns[\\/]/;

function excludeDateFnsFromNextSwcLoader(rules: unknown[]): void {
  for (const rule of rules) {
    if (!rule || typeof rule !== 'object') continue;

    const webpackRule = rule as {
      exclude?: RegExp | RegExp[];
      oneOf?: unknown[];
      use?: { loader?: string } | { loader?: string }[];
    };
    const loaders = Array.isArray(webpackRule.use) ? webpackRule.use : [webpackRule.use];
    const usesNextSwcLoader = loaders.some((loader) => loader?.loader?.includes('next-swc-loader'));

    if (usesNextSwcLoader) {
      const exclusions = webpackRule.exclude
        ? Array.isArray(webpackRule.exclude)
          ? webpackRule.exclude
          : [webpackRule.exclude]
        : [];
      webpackRule.exclude = [...exclusions, dateFnsPathPattern];
    }

    if (webpackRule.oneOf) excludeDateFnsFromNextSwcLoader(webpackRule.oneOf);
  }
}

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
          excludeDateFnsFromNextSwcLoader(config.module.rules);
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
