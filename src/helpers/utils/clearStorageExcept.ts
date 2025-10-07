export const clearStorageExcept = (storage: Storage, keepKeys: string[]): void => {
  const preserved: Record<string, string | null> = {};

  for (const key of keepKeys) {
    preserved[key] = storage.getItem(key);
  }

  storage.clear();

  for (const [key, value] of Object.entries(preserved)) {
    if (value !== null) {
      storage.setItem(key, value);
    }
  }
};
