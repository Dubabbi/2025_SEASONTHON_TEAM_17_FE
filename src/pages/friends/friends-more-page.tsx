import NotiBg from '@assets/images/noti-bg.png';
import { MOCK_FRIENDS, MOCK_RECEIVED, MOCK_SENT } from '@mocks/friends';
import FriendsList from '@pages/friends/components/friends-list';
import FriendsTabs, { type FriendsTab } from '@pages/friends/components/friends-tab';
import SearchBar from '@pages/friends/components/search-bar';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const isTab = (v: unknown): v is FriendsTab => v === 'list' || v === 'sent' || v === 'received';

export default function FriendsMorePage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab');
  const tab: FriendsTab = isTab(raw) ? raw : 'list';

  useEffect(() => {
    if (!isTab(raw)) setParams({ tab: 'list' }, { replace: true });
  }, [raw, setParams]);

  const title =
    tab === 'list' ? '내 친구 목록' : tab === 'sent' ? '신청한 친구 목록' : '신청받은 친구 목록';

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

  return (
    <main
      className="min-h-dvh flex-col gap-[1.5rem] px-[2.4rem] py-[1.5rem] pb-[12rem]"
      style={{ backgroundImage: `url(${NotiBg})` }}
    >
      <h1 className="heading1-700 text-center text-gray-900">{title}</h1>
      <SearchBar placeholder={placeholder} />
      <FriendsTabs value={tab} onChange={(v) => setParams({ tab: v })} className="w-full" />
      <FriendsList items={items} variant={tab} />
    </main>
  );
}
