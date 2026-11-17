export function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  };
}

export const blockedStorage = {
  getItem() { throw new Error('Storage blocked'); },
  setItem() { throw new Error('Storage blocked'); },
  removeItem() { throw new Error('Storage blocked'); },
};
