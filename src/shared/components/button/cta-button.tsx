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
      className={cn(baseBtn, 'bg-gray-100 text-gray-600', className)}
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
