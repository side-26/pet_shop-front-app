// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { cacheLifeMock, cacheTagMock, updateTagMock } = vi.hoisted(() => ({
  cacheLifeMock: vi.fn(),
  cacheTagMock: vi.fn(),
  updateTagMock: vi.fn(),
}));

vi.mock('next/cache', () => ({
  cacheLife: cacheLifeMock,
  cacheTag: cacheTagMock,
  updateTag: updateTagMock,
}));

import { EntityTag } from './entityCache';

describe('EntityTag', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds stable entity, list, detail, and query tags', () => {
    const products = new EntityTag('products');

    expect(products.all).toBe('products');
    expect(products.list).toBe('products:list');
    expect(products.detail('product-42')).toBe('products:detail:product-42');
    expect(products.query('page=2&sort=price')).toBe('products:query:page=2&sort=price');
  });

  it('keeps tags isolated by entity namespace', () => {
    const products = new EntityTag('products');
    const pets = new EntityTag('pets');

    expect(products.detail('42')).toBe('products:detail:42');
    expect(pets.detail('42')).toBe('pets:detail:42');
    expect(products.query('featured')).not.toBe(pets.query('featured'));
  });

  it('sets the cache lifetime through the Next.js cache primitive', () => {
    const products = new EntityTag('products');

    products.cacheLife({ stale: 60 });

    expect(cacheLifeMock).toHaveBeenCalledOnce();
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 60 });
  });

  it('registers the entity and list tags without an optional query key', () => {
    const products = new EntityTag('products');

    products.registerList();

    expect(cacheTagMock).toHaveBeenNthCalledWith(1, 'products');
    expect(cacheTagMock).toHaveBeenNthCalledWith(2, 'products:list');
    expect(cacheTagMock).toHaveBeenCalledTimes(2);
  });

  it('also registers a query-specific tag when a query key is present', () => {
    const products = new EntityTag('products');

    products.registerList('page=2');

    expect(cacheTagMock).toHaveBeenNthCalledWith(1, 'products');
    expect(cacheTagMock).toHaveBeenNthCalledWith(2, 'products:list');
    expect(cacheTagMock).toHaveBeenNthCalledWith(3, 'products:query:page=2');
    expect(cacheTagMock).toHaveBeenCalledTimes(3);
  });

  it('treats an empty query key like an omitted query key', () => {
    const products = new EntityTag('products');

    products.registerList('');

    expect(cacheTagMock).toHaveBeenCalledTimes(2);
    expect(cacheTagMock).not.toHaveBeenCalledWith('products:query:');
  });

  it('registers entity and detail tags together', () => {
    const products = new EntityTag('products');

    products.registerDetail('product-42');

    expect(cacheTagMock).toHaveBeenNthCalledWith(1, 'products');
    expect(cacheTagMock).toHaveBeenNthCalledWith(2, 'products:detail:product-42');
    expect(cacheTagMock).toHaveBeenCalledTimes(2);
  });

  it('invalidates each supported cache scope with updateTag', () => {
    const products = new EntityTag('products');

    products.invalidateAll();
    products.invalidateList();
    products.invalidateDetail('product-42');

    expect(updateTagMock).toHaveBeenNthCalledWith(1, 'products');
    expect(updateTagMock).toHaveBeenNthCalledWith(2, 'products:list');
    expect(updateTagMock).toHaveBeenNthCalledWith(3, 'products:detail:product-42');
    expect(updateTagMock).toHaveBeenCalledTimes(3);
  });
});
