import { cn } from '@libs/cn';
import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: React.ReactNode;
  labelClassName?: string;
  leftIconClassName?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, leftIcon, children, labelClassName, leftIconClassName, type = 'button', ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'flex cursor-pointer items-center justify-center',
          'focus-visible:outline-none',
          className,
        )}
        {...props}
      >
        {leftIcon != null && <span className={cn('shrink-0', leftIconClassName)}>{leftIcon}</span>}
        {children != null && <span className={cn('', labelClassName)}>{children}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
