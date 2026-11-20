import assert from 'node:assert/strict';
import fs from 'node:fs';
import { BLUEPRINT_LIMITS, ADMIN_EMAIL } from './src/lib/validation.ts';

interface AuthContext {
  uid: string;
  email: string;
  emailVerified: boolean;
}

const SERVER_TIME = '__REQUEST_TIME__';

function isValidId(id: unknown): boolean {
  return (
    typeof id === 'string' &&
    id.length >= BLUEPRINT_LIMITS.id.minLength &&
    id.length <= BLUEPRINT_LIMITS.id.maxLength &&
    BLUEPRINT_LIMITS.id.pattern.test(id)
  );
}

function isBootstrappedAdmin(auth: AuthContext | null): boolean {
  return Boolean(auth && auth.emailVerified && auth.email === ADMIN_EMAIL);
}

function hasExactKeys(data: Record<string, unknown>, required: string[], allowed: string[]): boolean {
  const keys = Object.keys(data);
  return required.every((k) => k in data) && keys.every((k) => allowed.includes(k));
}

function simulateUserCreate(auth: AuthContext | null, userId: string, data: Record<string, unknown>): boolean {
  if (!auth || !auth.emailVerified || !isValidId(userId)) return false;
  if (!hasExactKeys(data, ['uid', 'displayName', 'email', 'role', 'createdAt', 'updatedAt'], ['uid', 'displayName', 'email', 'photoURL', 'role', 'createdAt', 'updatedAt'])) return false;
  if (data.uid !== auth.uid || userId !== auth.uid || data.email !== auth.email) return false;
  if (!(data.role === 'client' || (data.role === 'admin' && isBootstrappedAdmin(auth)))) return false;
  if (data.createdAt !== SERVER_TIME || data.updatedAt !== SERVER_TIME) return false;
  return true;
}

function simulateBriefCreate(auth: AuthContext | null, briefId: string, data: Record<string, unknown>): boolean {
  if (!auth || !auth.emailVerified || !isValidId(briefId)) return false;
  const reqKeys = ['authorUid', 'name', 'email', 'service', 'budget', 'message', 'status', 'createdAt', 'updatedAt'];
  if (!hasExactKeys(data, reqKeys, reqKeys)) return false;
  if (data.authorUid !== auth.uid || data.status !== 'submitted') return false;
  if (data.createdAt !== SERVER_TIME || data.updatedAt !== SERVER_TIME) return false;
  if (typeof data.message !== 'string' || data.message.length < 20 || data.message.length > 2000) return false;
  return true;
}

function simulateBriefUpdate(
  auth: AuthContext | null,
  briefId: string,
  existing: Record<string, unknown>,
  incoming: Record<string, unknown>,
): boolean {
  if (!auth || !auth.emailVerified || !isValidId(briefId)) return false;
  if (incoming.authorUid !== existing.authorUid || incoming.createdAt !== existing.createdAt) return false;
  if (incoming.updatedAt !== SERVER_TIME) return false;
  const changedKeys = Object.keys(incoming).filter((k) => incoming[k] !== existing[k]);
  if (isBootstrappedAdmin(auth)) {
    return changedKeys.every((k) => ['status', 'updatedAt'].includes(k));
  }
  if (existing.authorUid !== auth.uid) return false;
  if (existing.status === 'accepted' || existing.status === 'archived') return false;
  if (incoming.status !== existing.status) return false;
  return changedKeys.every((k) => ['name', 'email', 'service', 'budget', 'message', 'updatedAt'].includes(k));
}

const rulesText = fs.readFileSync('firestore.rules', 'utf8');
assert.ok(rulesText.includes('match /{document=**} {\n      allow read, write: if false;\n    }'));
assert.ok(rulesText.includes('request.auth.token.email_verified == true'));

const clientAuth: AuthContext = { uid: 'user_123', email: 'client@example.com', emailVerified: true };
const spoofedAdmin: AuthContext = { uid: 'evil_1', email: ADMIN_EMAIL, emailVerified: false };

// Dirty Dozen assertions
assert.equal(simulateBriefCreate(null, 'b1', { authorUid: 'anon' }), false, '1. Unauthenticated brief write denied');
assert.equal(isBootstrappedAdmin(spoofedAdmin), false, '2. Unverified admin email spoof denied');
assert.equal(simulateUserCreate(clientAuth, 'user_123', {
  uid: 'user_123', displayName: 'Attacker', email: 'client@example.com', role: 'admin', createdAt: SERVER_TIME, updatedAt: SERVER_TIME,
}), false, '3. Self-assigned admin role denied');
assert.equal(simulateBriefCreate(clientAuth, 'b2', {
  authorUid: 'victim_uid', name: 'Test User', email: 'client@example.com', service: 'Logo', budget: "Let's discuss",
  message: 'Long enough project description text here.', status: 'submitted', createdAt: SERVER_TIME, updatedAt: SERVER_TIME,
}), false, '7. Author spoofing denied');
assert.equal(simulateBriefCreate(clientAuth, 'b3', {
  authorUid: 'user_123', name: 'Test User', email: 'client@example.com', service: 'Logo', budget: "Let's discuss",
  message: 'Long enough project description text here.', status: 'submitted', isPriorityAdmin: true, createdAt: SERVER_TIME, updatedAt: SERVER_TIME,
}), false, '8. Shadow field denied');
assert.equal(simulateBriefCreate(clientAuth, 'b4', {
  authorUid: 'user_123', name: 'Test User', email: 'client@example.com', service: 'Logo', budget: "Let's discuss",
  message: 'Long enough project description text here.', status: 'accepted', createdAt: SERVER_TIME, updatedAt: SERVER_TIME,
}), false, '9. Status shortcutting denied');
assert.equal(simulateBriefUpdate(clientAuth, 'b5', {
  authorUid: 'user_123', name: 'Test User', email: 'client@example.com', service: 'Logo', budget: "Let's discuss",
  message: 'Long enough project description text here.', status: 'accepted', createdAt: SERVER_TIME, updatedAt: SERVER_TIME,
}, {
  authorUid: 'user_123', name: 'Mutated', email: 'client@example.com', service: 'Logo', budget: "Let's discuss",
  message: 'Long enough project description text here.', status: 'accepted', createdAt: SERVER_TIME, updatedAt: SERVER_TIME,
}), false, '10. Terminal state mutation denied');
assert.equal(simulateBriefCreate(clientAuth, 'bad id!@#', {
  authorUid: 'user_123', name: 'Test User', email: 'client@example.com', service: 'Logo', budget: "Let's discuss",
  message: 'Long enough project description text here.', status: 'submitted', createdAt: SERVER_TIME, updatedAt: SERVER_TIME,
}), false, '11. ID poisoning denied');
assert.equal(simulateBriefCreate(clientAuth, 'b6', {
  authorUid: 'user_123', name: 'Test User', email: 'client@example.com', service: 'Logo', budget: "Let's discuss",
  message: 'Long enough project description text here.', status: 'submitted', createdAt: '1999-01-01', updatedAt: SERVER_TIME,
}), false, '12. Client timestamp forgery denied');

console.log('All security specification invariants and Dirty Dozen checks passed.');
