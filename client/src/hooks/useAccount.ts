import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import type { Account } from '../data/types';
import { fetchAccount, patchAccount, upsertAccount, fetchChessCom, fetchLichess } from '../lib/api';

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

  // ── Background rating refresh — once per session after account loads ──────

  const didRefreshRef = useRef(false);

  useEffect(() => {
    if (!account || didRefreshRef.current) return;
    if (!account.chessComUsername && !account.lichessUsername) return;

    didRefreshRef.current = true;

    // Fire-and-forget — non-critical, errors silently swallowed
    void (async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const updates: Partial<Account> = {};

        if (account.chessComUsername) {
          try {
            const r = await fetchChessCom(account.chessComUsername);
            updates.chessComRapid  = r.rapid;
            updates.chessComBlitz  = r.blitz;
            updates.chessComBullet = r.bullet;
          } catch {
            // Chess.com unavailable — keep existing values
          }
        }

        if (account.lichessUsername) {
          try {
            const r = await fetchLichess(account.lichessUsername);
            updates.lichessRapid  = r.rapid;
            updates.lichessBlitz  = r.blitz;
            updates.lichessBullet = r.bullet;
          } catch {
            // Lichess unavailable — keep existing values
          }
        }

        if (Object.keys(updates).length > 0) {
          const updated = await patchAccount(updates, token);
          setAccount(updated);
        }
      } catch {
        // Refresh is non-critical — swallow silently
      }
    })();
  }, [account, getToken]);

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
