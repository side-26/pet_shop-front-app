export const PATHS = {
  HOME: '/',
  PETS: '/pets',
  PRODUCTS: '/products',
  CART: '/cart',
  PROFILE: '/profile',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGET_PASSWORD: '/forget-password',
  },
  UI_COMPONENTS: '/ui-components',
} as const;

export const routePaths = {
  home: PATHS.HOME,
  pets: PATHS.PETS,
  products: PATHS.PRODUCTS,
  cart: PATHS.CART,
  profile: PATHS.PROFILE,
  login: PATHS.AUTH.LOGIN,
  register: PATHS.AUTH.REGISTER,
  forgetPassword: PATHS.AUTH.FORGET_PASSWORD,
  uiComponents: PATHS.UI_COMPONENTS,
} as const;
