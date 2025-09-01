import type React from 'react';
import { forwardRef, useId } from 'react';

type TextVariant = 'default' | 'error' | 'success';

export interface TextFieldProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  variant?: TextVariant;
  helperText?: string;
}

const WRAP_BASE = 'flex-col justify-start items-start gap-[0.4rem] w-full';
const ROW_BASE =
  'w-full p-[1.2rem] rounded-[8px] outline outline-1 outline-offset-[-1px] inline-flex justify-start items-start overflow-hidden';
const TEXTAREA_BASE =
  'w-full min-h-[36rem] resize-none bg-transparent outline-none body1-400 placeholder:text-gray-300';
const HELPER_BASE = 'w-full detail';

const PALETTE = {
  default: {
    row: 'bg-gray-50 outline-gray-200',
    text: 'text-gray-500',
    helper: 'text-gray-500',
  },
  error: {
    row: 'bg-error-bgd outline-error-default',
    text: 'text-error-default',
    helper: 'text-error-default',
  },
  success: {
    row: 'bg-success-bgd outline-success-default',
    text: 'text-success-default',
    helper: 'text-success-default',
  },
} as const;

const TextField = forwardRef<HTMLTextAreaElement, TextFieldProps>(function TextField(
  { variant = 'default', helperText, placeholder, ...rest },
  ref,
) {
  const tone = PALETTE[variant];
  const _id = useId();
  const helperId = helperText ? `${_id}-help` : undefined;

  return (
    <div className={WRAP_BASE} data-variant={variant}>
      <div className={[ROW_BASE, tone.row].join(' ')}>
        <textarea
          {...rest}
          ref={ref}
          id={_id}
          placeholder={placeholder}
          aria-invalid={variant === 'error' || undefined}
          aria-describedby={helperId}
          className={[TEXTAREA_BASE, tone.text].join(' ')}
        />
      </div>

      {helperText !== undefined && (
        <div id={helperId} className={[HELPER_BASE, tone.helper].join(' ')}>
          {helperText}
        </div>
      )}
    </div>
  );
});

export default TextField;
