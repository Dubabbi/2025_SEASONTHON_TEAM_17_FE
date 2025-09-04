import FriendCancelSheet from '@components/bottom-sheet/friend-cancel-sheet';
import { MOCK_FRIENDS, MOCK_RECEIVED, MOCK_SENT } from '@mocks/friends';
import FriendsList from '@pages/friends/components/friends-list';
import SearchBar from '@pages/friends/components/search-bar';
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

  const items = useMemo(() => {
    if (tab === 'sent') return MOCK_SENT;
    if (tab === 'received') return MOCK_RECEIVED;
    return MOCK_FRIENDS;
  }, [tab]);

  const handleConfirmCancel = () => {
    if (cancelTarget) {
      console.log('friend cancel:', cancelTarget);
      setCancelTarget(null);
    }
  };

  return (
    <main className="min-h-dvh flex-col gap-[1.5rem] px-[2.4rem] py-[1.5rem] pb-[12rem]">
      <SearchBar placeholder={placeholder} />
      <FriendsList
        items={items}
        variant={tab}
        onCancel={tab === 'list' ? (id) => setCancelTarget(id) : undefined}
      />

      <FriendCancelSheet
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </main>
  );
}
