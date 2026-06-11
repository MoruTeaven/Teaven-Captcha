import type { Env } from './types';

const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();

export function nowIso(): string {
  return new Date().toISOString();
}

export function addSecondsIso(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export function createId(prefix: string): string {
  return `${prefix}_${randomBase64Url(16)}`;
}

export function createSecret(prefix: string): string {
  return `${prefix}_${randomBase64Url(32)}`;
}

export function randomBase64Url(size: number): string {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function base64UrlEncodeString(value: string): string {
  return bytesToBase64Url(TEXT_ENCODER.encode(value));
}

export function base64UrlDecodeString(value: string): string {
  return TEXT_DECODER.decode(base64UrlToBytes(value));
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', TEXT_ENCODER.encode(value));
  return bytesToHex(new Uint8Array(digest));
}

export async function hashIp(ip: string | null, env: Env): Promise<string | null> {
  if (!ip) {
    return null;
  }
  return sha256Hex(`${secretPepper(env)}:${ip}`);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBase64Url(16);
  const iterations = 120000;
  const key = await crypto.subtle.importKey('raw', TEXT_ENCODER.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: TEXT_ENCODER.encode(salt),
      iterations,
    },
    key,
    256,
  );
  return `pbkdf2_sha256$${iterations}$${salt}$${bytesToBase64Url(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, iterationsText, salt, expected] = stored.split('$');
  if (algorithm !== 'pbkdf2_sha256' || !iterationsText || !salt || !expected) {
    return false;
  }

  const iterations = Number(iterationsText);
  if (!Number.isInteger(iterations) || iterations < 10000) {
    return false;
  }

  const key = await crypto.subtle.importKey('raw', TEXT_ENCODER.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: TEXT_ENCODER.encode(salt),
      iterations,
    },
    key,
    256,
  );

  return constantTimeEqual(bytesToBase64Url(new Uint8Array(bits)), expected);
}

export async function hashSecret(secret: string, env: Env): Promise<string> {
  return `sha256$${await sha256Hex(`${secretPepper(env)}:${secret}`)}`;
}

export async function sealJson(value: unknown, env: Env): Promise<string> {
  const secret = env.SECRET_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('SECRET_ENCRYPTION_KEY is required.');
  }

  const key = await importAesKey(secret);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const plaintext = TEXT_ENCODER.encode(JSON.stringify(value));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  return `v1:${bytesToBase64Url(iv)}:${bytesToBase64Url(new Uint8Array(ciphertext))}`;
}

export async function openJson<T>(sealed: string, env: Env): Promise<T> {
  const [version, ivText, ciphertextText] = sealed.split(':');
  if (version !== 'v1' || !ivText || !ciphertextText) {
    throw new Error('Invalid encrypted payload.');
  }

  const secret = env.SECRET_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('SECRET_ENCRYPTION_KEY is required.');
  }

  const key = await importAesKey(secret);
  const iv = base64UrlToBytes(ivText);
  const ciphertext = base64UrlToBytes(ciphertextText);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(ciphertext),
  );
  return JSON.parse(TEXT_DECODER.decode(plaintext)) as T;
}

export async function hmacSha256Hex(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    TEXT_ENCODER.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, TEXT_ENCODER.encode(value));
  return bytesToHex(new Uint8Array(signature));
}

function secretPepper(env: Env): string {
  return env.SESSION_SECRET || 'dev-only-session-secret';
}

async function importAesKey(secret: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest('SHA-256', TEXT_ENCODER.encode(secret));
  return crypto.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}
