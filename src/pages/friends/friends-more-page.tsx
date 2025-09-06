import { friendsMutations } from '@apis/friends/friends-mutations';
import { friendsQueries } from '@apis/friends/friends-queries';
import ThinkIcon from '@assets/icons/thinking.svg?react';
import FriendCancelSheet from '@components/bottom-sheet/friend-cancel-sheet';
import FriendsList from '@pages/friends/components/friends-list';
import SearchBar from '@pages/friends/components/search-bar';
import SegmentedTabs from '@pages/friends/components/segmented-tabs';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export type FriendsTab = 'list' | 'sent' | 'received';
const isTab = (v: unknown): v is FriendsTab => v === 'list' || v === 'sent' || v === 'received';

type FriendRow = {
  memberId: number;
  nickname: string;
  email: string;
  profileImageUrl?: string | null;
};

type Item = {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string | null;
};

export default function FriendsMorePage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab');
  const tab: FriendsTab = isTab(raw) ? raw : 'list';

  const [kw, setKw] = useState('');
  const [confirm, setConfirm] = useState<{
    type: 'friend' | 'request';
    email: string;
  } | null>(null);
  const nav = useNavigate();

  const listQ = useInfiniteQuery({
    ...friendsQueries.listInfinite(10),
    enabled: tab === 'list',
  });
  const sentQ = useInfiniteQuery({
    ...friendsQueries.sentInfinite(10),
    enabled: tab === 'sent',
  });
  const receivedQ = useInfiniteQuery({
    ...friendsQueries.receivedInfinite(10),
    enabled: tab === 'received',
  });

  const active = tab === 'list' ? listQ : tab === 'sent' ? sentQ : receivedQ;

  const rows = useMemo(
    () => (active.data?.pages ?? []).flatMap((p) => p.data?.data ?? []),
    [active.data],
  );

  const items: Item[] = useMemo(() => {
    const q = kw.trim().toLowerCase();
    const base: FriendRow[] = rows as FriendRow[];
    const filtered = q
      ? base.filter(
          (f) => f.nickname.toLowerCase().includes(q) || f.email.toLowerCase().includes(q),
        )
      : base;
    return filtered.map((f) => ({
      id: f.email,
      name: f.nickname,
      email: f.email,
      profileImageUrl: f.profileImageUrl ?? null,
    }));
  }, [rows, kw]);

  const acceptMut = useMutation({
    ...friendsMutations.accept(),
    onSuccess: () => receivedQ.refetch(),
  });
  const rejectMut = useMutation({
    ...friendsMutations.reject(),
    onSuccess: () => receivedQ.refetch(),
  });
  const removeMut = useMutation({
    ...friendsMutations.remove(),
    onSuccess: () => listQ.refetch(),
  });
  const cancelMut = useMutation({
    ...friendsMutations.cancel(),
    onSuccess: () => sentQ.refetch(),
  });

  const handleConfirmCancel = () => {
    if (!confirm) return;
    if (confirm.type === 'friend') removeMut.mutate(confirm.email);
    else cancelMut.mutate(confirm.email);
    setConfirm(null);
  };

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && active.hasNextPage && !active.isFetchingNextPage) {
          active.fetchNextPage();
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active.hasNextPage, active.isFetchingNextPage, active.fetchNextPage]);

  const placeholderMsg =
    tab === 'list' ? '내 친구 목록' : tab === 'sent' ? '요청한 친구 목록' : '요청받은 친구 목록';

  return (
    <div className="min-h-dvh flex-col pb-[15rem]">
      <div className="flex-col-center gap-[1.5rem] px-[2.4rem] py-[1.5rem]">
        <SegmentedTabs
          items={[
            { value: 'list', label: '내 친구 목록' },
            { value: 'sent', label: '요청한 친구 목록' },
            { value: 'received', label: '요청받은 친구 목록' },
          ]}
          value={tab}
          onChange={(v) => {
            const next = v as FriendsTab;
            const sp = new URLSearchParams(params);
            sp.set('tab', next);
            setParams(sp, { replace: true });
            setKw('');
          }}
          className="w-full"
        />

        <SearchBar
          value={kw}
          placeholder={placeholderMsg}
          onChange={setKw}
          onSubmit={(q) => setKw(q)}
        />

        {items.length === 0 ? (
          <div className="flex-col-center gap-[3rem] py-[2.6rem]">
            <ThinkIcon className="h-[6.4rem] w-[6.4rem]" />
            <span className="heading3-700 text-gray-900">결과가 없어요</span>
          </div>
        ) : (
          <>
            <FriendsList
              items={items}
              variant={tab}
              onOpen={(email) => {
                const f = items.find((it) => it.email === email);
                nav(`/friends/${email}`, {
                  state: {
                    name: f?.name,
                    email: f?.email,
                    profileImageUrl: f?.profileImageUrl ?? null,
                  },
                });
              }}
              onCancel={
                tab === 'list'
                  ? (email) => setConfirm({ type: 'friend', email })
                  : tab === 'sent'
                    ? (email) => cancelMut.mutate(email)
                    : undefined
              }
              onAccept={tab === 'received' ? (email) => acceptMut.mutate({ email }) : undefined}
              onReject={tab === 'received' ? (email) => rejectMut.mutate({ email }) : undefined}
            />
            <div ref={sentinelRef} className="h-[1px]" />
          </>
        )}
      </div>

      <FriendCancelSheet
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
