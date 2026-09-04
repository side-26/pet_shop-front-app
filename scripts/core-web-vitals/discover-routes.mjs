import { readdir } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import path from 'node:path';

const PAGE_FILE_PATTERN = /^page\.(?:js|jsx|ts|tsx)$/;

async function findPageFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findPageFiles(entryPath);
      return entry.isFile() && PAGE_FILE_PATTERN.test(entry.name) ? [entryPath] : [];
    }),
  );

  return nestedFiles.flat();
}

function findPageFilesSync(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findPageFilesSync(entryPath);
    return entry.isFile() && PAGE_FILE_PATTERN.test(entry.name) ? [entryPath] : [];
  });
}

function isRouteGroup(segment) {
  return segment.startsWith('(') && segment.endsWith(')');
}

function isNonUrlSegment(segment) {
  return isRouteGroup(segment) || segment.startsWith('@') || segment.startsWith('_');
}

function toRouteTemplate(appDirectory, pageFile) {
  const relativeDirectory = path.relative(appDirectory, path.dirname(pageFile));
  const segments = relativeDirectory
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => !isNonUrlSegment(segment));

  return segments.length ? `/${segments.join('/')}` : '/';
}

function isDynamicRoute(routeTemplate) {
  return routeTemplate.includes('[');
}

function normalizeFixture(routeTemplate, fixture) {
  if (typeof fixture !== 'string' || !fixture.startsWith('/') || fixture.includes('[')) {
    throw new Error(`Invalid Core Web Vitals fixture "${fixture}" for ${routeTemplate}.`);
  }

  return fixture;
}

export async function discoverAppRoutes({
  appDirectory = path.resolve('src/app'),
  dynamicRouteFixtures = {},
} = {}) {
  const pageFiles = await findPageFiles(appDirectory);
  return resolvePageFiles({ appDirectory, dynamicRouteFixtures, pageFiles });
}

export function discoverAppRoutesSync({
  appDirectory = path.resolve('src/app'),
  dynamicRouteFixtures = {},
} = {}) {
  const pageFiles = findPageFilesSync(appDirectory);
  return resolvePageFiles({ appDirectory, dynamicRouteFixtures, pageFiles });
}

function resolvePageFiles({ appDirectory, dynamicRouteFixtures, pageFiles }) {
  const discoveredRoutes = pageFiles.flatMap((pageFile) => {
    const routeTemplate = toRouteTemplate(appDirectory, pageFile);
    const sourceFile = path.relative(process.cwd(), pageFile).replaceAll(path.sep, '/');

    if (!isDynamicRoute(routeTemplate)) {
      return [{ routeTemplate, pathname: routeTemplate, sourceFile }];
    }

    const fixtures = dynamicRouteFixtures[routeTemplate];
    if (!Array.isArray(fixtures) || fixtures.length === 0) {
      throw new Error(
        `Dynamic App Router page ${sourceFile} needs a concrete URL in core-web-vitals.routes.mjs for ${routeTemplate}.`,
      );
    }

    return fixtures.map((fixture) => ({
      routeTemplate,
      pathname: normalizeFixture(routeTemplate, fixture),
      sourceFile,
    }));
  });

  return discoveredRoutes.sort((left, right) => left.pathname.localeCompare(right.pathname));
}
