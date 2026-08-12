'use server';
import { cookies } from 'next/headers';

import { EncryptJWT, decodeJwt, jwtVerify } from 'jose';
import { AuthSessionModel } from '@/_types';

const jwtKeySecret = process.env.NEXT_PUBLIC_SESSION_SECRET_KEY || '';

export async function decryptSession<T>(encodedSession: string) {
  const encodedJWTKey = new TextEncoder().encode(jwtKeySecret);

  const { payload } = await jwtVerify(encodedSession, encodedJWTKey, {
    algorithms: ['HS256'],
  });
  return payload as T;
}

export async function getSession(): Promise<AuthSessionModel | null> {
  try {
    const cookieStore = await cookies();

    const session = cookieStore.get(process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || '')?.value;

    const payload = (await decryptSession<AuthSessionModel>(session!)) as AuthSessionModel;

    return payload;
  } catch {
    return null;
  }
}

export const setSession = async () => {};
