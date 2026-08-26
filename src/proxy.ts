import { authMiddleware } from '@/app/core/middlewares/auth.middleware';
import { composeMiddlewares } from '@/app/core/middlewares/composer.middleware';
import { roleMiddleware } from '@/app/core/middlewares/role.middleware';

export const proxy = composeMiddlewares([authMiddleware, roleMiddleware]);

export const config = {
  matcher: [
    '/((?!api|_next|signout|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|.*\\.(?:png|jpe?g|svg|webp|gif|woff2?|ttf|eot|json|webmanifest)$).*)',
  ],
};
