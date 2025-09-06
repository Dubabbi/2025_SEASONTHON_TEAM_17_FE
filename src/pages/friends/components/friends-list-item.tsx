import DefaultProfile from '@assets/icons/3d-hand.svg';
import Button from '@components/button/button';
import { cn } from '@libs/cn';

export type Friend = {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string | null;
  cursorId?: number | null;
  isFriend?: boolean;
  isRequested?: boolean;
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
  onRequest?: (id: string) => void;
};

export default function FriendsListItem({
  item,
  variant,
  className,
  onOpen,
  onCancel,
  onAccept,
  onReject,
  onRequest,
}: Props) {
  const isFriend = item.isFriend === true;
  const isRequested = item.isRequested === true;

  return (
    <li
      className={cn(
        'w-full flex-row items-end gap-[3rem] px-[0.4rem] py-[0.8rem] md:px-0',
        className,
      )}
    >
      <div className="h-[8rem] w-[8rem] overflow-hidden rounded-[8px] outline outline-primary-300 outline-offset-[-1px]">
        <img
          src={item.profileImageUrl || DefaultProfile}
          alt=""
          className="h-full w-full object-cover"
          decoding="async"
        />
      </div>

      <div className="flex-col items-start gap-[0.7rem]">
        <div className="flex gap-[1rem]">
          <div className="heading3-700 text-primary-500">{item.name}</div>
          <div className="body1-500 text-gray-500">{item.email}</div>
        </div>

        <div className={cn('flex-row-center shrink-0 gap-[1.7rem]')}>
          {variant === 'list' && isFriend && (
            <>
              <Button
                className="body1-500 rounded-[8px] bg-primary-500 px-[2.6rem] py-[0.6rem] text-gray-50 max-[360px]:flex-1 max-[360px]:px-[1.2rem]"
                onClick={() => onOpen?.(item.id)}
              >
                보러 가기
              </Button>
              <Button
                className="body1-500 rounded-[8px] bg-gray-50 px-[2.6rem] py-[0.6rem] text-primary-500 outline outline-primary-500 outline-offset-[-1px] max-[360px]:flex-1 max-[360px]:px-[1.2rem]"
                onClick={() => onCancel?.(item.id)}
              >
                친구 취소
              </Button>
            </>
          )}

          {variant === 'list' && !isFriend && !isRequested && (
            <>
              <Button
                className="body1-500 rounded-[8px] bg-primary-500 px-[2.6rem] py-[0.6rem] text-gray-50 max-[360px]:flex-1 max-[360px]:px-[1.2rem]"
                onClick={() => onOpen?.(item.id)}
              >
                보러 가기
              </Button>
              <Button
                className="body1-500 rounded-[8px] bg-gray-50 px-[2.6rem] py-[0.6rem] text-primary-500 outline outline-primary-500 outline-offset-[-1px] max-[360px]:flex-1 max-[360px]:px-[1.2rem]"
                onClick={() => onRequest?.(item.id)}
              >
                친구 요청
              </Button>
            </>
          )}

          {variant === 'sent' && (
            <>
              <span className="body1-500 cursor-default whitespace-nowrap rounded-[8px] bg-gray-100 px-[4.1rem] py-[0.6rem] text-gray-500 outline outline-gray-500 outline-offset-[-1px] max-[360px]:flex-1 max-[360px]:px-[1.2rem]">
                대기
              </span>
              <Button
                className="body1-500 rounded-[8px] bg-gray-50 px-[2.6rem] py-[0.6rem] text-primary-500 outline outline-primary-500 outline-offset-[-1px] max-[360px]:w-full max-[360px]:px-[1.2rem]"
                onClick={() => onCancel?.(item.id)}
              >
                요청 취소
              </Button>
            </>
          )}

          {variant === 'received' && (
            <>
              <Button
                className="body1-500 rounded-[8px] bg-success-bgd px-[2.6rem] py-[0.6rem] text-success-default outline outline-success-default outline-offset-[-1px] max-[360px]:flex-1 max-[360px]:px-[1.2rem]"
                onClick={() => onAccept?.(item.id)}
              >
                수락하기
              </Button>
              <Button
                className="body1-500 rounded-[8px] bg-error-bgd px-[2.6rem] py-[0.6rem] text-error-default outline outline-error-default outline-offset-[-1px] max-[360px]:flex-1 max-[360px]:px-[1.2rem]"
                onClick={() => onReject?.(item.id)}
              >
                거절하기
              </Button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
