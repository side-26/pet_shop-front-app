import { beforeEach, describe, expect, it, vi } from 'vitest';

import { uploadFetcher } from './uploadFetcher';

class MockXMLHttpRequest {
  static instances: MockXMLHttpRequest[] = [];

  method = '';
  url = '';
  timeout = 0;
  withCredentials = false;
  status = 200;
  responseText = '';
  headers = new Map<string, string>();
  sentBody: XMLHttpRequestBodyInit | undefined;
  upload = { onprogress: null as ((event: ProgressEvent<EventTarget>) => void) | null };
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  ontimeout: (() => void) | null = null;
  onabort: (() => void) | null = null;

  constructor() {
    MockXMLHttpRequest.instances.push(this);
  }

  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(name: string, value: string) {
    this.headers.set(name, value);
  }

  send(body?: XMLHttpRequestBodyInit | null) {
    this.sentBody = body ?? undefined;
  }

  abort() {
    this.onabort?.();
  }
}

beforeEach(() => {
  MockXMLHttpRequest.instances = [];
  vi.stubEnv('API_BASE_URL', 'https://api.example.test');
  vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest);
});

describe('uploadFetcher', () => {
  it('uploads FormData, emits progress, and normalizes the success envelope', async () => {
    const onProgress = vi.fn();
    const body = new FormData();
    body.set('image', new Blob(['image']));
    const pending = uploadFetcher<{ id: string }>({
      url: '/uploads',
      body,
      token: 'access-token',
      query: { folder: 'pets' },
      onProgress,
    });
    const request = MockXMLHttpRequest.instances[0]!;

    request.upload.onprogress?.({
      loaded: 50,
      total: 100,
      lengthComputable: true,
    } as ProgressEvent);
    request.responseText = JSON.stringify({
      isSuccess: true,
      message: 'Uploaded.',
      data: { id: '1' },
    });
    request.onload?.();

    await expect(pending).resolves.toEqual({
      isSuccess: true,
      message: 'Uploaded.',
      data: { id: '1' },
    });
    expect(request.method).toBe('POST');
    expect(request.url).toBe('https://api.example.test/uploads?folder=pets');
    expect(request.sentBody).toBe(body);
    expect(request.headers.get('authorization')).toBe('Bearer access-token');
    expect(request.headers.has('content-type')).toBe(false);
    expect(onProgress).toHaveBeenCalledWith({ loaded: 50, total: 100, percent: 50 });
  });

  it('exposes abort and returns the standard cancellation error', async () => {
    const pending = uploadFetcher({ url: '/uploads', body: new FormData() });
    pending.abort();

    await expect(pending).resolves.toEqual({
      isSuccess: false,
      message: 'The upload was cancelled.',
      data: { messages: {}, details: {} },
    });
  });

  it('normalizes backend and network errors', async () => {
    const backend = uploadFetcher({ url: '/uploads', body: new FormData() });
    const backendRequest = MockXMLHttpRequest.instances[0]!;
    backendRequest.status = 422;
    backendRequest.responseText = JSON.stringify({ message: 'Unsupported file.' });
    backendRequest.onload?.();

    const network = uploadFetcher({ url: '/uploads', body: new FormData() });
    MockXMLHttpRequest.instances[1]!.onerror?.();

    await expect(backend).resolves.toMatchObject({
      isSuccess: false,
      message: 'Unsupported file.',
    });
    await expect(network).resolves.toMatchObject({
      isSuccess: false,
      message: 'Unable to reach the server.',
    });
  });
});
