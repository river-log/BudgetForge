export const INVALID_STORAGE_PREFIX = "budgetforge-invalid-storage-v1:";
export const isRecordArray = (value) => Array.isArray(value) && value.every((item) => item && typeof item === "object" && !Array.isArray(item));
export const isRecordObject = (value) => value && typeof value === "object" && !Array.isArray(value);

function quarantineKey(key) {
  return `${INVALID_STORAGE_PREFIX}${key}`;
}

export function quarantineInvalidStorage(key, raw, storage = localStorage) {
  if (raw === null || storage.getItem(quarantineKey(key)) !== null) return;
  try {
    storage.setItem(quarantineKey(key), raw);
    storage.removeItem(key);
  } catch (error) {
    console.warn(`BudgetForge could not quarantine invalid storage for ${key}.`, error);
  }
}

export function safeReadJson(key, fallback, validate = () => true, storage = localStorage) {
  const raw = storage.getItem(key);
  if (raw === null) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (!validate(parsed)) throw new Error("Stored value has an unexpected shape.");
    return parsed;
  } catch (error) {
    quarantineInvalidStorage(key, raw, storage);
    console.warn(`BudgetForge recovered an invalid stored value for ${key}.`, error);
    return fallback;
  }
}

export function safeReadNumber(key, fallback = 0, { min = 0, allowed = null } = {}, storage = localStorage) {
  const raw = storage.getItem(key);
  if (raw === null) return fallback;
  const value = Number(raw);
  if (Number.isFinite(value) && value >= min && (!allowed || allowed.includes(value))) return value;
  quarantineInvalidStorage(key, raw, storage);
  return fallback;
}

export function safeReadEnum(key, allowed, fallback, storage = localStorage) {
  const raw = storage.getItem(key);
  if (raw === null) return fallback;
  if (allowed.includes(raw)) return raw;
  quarantineInvalidStorage(key, raw, storage);
  return fallback;
}

export function safeWriteJson(key, value, storage = localStorage) {
  storage.setItem(key, JSON.stringify(value));
  return value;
}

export function clearQuarantinedStorage(storage = localStorage) {
  const keys = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith(INVALID_STORAGE_PREFIX)) keys.push(key);
  }
  keys.forEach((key) => storage.removeItem(key));
}
