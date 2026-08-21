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

async function getEncryptionKey(environmentVariableName: string): Promise<Uint8Array> {
  const sessionSecret = getRequiredEnvironmentVariable(environmentVariableName);
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
    .encrypt(await getEncryptionKey('NEXT_PUBLIC_SESSION_SECRET_KEY'));
}

export async function decryptSession<T>(encodedSession: string) {
  const { payload } = await jwtDecrypt(
    encodedSession,
    await getEncryptionKey('NEXT_PUBLIC_SESSION_SECRET_KEY'),
    {
      keyManagementAlgorithms: ['dir'],
      contentEncryptionAlgorithms: ['A256GCM'],
    },
  );
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

const TEMPORARY_TOKEN_COOKIE_NAME = 'temp_token';
const TEMPORARY_TOKEN_TTL_SECONDS = 5 * 60;

type TemporaryTokenPayload = {
  temporaryToken: string;
};

export async function encryptTemporaryToken(temporaryToken: string): Promise<string> {
  return new EncryptJWT({ temporaryToken })
    .setProtectedHeader({
      alg: 'dir',
      enc: 'A256GCM',
    })
    .setIssuedAt()
    .setExpirationTime(`${TEMPORARY_TOKEN_TTL_SECONDS}s`)
    .encrypt(await getEncryptionKey('NEXT_PUBLIC_TEMPORARY_SESSION_SECRET_KEY'));
}

export async function decryptTemporaryToken(encodedToken: string): Promise<string> {
  const { payload } = await jwtDecrypt(
    encodedToken,
    await getEncryptionKey('NEXT_PUBLIC_TEMPORARY_SESSION_SECRET_KEY'),
    {
      keyManagementAlgorithms: ['dir'],
      contentEncryptionAlgorithms: ['A256GCM'],
    },
  );

  return (payload as TemporaryTokenPayload).temporaryToken;
}

export async function saveTemporaryTokenToCookie(temporaryToken: string): Promise<void> {
  const encryptedToken = await encryptTemporaryToken(temporaryToken);
  const cookieStore = await cookies();

  cookieStore.set(TEMPORARY_TOKEN_COOKIE_NAME, encryptedToken, {
    httpOnly: true,
    secure: true,
    maxAge: TEMPORARY_TOKEN_TTL_SECONDS,
    sameSite: 'strict',
    path: '/',
  });
}

export async function getTemporaryToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const encryptedToken = cookieStore.get(TEMPORARY_TOKEN_COOKIE_NAME)?.value;

    if (!encryptedToken) return null;

    return await decryptTemporaryToken(encryptedToken);
  } catch {
    return null;
  }
}

export async function deleteTemporaryTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TEMPORARY_TOKEN_COOKIE_NAME);
}
