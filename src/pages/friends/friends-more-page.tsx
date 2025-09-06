import { friendsMutations } from '@apis/friends/friends-mutations';
import { friendsQueries } from '@apis/friends/friends-queries';
import FriendCancelSheet from '@components/bottom-sheet/friend-cancel-sheet';
import FriendsList from '@pages/friends/components/friends-list';
import SearchBar from '@pages/friends/components/search-bar';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type FriendsTab = 'list' | 'sent' | 'received';
const isTab = (v: unknown): v is FriendsTab => v === 'list' || v === 'sent' || v === 'received';

export default function FriendsMorePage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab');
  const tab: FriendsTab = isTab(raw) ? raw : 'list';

  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!isTab(raw)) setParams({ tab: 'list' }, { replace: true });
  }, [raw, setParams]);

  const placeholder =
    tab === 'list'
      ? '친구를 검색해보세요'
      : tab === 'sent'
        ? '내가 신청한 친구를 검색해보세요'
        : '나에게 신청한 친구를 검색해보세요';

  const listQ = useInfiniteQuery({
    ...friendsQueries.listInfinite(20),
    enabled: tab === 'list',
  });
  const sentQ = useInfiniteQuery({
    ...friendsQueries.sentInfinite(20),
    enabled: tab === 'sent',
  });
  const receivedQ = useInfiniteQuery({
    ...friendsQueries.receivedInfinite(20),
    enabled: tab === 'received',
  });

  const active = tab === 'list' ? listQ : tab === 'sent' ? sentQ : receivedQ;

  type FriendRow = {
    nickname: string;
    email: string;
    profileImageUrl?: string | null;
  };

  const items = useMemo(() => {
    const rows: FriendRow[] = (active.data?.pages ?? []).flatMap((p) => p.data?.data ?? []);
    return rows.map((f) => ({
      id: f.email,
      name: f.nickname,
      email: f.email,
      profileImageUrl: f.profileImageUrl,
    }));
  }, [active.data]);

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

  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    removeMut.mutate(cancelTarget);
    setCancelTarget(null);
  };

  return (
    <main className="min-h-dvh flex-col gap-[1.5rem] px-[2.4rem] py-[1.5rem] pb-[12rem]">
      <SearchBar placeholder={placeholder} />
      <FriendsList
        items={items}
        variant={tab}
        onCancel={tab === 'list' ? (email) => setCancelTarget(email) : undefined}
        onAccept={tab === 'received' ? (email) => acceptMut.mutate({ email }) : undefined}
        onReject={tab === 'received' ? (email) => rejectMut.mutate({ email }) : undefined}
      />
      <FriendCancelSheet
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </main>
  );
}
