// @vitest-environment node

import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

import { composeMiddlewares, type MiddlewareHandler } from './composer.middleware';

describe('composeMiddlewares', () => {
  it('runs middleware in declaration order', async () => {
    const calls: string[] = [];
    const first: MiddlewareHandler = async (_request, next) => {
      calls.push('first:before');
      const response = await next();
      calls.push('first:after');
      return response;
    };
    const second: MiddlewareHandler = async (_request, next) => {
      calls.push('second:before');
      const response = await next();
      calls.push('second:after');
      return response;
    };

    const response = await composeMiddlewares([first, second])(
      new NextRequest('https://petshop.test/cart'),
    );

    expect(response).toBeInstanceOf(NextResponse);
    expect(calls).toEqual(['first:before', 'second:before', 'second:after', 'first:after']);
  });

  it('stops the chain when middleware does not call next', async () => {
    const second = vi.fn(async () => NextResponse.next());
    const stop: MiddlewareHandler = async () => NextResponse.redirect('https://petshop.test/login');

    await composeMiddlewares([stop, second])(new NextRequest('https://petshop.test/cart'));

    expect(second).not.toHaveBeenCalled();
  });
});
