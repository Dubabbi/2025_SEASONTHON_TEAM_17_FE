import ThinkIcon from '@assets/icons/thinking.svg?react';
import FriendCancelSheet from '@components/bottom-sheet/friend-cancel-sheet';
import Button from '@components/button/button';
import { cn } from '@libs/cn';
import { MOCK_FRIENDS, MOCK_RECEIVED, MOCK_SENT } from '@mocks/friends';
import FriendsHeader from '@pages/friends/components/friends-header';
import FriendsList from '@pages/friends/components/friends-list';
import SearchBar from '@pages/friends/components/search-bar';
import SegmentedTabs from '@pages/friends/components/segmented-tabs';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FriendsTab = 'list' | 'sent' | 'received';

export default function FriendsPage() {
  const [tab, setTab] = useState<FriendsTab>('list');
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const nav = useNavigate();

  const items = useMemo(() => {
    if (tab === 'sent') return MOCK_SENT;
    if (tab === 'received') return MOCK_RECEIVED;
    return MOCK_FRIENDS;
  }, [tab]);

  const previewItems = useMemo(() => items.slice(0, 5), [items]);
  const isEmpty = previewItems.length === 0;

  const handleConfirmCancel = () => {
    if (cancelTarget) {
      console.log('friend cancel:', cancelTarget);
      setCancelTarget(null);
    }
  };

  return (
    <div className="min-h-dvh flex-col pb-[15rem]">
      <FriendsHeader />
      <div className="flex-col-center gap-[1.5rem] px-[2.4rem] py-[1.5rem]">
        <SearchBar placeholder="친구를 검색해 보세요" />

        <SegmentedTabs
          items={[
            { value: 'list', label: '내 친구 목록' },
            { value: 'sent', label: '요청한 친구 목록' },
            { value: 'received', label: '요청받은 친구 목록' },
          ]}
          value={tab}
          onChange={(v) => setTab(v as FriendsTab)}
          className="w-full"
        />

        <div className="w-full flex-row-between">
          <span className="heading1-700">
            {tab === 'list' && '내 친구 목록'}
            {tab === 'sent' && '요청한 친구 목록'}
            {tab === 'received' && '요청받은 친구 목록'}
          </span>
          <Button
            className={cn(
              'body2-500 rounded-full px-[1.6rem] py-[0.55rem]',
              'bg-gray-50 text-primary-800 outline outline-primary-800',
            )}
            onClick={() => nav(`/friends/all?tab=${tab}`)}
          >
            전체 보기
          </Button>
        </div>

        {isEmpty ? (
          <div className="flex-col-center gap-[3rem] py-[2.6rem]">
            <ThinkIcon className="h-[6.4rem] w-[6.4rem]" />
            <span className="heading3-700 text-gray-900">아직 등록된 친구가 없어요</span>
          </div>
        ) : (
          <FriendsList
            items={previewItems}
            variant={tab}
            onOpen={(id) => nav(`/friends/${id}`)}
            onCancel={tab === 'list' ? (id) => setCancelTarget(id) : undefined}
            onAccept={(id) => console.log('accept', id)}
            onReject={(id) => console.log('reject', id)}
          />
        )}
      </div>

      <FriendCancelSheet
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
