// Storage utilities - using sessionStorage directly for simplicity
export const getStorage = (key: string): string | null => {
  return sessionStorage.getItem(key)
}

export const setStorage = (key: string, value: string): void => {
  sessionStorage.setItem(key, value)
}

export const removeStorage = (key: string): void => {
  sessionStorage.removeItem(key)
}

// Export for testing
export const __test__ = {
  getStorage,
  setStorage,
  removeStorage,
}
