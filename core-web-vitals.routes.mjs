/**
 * Each dynamic App Router page must have at least one concrete URL.
 * Route discovery fails when a new dynamic page is missing from this map.
 */
export const dynamicRouteFixtures = {
  '/pets/[slug]': ['/pets/max'],
  '/products/[slug]': ['/products/adult-dog-food'],
};

/**
 * Optional safe interaction selectors, keyed by concrete URL or route template.
 * When omitted, the test clicks the first visible non-submit button and falls
 * back to a fixed, layout-neutral probe for pages without interactive controls.
 */
export const routeInteractionSelectors = {};
