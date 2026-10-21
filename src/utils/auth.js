// src/utils/auth.js

const ACCOUNTS_KEY = 'store_accounts_v2';
const PASSWORD_ITERATIONS = 120000;

const normalizeEmail = (email) =>
  email.trim().toLowerCase();

const getAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {};
  } catch {
    return {};
  }
};

const toHex = (bytes) =>
  Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');

const fromHex = (value) =>
  new Uint8Array(
    value.match(/.{2}/g).map((byte) => parseInt(byte, 16))
  );

const derivePasswordHash = async (password, salt) => {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
    throw new Error('Secure password hashing is not available in this browser.');
  }

  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hash = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PASSWORD_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return new Uint8Array(hash);
};

const matchesHash = (left, right) => {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }

  return difference === 0;
};

export const registerAccount = async ({ name, email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const accounts = getAccounts();

  if (accounts[normalizedEmail]) {
    throw new Error(
      'An account with this email already exists. Please sign in.'
    );
  }

  if (!name.trim() || !normalizedEmail || !password) {
    throw new Error('Please fill in all fields.');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await derivePasswordHash(password, salt);

  const account = {
    name: name.trim(),
    salt: toHex(salt),
    passwordHash: toHex(passwordHash),
  };

  accounts[normalizedEmail] = account;

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

  return {
    name: account.name,
    email: normalizedEmail,
  };
};

export const verifyAccount = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const account = getAccounts()[normalizedEmail];

  if (!account?.salt || !account?.passwordHash || !account?.name) {
    throw new Error('Email or password is incorrect.');
  }

  const salt = fromHex(account.salt);
  const expectedHash = fromHex(account.passwordHash);
  const actualHash = await derivePasswordHash(password, salt);

  if (!matchesHash(actualHash, expectedHash)) {
    throw new Error('Email or password is incorrect.');
  }

  return {
    name: account.name,
    email: normalizedEmail,
  };
};