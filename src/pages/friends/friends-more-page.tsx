import { MOCK_FRIENDS, MOCK_RECEIVED, MOCK_SENT } from '@mocks/friends';
import FriendsHeader from '@pages/friends/components/friends-header';
import FriendsList from '@pages/friends/components/friends-list';
import FriendsTabs from '@pages/friends/components/friends-tab';
import SearchBar from '@pages/friends/components/search-bar';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type Variant = 'list' | 'sent' | 'received';

export default function FriendsMorePage({ variant }: { variant: Variant }) {
  const nav = useNavigate();

  const items = useMemo(() => {
    if (variant === 'sent') return MOCK_SENT;
    if (variant === 'received') return MOCK_RECEIVED;
    return MOCK_FRIENDS;
  }, [variant]);

  return (
    <div className="min-h-dvh flex-col gap-[1.5rem] pb-[12rem]">
      <FriendsHeader />
      <div className="flex-col-center gap-[1.5rem] px-[2.4rem] py-[1.5rem]">
        <SearchBar placeholder="친구를 검색해 보세요" />
        <FriendsTabs value={variant} onChange={(v) => nav(`/friends/${v}`)} className="w-full" />
        <FriendsList items={items} variant={variant} />
      </div>
    </div>
  );
}
