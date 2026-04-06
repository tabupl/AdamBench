import { describe, it, expect, beforeEach } from 'vitest';
import { readStoredSession, clearSession } from './auth';

const STORAGE_KEY = 'auth_user';

describe('readStoredSession', () => {
  beforeEach(() => localStorage.clear());

  it('returns null when nothing is stored', () => {
    expect(readStoredSession()).toBeNull();
  });

  it('parses a valid user', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: '1', name: 'Alice', email: 'a@b.com', role: 'admin' }));
    expect(readStoredSession()?.name).toBe('Alice');
  });

  it('clears corrupted data and returns null', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    expect(readStoredSession()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe('clearSession', () => {
  beforeEach(() => localStorage.clear());

  it('removes stored session', () => {
    localStorage.setItem(STORAGE_KEY, '{}');
    clearSession();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

// Integration-style tests for fakeLogin
import { fakeLogin, fakeUpdateProfile } from './auth';

describe('fakeLogin', () => {
  beforeEach(() => localStorage.clear());

  it('returns user on valid credentials', async () => {
    const user = await fakeLogin('alice@example.com', 'password123', 0);
    expect(user.name).toBe('Alice Johnson');
    expect(user).not.toHaveProperty('password');
  });

  it('throws on bad credentials', async () => {
    await expect(fakeLogin('alice@example.com', 'wrong', 0)).rejects.toThrow('Invalid email or password');
  });

  it('persists session to localStorage', async () => {
    await fakeLogin('bob@example.com', 'password123', 0);
    const stored = readStoredSession();
    expect(stored?.email).toBe('bob@example.com');
  });
});

describe('fakeUpdateProfile', () => {
  beforeEach(() => localStorage.clear());

  it('updates name and email', async () => {
    const updated = await fakeUpdateProfile('1', { name: 'Alice Updated', email: 'alice.new@example.com' }, 0);
    expect(updated.name).toBe('Alice Updated');
    expect(updated.email).toBe('alice.new@example.com');
  });

  it('throws for unknown user', async () => {
    await expect(fakeUpdateProfile('999', { name: 'X', email: 'x@x.com' }, 0)).rejects.toThrow('User not found');
  });

  it('persists to localStorage', async () => {
    await fakeUpdateProfile('1', { name: 'New Name', email: 'new@x.com' }, 0);
    expect(readStoredSession()?.name).toBe('New Name');
  });
});
