import { friendsMutations } from '@apis/friends/friends-mutations';
import { friendsQueries } from '@apis/friends/friends-queries';
import FriendCancelSheet from '@components/bottom-sheet/friend-cancel-sheet';
import FriendsList from '@pages/friends/components/friends-list';
import SearchBar from '@pages/friends/components/search-bar';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type FriendsTab = 'list' | 'sent' | 'received';
const isTab = (v: unknown): v is FriendsTab => v === 'list' || v === 'sent' || v === 'received';

const LIMIT = 5;

type Row = {
  memberId: number;
  nickname: string;
  email: string;
  profileImageUrl?: string | null;
};

export default function FriendsMorePage() {
  const [params, setParams] = useSearchParams();
  const rawTab = params.get('tab');
  const tab: FriendsTab = isTab(rawTab) ? rawTab : 'list';

  const qParam = (params.get('q') ?? '').trim();
  const [kw, setKw] = useState(qParam);
  useEffect(() => setKw(qParam), [qParam]);

  useEffect(() => {
    if (!isTab(rawTab))
      setParams(
        (prev) => {
          prev.set('tab', 'list');
          return prev;
        },
        { replace: true },
      );
  }, [rawTab, setParams]);

  const dkw = useDeferredValue(kw);
  const searching = dkw.length >= 1;

  const listQ = useInfiniteQuery({
    ...friendsQueries.listInfinite(LIMIT),
    enabled: !searching && tab === 'list',
  });
  const sentQ = useInfiniteQuery({
    ...friendsQueries.sentInfinite(LIMIT),
    enabled: !searching && tab === 'sent',
  });
  const receivedQ = useInfiniteQuery({
    ...friendsQueries.receivedInfinite(LIMIT),
    enabled: !searching && tab === 'received',
  });
  const qAllInf = useInfiniteQuery({
    ...friendsQueries.searchAllInfinite(dkw, LIMIT),
    enabled: searching,
  });

  const activeInf = !searching
    ? tab === 'list'
      ? listQ
      : tab === 'sent'
        ? sentQ
        : receivedQ
    : qAllInf;

  const items = useMemo(() => {
    const rows: Row[] = (activeInf.data?.pages ?? []).flatMap((p) => p.data?.data ?? []);
    return rows.map((f) => ({
      id: f.email,
      name: f.nickname,
      email: f.email,
      profileImageUrl: f.profileImageUrl,
      cursorId: f.memberId,
    }));
  }, [activeInf.data]);

  const [confirm, setConfirm] = useState<{
    type: 'friend' | 'request';
    email: string;
  } | null>(null);

  const acceptMut = useMutation({ ...friendsMutations.accept() });
  const rejectMut = useMutation({ ...friendsMutations.reject() });
  const removeMut = useMutation({ ...friendsMutations.remove() });
  const cancelMut = useMutation({ ...friendsMutations.cancel() });

  const handleConfirmCancel = () => {
    if (!confirm) return;
    if (confirm.type === 'friend')
      removeMut.mutate(confirm.email, { onSuccess: () => listQ.refetch() });
    else cancelMut.mutate(confirm.email, { onSuccess: () => sentQ.refetch() });
    setConfirm(null);
  };

  const placeholder =
    tab === 'list'
      ? '친구를 검색해보세요'
      : tab === 'sent'
        ? '내가 신청한 친구를 검색해보세요'
        : '나에게 신청한 친구를 검색해보세요';

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && activeInf.hasNextPage && !activeInf.isFetchingNextPage) {
          activeInf.fetchNextPage();
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [activeInf.hasNextPage, activeInf.isFetchingNextPage, activeInf.fetchNextPage]);

  return (
    <main className="min-h-dvh flex-col gap-[1.5rem] px-[2.4rem] py-[1.5rem] pb-[12rem]">
      <SearchBar
        value={kw}
        placeholder={placeholder}
        onChange={setKw}
        onSubmit={(v) => {
          const q = v.trim();
          const next = new URLSearchParams(params);
          if (q) next.set('q', q);
          else next.delete('q');
          if (!isTab(next.get('tab'))) next.set('tab', 'list');
          setParams(next, { replace: true });
        }}
      />

      <FriendsList
        items={items}
        variant={searching ? 'list' : tab}
        onCancel={
          !searching && tab === 'list'
            ? (email) => setConfirm({ type: 'friend', email })
            : undefined
        }
        onAccept={
          !searching && tab === 'received' ? (email) => acceptMut.mutate({ email }) : undefined
        }
        onReject={
          !searching && tab === 'received' ? (email) => rejectMut.mutate({ email }) : undefined
        }
      />

      <div ref={sentinelRef} className="h-[1px]" />
      {activeInf.isFetchingNextPage && (
        <div className="body2-500 py-[1rem] text-center text-gray-500">불러오는 중…</div>
      )}

      <FriendCancelSheet
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirmCancel}
      />
    </main>
  );
}
