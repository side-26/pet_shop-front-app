export const PATHS = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGET_PASSWORD: '/forget-password',
  },
  UI_COMPONENTS: '/ui-components',
} as const;

export const routePaths = {
  home: PATHS.HOME,
  login: PATHS.AUTH.LOGIN,
  register: PATHS.AUTH.REGISTER,
  forgetPassword: PATHS.AUTH.FORGET_PASSWORD,
  uiComponents: PATHS.UI_COMPONENTS,
} as const;
