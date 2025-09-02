import { cn } from '@libs/cn';

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export default function ToggleSwitch({
  checked,
  onChange,
  disabled,
  className,
  label,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative inline-flex h-[2.6rem] w-[4.8rem] shrink-0 cursor-pointer rounded-full outline-[0.15rem] outline-primary-600 transition-colors',
        checked ? 'bg-primary-600' : 'bg-gray-50',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      <span
        className={cn(
          '-translate-y-1/2 pointer-events-none absolute top-1/2 block h-[2rem] w-[2rem] rounded-full shadow transition-transform',
          checked ? 'translate-x-[2.4rem] bg-gray-50' : 'translate-x-[0.2rem] bg-primary-600',
        )}
      />
    </button>
  );
}
