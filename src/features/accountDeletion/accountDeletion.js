export const ACCOUNT_DELETION_PHRASE = "DELETE";

export function canConfirmAccountDeletion(value, busy = false) {
  return !busy && value === ACCOUNT_DELETION_PHRASE;
}

export async function executeAccountDeletion({ stopSync, invoke, clearLocal, endLocalSession, reload }) {
  stopSync();
  const { error } = await invoke();
  if (error) return { error };
  clearLocal();
  await endLocalSession();
  reload();
  return { error: null };
}
