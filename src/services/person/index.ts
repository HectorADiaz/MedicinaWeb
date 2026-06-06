import type { IPersonProvider } from './IPersonProvider';
import { OfflinePersonProvider } from './OfflinePersonProvider';

export const getPersonProvider = (isLoggedIn: boolean): IPersonProvider => {
  if (isLoggedIn) {
    return OfflinePersonProvider;
  }
  
  return OfflinePersonProvider;
};