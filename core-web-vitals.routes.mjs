/**
 * Each dynamic App Router page must have at least one concrete URL.
 * Route discovery fails when a new dynamic page is missing from this map.
 */
export const dynamicRouteFixtures = {
  '/pets/[slug]': ['/pets/pet-1x8uo2o'],
  '/products/[slug]': ['/products/product-0de16436'],
};

/**
 * Confirms that each configured fixture resolves to its real detail renderer,
 * rather than the app's successful-response 404 page.
 */
export const routeContentSelectors = {
  '/pets/pet-1x8uo2o': '[data-pet-detail-content]',
  '/products/product-0de16436': '[data-product-detail-content]',
};

/**
 * Optional safe interaction selectors, keyed by concrete URL or route template.
 * When omitted, the test clicks the first visible non-submit button and falls
 * back to a fixed, layout-neutral probe for pages without interactive controls.
 */
export const routeInteractionSelectors = {
  '/ui-components':
    '[data-slot="calendar"] [data-day]:not([data-today="true"]):not([data-outside="true"]) button',
};
