import { cn } from '@libs/cn';
import FriendsListItem, { type Friend } from './friends-list-item';

type Variant = 'list' | 'sent' | 'received';

type Props = {
  items: Friend[];
  variant: Variant;
  className?: string;
  onOpen?: (id: string) => void;
  onCancel?: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
};

export default function FriendsList({ items, variant, className, ...handlers }: Props) {
  return (
    <ul className={cn('w-full space-y-[1.2rem]', className)}>
      {items.map((it) => (
        <FriendsListItem key={it.id} item={it} variant={variant} {...handlers} />
      ))}
    </ul>
  );
}
