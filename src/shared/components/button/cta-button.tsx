import HeartIcon from '@assets/icons/heart.svg?react';
import KakaoIcon from '@assets/icons/kakao.svg?react';
import Button, { type ButtonProps } from '@components/button/button';
import { cn } from '@libs/cn';

const baseBtn =
  'w-full py-[1.7rem] rounded-[16px] transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 ' +
  'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';

export function PrimaryCTA({ className, labelClassName, children, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(baseBtn, 'bg-primary-600 text-gray-50', className)}
      labelClassName={cn('heading2-600', labelClassName)}
      {...props}
    >
      {children}
    </Button>
  );
}

export function PrimaryStrongCTA({ className, labelClassName, children, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(baseBtn, 'bg-primary-800 text-gray-50', className)}
      labelClassName={cn('heading1-700', labelClassName)}
      {...props}
    >
      {children}
    </Button>
  );
}

export function GrayCTA({ className, labelClassName, children, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(baseBtn, 'cursor-not-allowed bg-gray-100 text-gray-600', className)}
      labelClassName={cn('heading2-600', labelClassName)}
      {...props}
    >
      {children}
    </Button>
  );
}

export function ErrorCTA({ className, labelClassName, children, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(baseBtn, 'bg-error-default text-gray-50', className)}
      labelClassName={cn('heading2-600', labelClassName)}
      {...props}
    >
      {children}
    </Button>
  );
}

export function KakaoStartCTA({
  className,
  labelClassName,
  leftIcon,
  leftIconClassName,
  children = '카카오로 시작하기',
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn(baseBtn, 'gap-[2rem] bg-kakao-bgd text-kakao-text', className)}
      labelClassName={cn('heading3-700', labelClassName)}
      leftIcon={leftIcon ?? <KakaoIcon className="h-[2.4rem] w-[2.4rem]" />}
      leftIconClassName={cn(leftIconClassName)}
      {...props}
    >
      {children}
    </Button>
  );
}

export function MaeumStartCTA({
  className,
  labelClassName,
  leftIcon,
  leftIconClassName,
  children = '마음:ON 시작하기',
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn(baseBtn, 'gap-[0.8rem] bg-gray-900 text-gray-50', className)}
      labelClassName={cn('heading2-700', labelClassName)}
      leftIcon={leftIcon ?? <HeartIcon className="h-[2.0rem] w-[2.0rem]" />}
      leftIconClassName={cn('text-primary-600', leftIconClassName)}
      {...props}
    >
      {children}
    </Button>
  );
}
