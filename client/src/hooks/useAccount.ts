import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import type { Account } from '../data/types';
import { fetchAccount, patchAccount, upsertAccount } from '../lib/api';

interface AccountContextValue {
  account:     Account | null;
  isLoading:   boolean;
  /** True when no account row exists in the DB yet — triggers onboarding. */
  isNewUser:   boolean;
  /** Upsert fields; absent fields keep their existing DB value. */
  saveAccount: (fields: Partial<Account>) => Promise<void>;
  /** Explicitly set fields, including clearing them to null. */
  updateAccount: (fields: Partial<Account>) => Promise<void>;
}

export const AccountContext = createContext<AccountContextValue | null>(null);

export function useAccountState(): AccountContextValue {
  const [account,   setAccount]   = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getToken()
      .then((token) => {
        if (!token) return;
        return fetchAccount(token);
      })
      .then((data) => {
        if (cancelled) return;
        if (data === undefined) return; // token was null
        setAccount(data);
        setIsNewUser(data === null);
      })
      .catch((err) => {
        console.error('Failed to load account:', err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [getToken]);

  const saveAccount = useCallback(
    async (fields: Partial<Account>) => {
      const token = await getToken();
      if (!token) return;
      const updated = await upsertAccount(fields, token);
      setAccount(updated);
      setIsNewUser(false);
    },
    [getToken],
  );

  const updateAccount = useCallback(
    async (fields: Partial<Account>) => {
      const token = await getToken();
      if (!token) return;
      const updated = await patchAccount(fields, token);
      setAccount(updated);
    },
    [getToken],
  );

  return { account, isLoading, isNewUser, saveAccount, updateAccount };
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}
