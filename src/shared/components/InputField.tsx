import type React from 'react';
import { forwardRef, useId } from 'react';

type InputVariant = 'default' | 'error' | 'success';

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  variant?: InputVariant;
  helperText?: string;
}

const WRAP_BASE = 'flex-col justify-start items-start gap-[0.4rem] w-full';
const ROW_BASE =
  'w-full p-[1.2rem] rounded-[8px] outline outline-1 outline-offset-[-1px] inline-flex justify-between items-center overflow-hidden';
const INPUT_BASE = 'flex-1 bg-transparent outline-none body1-400 placeholder:text-gray-300';
const HELPER_BASE = 'w-full detail';

const PALETTE = {
  default: {
    row: 'bg-gray-50 outline-gray-200',
    input: 'text-gray-500',
    helper: 'text-gray-500',
  },
  error: {
    row: 'bg-pink-100 outline-error-default',
    input: 'text-error-default',
    helper: 'text-error-default',
  },
  success: {
    row: 'bg-success-bgd outline-success-default',
    input: 'text-success-default',
    helper: 'text-success-default',
  },
} as const;

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { variant = 'default', helperText, placeholder, ...rest },
  ref,
) {
  const tone = PALETTE[variant];
  const _id = useId();
  const helperId = helperText ? `${_id}-help` : undefined;

  return (
    <div className={WRAP_BASE} data-variant={variant}>
      <div className={[ROW_BASE, tone.row].join(' ')}>
        <input
          {...rest}
          ref={ref}
          id={_id}
          placeholder={placeholder}
          aria-invalid={variant === 'error' || undefined}
          aria-describedby={helperId}
          className={[INPUT_BASE, tone.input].join(' ')}
        />
      </div>

      {helperText !== undefined ? (
        <div id={helperId} className={[HELPER_BASE, tone.helper].join(' ')}>
          {helperText}
        </div>
      ) : null}
    </div>
  );
});

export default InputField;
