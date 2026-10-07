const productDetailFixture =
  '/products/%D8%AA%D8%B4%D9%88%DB%8C%D9%82%DB%8C-%D8%A2%D9%85%D9%88%D8%B2%D8%B4%DB%8C-%D8%B3%DA%AF-%D8%A8%D8%A7-%D8%B7%D8%B9%D9%85-%DA%AF%D9%88%D8%B4%D8%AA-%D8%B3%DA%AF-%D8%AA%D8%B4%D9%88%DB%8C%D9%82%DB%8C-%D9%88-%D8%A7%D8%B3%D9%86%DA%A9-%D8%AA%D8%B4%D9%88%DB%8C%D9%82%DB%8C-%D8%A2%D9%85%D9%88%D8%B2%D8%B4%DB%8C';

/**
 * Each dynamic App Router page must have at least one concrete URL.
 * Route discovery fails when a new dynamic page is missing from this map.
 */
export const dynamicRouteFixtures = {
  '/pets/[slug]': ['/pets/pet-1x8uo2o'],
  '/products/[slug]': [productDetailFixture],
};

/**
 * Confirms that each configured fixture resolves to its real detail renderer,
 * rather than the app's successful-response 404 page.
 */
export const routeContentSelectors = {
  '/pets/pet-1x8uo2o': '[data-pet-detail-content]',
  [productDetailFixture]: '[data-product-detail-content]',
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
