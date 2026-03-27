import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useAccount } from './useAccount';
import { sendHeartbeat, fetchOnlineUsers, sendSignOff } from '../lib/api';
import type { OnlineUser } from '../data/types';

const HEARTBEAT_INTERVAL = 30_000; // 30 s
const POLL_INTERVAL      = 30_000; // poll online list every 30 s

interface PresenceState {
  count:   number;
  users:   OnlineUser[];
  loading: boolean;
}

export function usePresence() {
  const { getToken } = useAuth();
  const { user }     = useUser();
  const { account }  = useAccount();
  const [state, setState] = useState<PresenceState>({ count: 0, users: [], loading: true });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Heartbeat ──────────────────────────────────────────────────────────────

  const beat = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      // Headline rating: FIDE → Chess.com rapid → Lichess rapid → blitz fallbacks
      const headlineRating =
        account?.fideRating       ??
        account?.chessComRapid    ??
        account?.lichessRapid     ??
        account?.chessComBlitz    ??
        account?.lichessBlitz     ??
        account?.chessComBullet   ??
        account?.lichessBullet    ??
        null;

      await sendHeartbeat({
        displayName: account?.displayName ?? null,
        country:     account?.country     ?? null,
        gender:      account?.gender      ?? null,
        chessLevel:  account?.chessLevel  ?? null,
        rating:      headlineRating,
        imageUrl:    user?.imageUrl       ?? null,
      }, token);
    } catch {
      // Presence is non-critical — swallow errors silently
    }
  }, [getToken, account]);

  // ─── Fetch online list ──────────────────────────────────────────────────────

  const poll = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const data = await fetchOnlineUsers(token);
      setState({ count: data.count, users: data.users, loading: false });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, [getToken]);

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  useEffect(() => {
    // Beat first, then poll — avoids race condition where poll returns before
    // the heartbeat has been stored, which would show count 0 on first render.
    void beat().then(() => void poll());

    // Set up recurring intervals
    const beatId = setInterval(() => void beat(), HEARTBEAT_INTERVAL);
    const pollId = setInterval(() => void poll(), POLL_INTERVAL);
    intervalRef.current = beatId;

    // Sign off when the tab closes
    const handleUnload = () => {
      getToken().then((token) => {
        if (token) void sendSignOff(token);
      });
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(beatId);
      clearInterval(pollId);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [beat, poll, getToken]);

  return state;
}
