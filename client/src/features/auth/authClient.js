import { DEMO_USER, DEMO_CREDENTIALS } from '../../mocks/auth.js';

export const SESSION_KEY = 'cs409-job-helper:demo-session:v1';

function browserSessionStorage() {
  try { return globalThis.sessionStorage; } catch { return undefined; }
}

// This adapter simulates authentication. It does not provide a security boundary.
export function createAuthClient({ storage = browserSessionStorage(), delay = 350 } = {}) {
  let memoryUser = null;
  return {
    async getSession() {
      if (memoryUser) return memoryUser;
      try {
        const session = JSON.parse(storage?.getItem(SESSION_KEY) ?? 'null');
        if (session?.version === 1 && session.userId === DEMO_USER.id) {
          memoryUser = DEMO_USER;
          return memoryUser;
        }
        storage?.removeItem(SESSION_KEY);
      } catch { /* Missing or invalid sessions start signed out. */ }
      return null;
    },
    async signIn(username, password) {
      if (delay) await new Promise(resolve => setTimeout(resolve, delay));
      if (username.trim() !== DEMO_CREDENTIALS.username || password !== DEMO_CREDENTIALS.password) {
        throw new Error('Incorrect username or password. Use demo / demo to try the prototype.');
      }
      memoryUser = DEMO_USER;
      let persisted = false;
      try {
        storage?.setItem(SESSION_KEY, JSON.stringify({ version: 1, userId: DEMO_USER.id }));
        persisted = Boolean(storage);
      } catch { /* Continue with an in-memory demo session. */ }
      return { user: DEMO_USER, persisted };
    },
    async signOut() {
      memoryUser = null;
      try { storage?.removeItem(SESSION_KEY); } catch { /* Storage may be blocked. */ }
    },
  };
}

export const authClient = createAuthClient();
