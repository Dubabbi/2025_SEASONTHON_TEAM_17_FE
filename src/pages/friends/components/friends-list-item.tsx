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
        'w-full flex-row-between gap-[1.2rem] px-[0.4rem] py-[0.8rem] md:px-0',
        className,
      )}
    >
      <div className="min-w-0 flex-row-center items-center gap-[2rem]">
        <div className="h-[8rem] w-[8rem] overflow-hidden rounded-[8px] outline outline-primary-300 outline-offset-[-1px]">
          <img
            src={item.avatarUrl || DefaultProfile}
            alt=""
            className="h-full w-full object-cover"
            decoding="async"
          />
        </div>
        <div className="flex-col gap-[1rem]">
          <div className="heading3-700 text-primary-500">{item.name}</div>
          <div className="body1-500 truncate text-gray-500">{item.email}</div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-[0.8rem]">
        {variant === 'list' && (
          <>
            <Button
              className="body1-500 rounded-[8px] bg-primary-500 px-[2.6rem] py-[0.6rem] text-gray-50"
              onClick={() => onOpen?.(item.id)}
            >
              보러 가기
            </Button>
            <Button
              className="body1-500 rounded-[8px] bg-gray-50 px-[2.6rem] py-[0.6rem] text-primary-500 outline outline-primary-500 outline-offset-[-1px]"
              onClick={() => onCancel?.(item.id)}
            >
              친구 취소
            </Button>
          </>
        )}

        {variant === 'sent' && (
          <Button
            className="body1-500 rounded-[8px] bg-gray-50 px-[2.6rem] py-[0.6rem] text-primary-500 outline outline-primary-500 outline-offset-[-1px]"
            onClick={() => onCancel?.(item.id)}
          >
            요청 취소
          </Button>
        )}

        {variant === 'received' && (
          <>
            <Button
              className="body1-500 rounded-[8px] bg-success-bgd px-[2.6rem] py-[0.6rem] text-success-default outline outline-success-default outline-offset-[-1px]"
              onClick={() => onAccept?.(item.id)}
            >
              수락하기
            </Button>
            <Button
              className="body1-500 rounded-[8px] bg-error-bgd px-[2.6rem] py-[0.6rem] text-error-default outline outline-error-default outline-offset-[-1px]"
              onClick={() => onReject?.(item.id)}
            >
              거절하기
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
