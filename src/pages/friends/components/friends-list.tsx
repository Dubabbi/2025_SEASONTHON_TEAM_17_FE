import { cn } from '@libs/cn';
import FriendsListItem, { type Friend } from './friends-list-item';

type Props = {
  items: Friend[];
  variant: 'list' | 'sent' | 'received';
  onOpen?: (email: string) => void;
  onCancel?: (email: string) => void;
  onAccept?: (email: string) => void;
  onReject?: (email: string) => void;
  onRequest?: (email: string) => void;
  className?: string;
};

export default function FriendsList({
  items,
  variant,
  onOpen,
  onCancel,
  onAccept,
  onReject,
  onRequest,
  className,
}: Props) {
  return (
    <ul className={cn('w-full flex-col gap-[1.2rem]', className)}>
      {items.map((it) => (
        <FriendsListItem
          key={it.email}
          item={it}
          variant={variant}
          onOpen={onOpen}
          onCancel={onCancel}
          onAccept={onAccept}
          onReject={onReject}
          onRequest={onRequest}
        />
      ))}
    </ul>
  );
}
