import SegmentedTabs, { type SegmentedTabItem } from '@pages/friends/components/segmented-tabs';
import { useState } from 'react';

export type FriendsTab = 'list' | 'sent' | 'received';

type Props = {
  value?: FriendsTab;
  onChange?: (v: FriendsTab) => void;
  className?: string;
};

const items: SegmentedTabItem[] = [
  { value: 'list', label: '내 친구 목록' },
  { value: 'sent', label: '요청한 친구 목록' },
  { value: 'received', label: '요청받은 친구 목록' },
];

export default function FriendsTabs({ value, onChange, className }: Props) {
  const [inner, setInner] = useState<FriendsTab>(value ?? 'list');
  const val = value ?? inner;

  const handleChange = (v: string) => {
    const next = v as FriendsTab;
    if (!value) setInner(next);
    onChange?.(next);
  };

  return <SegmentedTabs items={items} value={val} onChange={handleChange} className={className} />;
}
