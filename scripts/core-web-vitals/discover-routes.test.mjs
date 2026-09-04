import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { discoverAppRoutes } from './discover-routes.mjs';

async function createPage(appDirectory, routeDirectory) {
  const directory = path.join(appDirectory, routeDirectory);
  await mkdir(directory, { recursive: true });
  await writeFile(
    path.join(directory, 'page.tsx'),
    'export default function Page() { return null; }',
  );
}

test('discovers static, grouped, and configured dynamic App Router pages', async () => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'petshop-cwv-routes-'));
  const appDirectory = path.join(temporaryDirectory, 'app');

  try {
    await createPage(appDirectory, '(default)');
    await createPage(appDirectory, '(auth)/login');
    await createPage(appDirectory, 'products/[slug]');

    const routes = await discoverAppRoutes({
      appDirectory,
      dynamicRouteFixtures: { '/products/[slug]': ['/products/sample-product'] },
    });

    assert.deepEqual(
      routes.map(({ pathname, routeTemplate }) => ({ pathname, routeTemplate })),
      [
        { pathname: '/', routeTemplate: '/' },
        { pathname: '/login', routeTemplate: '/login' },
        { pathname: '/products/sample-product', routeTemplate: '/products/[slug]' },
      ],
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test('fails when a dynamic page has no concrete URL fixture', async () => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'petshop-cwv-routes-'));
  const appDirectory = path.join(temporaryDirectory, 'app');

  try {
    await createPage(appDirectory, 'pets/[slug]');
    await assert.rejects(
      discoverAppRoutes({ appDirectory }),
      /needs a concrete URL in core-web-vitals\.routes\.mjs/,
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});
