import { friendsMutations } from '@apis/friends/friends-mutations';
import { friendsQueries } from '@apis/friends/friends-queries';
import ThinkIcon from '@assets/icons/thinking.svg?react';
import FriendCancelSheet from '@components/bottom-sheet/friend-cancel-sheet';
import Button from '@components/button/button';
import { useToast } from '@contexts/toast-context';
import { cn } from '@libs/cn';
import FriendsHeader from '@pages/friends/components/friends-header';
import FriendsList from '@pages/friends/components/friends-list';
import SearchBar from '@pages/friends/components/search-bar';
import SegmentedTabs from '@pages/friends/components/segmented-tabs';
import { getErrorMessage } from '@pages/friends/utils/get-error-toast-msg';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FriendsTab = 'list' | 'sent' | 'received';

type FriendRow = {
  memberId: number | string;
  nickname: string;
  email: string;
  profileImageUrl?: string | null;
};
type AllRow = FriendRow & { isFriend?: boolean; isRequested?: boolean };

export default function FriendsPage() {
  const [tab, setTab] = useState<FriendsTab>('list');
  const [kw, setKw] = useState('');
  const searching = kw.trim().length >= 1;
  const { showToast } = useToast();
  const [confirm, setConfirm] = useState<{
    type: 'friend' | 'request';
    email: string;
  } | null>(null);
  const nav = useNavigate();

  const listQ = useInfiniteQuery({
    ...friendsQueries.listInfinite(5),
    enabled: !searching && tab === 'list',
  });
  const sentQ = useInfiniteQuery({
    ...friendsQueries.sentInfinite(5),
    enabled: !searching && tab === 'sent',
  });
  const receivedQ = useInfiniteQuery({
    ...friendsQueries.receivedInfinite(5),
    enabled: !searching && tab === 'received',
  });
  const searchQ = useInfiniteQuery({
    ...friendsQueries.searchAllInfinite(kw.trim(), 5),
    enabled: searching,
  });

  const active = searching ? searchQ : tab === 'list' ? listQ : tab === 'sent' ? sentQ : receivedQ;

  const items = useMemo(() => {
    const rows: Array<FriendRow | AllRow> = (active.data?.pages ?? []).flatMap(
      (p) => p.data?.data ?? [],
    );
    return rows.map((f) => ({
      id: (f as FriendRow).email,
      name: (f as FriendRow).nickname,
      email: (f as FriendRow).email,
      profileImageUrl: (f as FriendRow).profileImageUrl,
      isFriend: (f as AllRow).isFriend,
      isRequested: (f as AllRow).isRequested,
    }));
  }, [active.data]);

  const previewItems = useMemo(() => (searching ? items : items.slice(0, 5)), [items, searching]);
  const isEmpty = previewItems.length === 0;

  const firstPage = active.data?.pages?.[0];
  const showAllButton =
    !searching &&
    !!firstPage &&
    (firstPage.data?.hasNext || (firstPage.data?.data?.length ?? 0) >= 6);

  const acceptMut = useMutation({
    ...friendsMutations.accept(),
    onSuccess: () => {
      showToast('친구 요청을 수락했어요.');
      receivedQ.refetch();
    },
    onError: (err) => showToast(getErrorMessage(err)),
  });

  const rejectMut = useMutation({
    ...friendsMutations.reject(),
    onSuccess: () => {
      showToast('친구 요청을 거절했어요.');
      receivedQ.refetch();
    },
    onError: (err) => showToast(getErrorMessage(err)),
  });

  const removeMut = useMutation({
    ...friendsMutations.remove(),
    onSuccess: () => {
      showToast('친구를 취소했어요.');
      listQ.refetch();
    },
    onError: (err) => showToast(getErrorMessage(err)),
  });

  const cancelMut = useMutation({
    ...friendsMutations.cancel(),
    onSuccess: () => {
      showToast('요청을 취소했어요.');
      sentQ.refetch();
    },
    onError: (err) => showToast(getErrorMessage(err)),
  });

  const requestMut = useMutation({
    ...friendsMutations.request(),
    onSuccess: () => {
      showToast('친구 요청을 보냈어요.');
      sentQ.refetch();
      searchQ.refetch();
    },
    onError: (err) => showToast(getErrorMessage(err)),
  });

  const handleConfirmCancel = () => {
    if (!confirm) return;
    if (confirm.type === 'friend') removeMut.mutate(confirm.email);
    else cancelMut.mutate(confirm.email);
    setConfirm(null);
  };

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!searching) return;
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
  }, [searching, active.hasNextPage, active.isFetchingNextPage, active.fetchNextPage]);

  const variantForView: FriendsTab = searching ? 'list' : tab;

  return (
    <div className="min-h-dvh flex-col bg-gradient-bgd1 pb-[15rem]">
      <FriendsHeader />
      <div className="flex-col-center gap-[1.5rem] px-[2.4rem] py-[1.5rem]">
        <SearchBar
          value={kw}
          placeholder="친구를 검색해 보세요"
          onChange={setKw}
          onSubmit={(q) => setKw(q)}
        />

        <SegmentedTabs
          items={[
            { value: 'list', label: '내 친구 목록' },
            { value: 'sent', label: '요청한 친구 목록' },
            { value: 'received', label: '요청받은 친구 목록' },
          ]}
          value={tab}
          onChange={(v) => {
            const next = v as FriendsTab;
            setTab(next);
            if (searching) setKw('');
          }}
          className="w-full"
        />

        <div className="w-full flex-row-between">
          {!searching && (
            <span className="heading1-700">
              {tab === 'list' && '내 친구 목록'}
              {tab === 'sent' && '요청한 친구 목록'}
              {tab === 'received' && '요청받은 친구 목록'}
            </span>
          )}
          {showAllButton && (
            <Button
              className={cn(
                'body2-500 rounded-full px-[1.6rem] py-[0.55rem]',
                'bg-gray-50 text-primary-800 outline outline-primary-800',
              )}
              onClick={() => nav(`/friends/all?tab=${tab}`)}
            >
              전체 보기
            </Button>
          )}
        </div>

        {isEmpty ? (
          <div className="flex-col-center gap-[3rem] py-[2.6rem]">
            <ThinkIcon className="h-[6.4rem] w-[6.4rem]" />
            <span className="heading3-700 text-gray-900">
              {searching ? '검색 결과가 없어요' : '아직 등록된 친구가 없어요'}
            </span>
          </div>
        ) : (
          <>
            <FriendsList
              items={previewItems}
              variant={variantForView}
              onOpen={(email) => {
                const item = items.find((i) => i.email === email);
                nav(`/friends/${encodeURIComponent(email)}`, {
                  state: {
                    nickname: item?.name ?? '친구',
                    email,
                    profileImageUrl: item?.profileImageUrl ?? null,
                  },
                });
              }}
              onCancel={
                !searching && tab === 'list'
                  ? (email) => setConfirm({ type: 'friend', email })
                  : !searching && tab === 'sent'
                    ? (email) => cancelMut.mutate(email)
                    : undefined
              }
              onAccept={
                !searching && tab === 'received'
                  ? (email) => acceptMut.mutate({ email })
                  : undefined
              }
              onReject={
                !searching && tab === 'received'
                  ? (email) => rejectMut.mutate({ email })
                  : undefined
              }
              onRequest={searching ? (email) => requestMut.mutate({ email }) : undefined}
            />
            {searching && <div ref={sentinelRef} className="h-[1px]" />}
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
