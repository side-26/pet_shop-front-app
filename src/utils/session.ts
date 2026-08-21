import 'server-only';

import { cookies } from 'next/headers';

import { EncryptJWT, JWTPayload, jwtDecrypt } from 'jose';
import type { AuthSessionModel } from '@/_types';

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function getEncryptionKey(): Promise<Uint8Array> {
  const sessionSecret = getRequiredEnvironmentVariable('NEXT_PUBLIC_SESSION_SECRET_KEY');
  const encodedSecret = new TextEncoder().encode(sessionSecret);
  const keyDigest = await crypto.subtle.digest('SHA-256', encodedSecret);

  return new Uint8Array(keyDigest);
}

export async function encryptSession(session: AuthSessionModel): Promise<string> {
  return new EncryptJWT(session as unknown as JWTPayload)
    .setProtectedHeader({
      alg: 'dir',
      enc: 'A256GCM',
    })
    .encrypt(await getEncryptionKey());
}

export async function decryptSession<T>(encodedSession: string) {
  const { payload } = await jwtDecrypt(encodedSession, await getEncryptionKey(), {
    keyManagementAlgorithms: ['dir'],
    contentEncryptionAlgorithms: ['A256GCM'],
  });
  return payload as T;
}

export async function getSession(): Promise<AuthSessionModel | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookieName = getRequiredEnvironmentVariable('NEXT_PUBLIC_SESSION_COOKIE_NAME');

    const session = cookieStore.get(sessionCookieName)?.value;

    const payload = (await decryptSession<AuthSessionModel>(session!)) as AuthSessionModel;

    return payload;
  } catch {
    return null;
  }
}

export async function saveSessionToCookie(session: AuthSessionModel): Promise<void> {
  const encryptedSession = await encryptSession(session);
  const maxAge = Math.max(0, Math.floor((session.accessExp - Date.now()) / 1_000));
  const cookieStore = await cookies();
  const sessionCookieName = getRequiredEnvironmentVariable('NEXT_PUBLIC_SESSION_COOKIE_NAME');

  cookieStore.set(sessionCookieName, encryptedSession, {
    httpOnly: true,
    secure: true,
    maxAge,
    sameSite: 'strict',
    path: '/',
  });
}
