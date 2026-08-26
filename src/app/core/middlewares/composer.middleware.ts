import { NextResponse, type NextRequest } from 'next/server';

export type MiddlewareNext = () => Promise<NextResponse>;

export type MiddlewareHandler = (
  request: NextRequest,
  next: MiddlewareNext,
) => Promise<NextResponse>;

export function composeMiddlewares(middlewares: readonly MiddlewareHandler[]) {
  return function composedMiddleware(request: NextRequest): Promise<NextResponse> {
    function dispatch(index: number): Promise<NextResponse> {
      const middleware = middlewares[index];

      if (!middleware) {
        return Promise.resolve(
          NextResponse.next({
            request: { headers: new Headers(request.headers) },
          }),
        );
      }

      return middleware(request, () => dispatch(index + 1));
    }

    return dispatch(0);
  };
}
