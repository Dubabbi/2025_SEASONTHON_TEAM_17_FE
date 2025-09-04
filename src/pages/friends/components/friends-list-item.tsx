import DefaultProfile from '@assets/icons/3d-hand.svg';
import Button from '@components/button/button';
import { cn } from '@libs/cn';

export type Friend = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

type Variant = 'list' | 'sent' | 'received';

type Props = {
  item: Friend;
  variant: Variant;
  className?: string;
  onOpen?: (id: string) => void;
  onCancel?: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
};

export default function FriendsListItem({
  item,
  variant,
  className,
  onOpen,
  onCancel,
  onAccept,
  onReject,
}: Props) {
  return (
    <li
      className={cn(
        'w-full items-center justify-between gap-[1.2rem] px-[0.4rem] py-[0.8rem] md:px-0',
        'flex',
        className,
      )}
    >
      <div className="flex min-w-0 items-center">
        <div className="h-[5.6rem] w-[5.6rem] overflow-hidden rounded-[12px] outline outline-primary-300">
          <img
            src={item.avatarUrl || DefaultProfile}
            alt=""
            className="h-full w-full object-cover"
            decoding="async"
          />
        </div>
        <div className="ml-[1.2rem] min-w-0">
          <div className="heading1-700 truncate text-primary-600">{item.name}</div>
          <div className="body2-500 truncate text-gray-400">{item.email}</div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-[0.8rem]">
        {variant === 'list' && (
          <>
            <Button
              className="rounded-[8px] bg-primary-600 px-[1.6rem] py-[0.7rem] text-gray-50"
              onClick={() => onOpen?.(item.id)}
            >
              보러 가기
            </Button>
            <Button
              className="rounded-[8px] bg-gray-white px-[1.6rem] py-[0.7rem] text-primary-600 outline outline-primary-600"
              onClick={() => onCancel?.(item.id)}
            >
              친구 취소
            </Button>
          </>
        )}

        {variant === 'sent' && (
          <Button
            className="rounded-full bg-gray-white px-[1.6rem] py-[0.7rem] text-primary-600 outline outline-primary-600"
            onClick={() => onCancel?.(item.id)}
          >
            요청 취소
          </Button>
        )}

        {variant === 'received' && (
          <>
            <Button
              className="rounded-full bg-primary-600 px-[1.6rem] py-[0.7rem] text-gray-50"
              onClick={() => onAccept?.(item.id)}
            >
              수락
            </Button>
            <Button
              className="rounded-full bg-gray-white px-[1.6rem] py-[0.7rem] text-primary-600 outline outline-primary-600"
              onClick={() => onReject?.(item.id)}
            >
              거절
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
