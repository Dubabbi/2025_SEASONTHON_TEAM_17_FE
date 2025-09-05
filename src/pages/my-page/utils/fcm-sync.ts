import { authApi } from '@apis/auth/auth';
import { getDeviceInfo } from './device-info';

const LS_LOCAL = 'fcm.token';
const LS_SYNCED = 'fcm.syncedToken';

const getLocal = () => localStorage.getItem(LS_LOCAL);
const getSynced = () => localStorage.getItem(LS_SYNCED);
const setSynced = (t: string) => localStorage.setItem(LS_SYNCED, t);
const clearSynced = () => localStorage.removeItem(LS_SYNCED);

export async function syncFcmWithServer(token: string) {
  const prev = getSynced();
  if (prev && prev !== token) {
    await authApi.disableFcmToken({ token: prev }).catch(() => {
      /* */
    });
  }
  await authApi.saveFcmToken({ token, deviceInfo: getDeviceInfo() }).catch(() => {});
  setSynced(token);
}

export async function unsyncFcmFromServer() {
  const t = getSynced() || getLocal();
  if (t)
    await authApi.disableFcmToken({ token: t }).catch(() => {
      /* */
    });
  clearSynced();
}
