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
        'relative inline-flex h-[2.8rem] w-[4.8rem] shrink-0 cursor-pointer rounded-full transition-colors',
        checked ? 'bg-primary-600' : 'bg-gray-300',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <span
        className={cn(
          '-translate-y-1/2 pointer-events-none absolute top-1/2 block h-[2.2rem] w-[2.2rem] rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-[2.4rem]' : 'translate-x-[0.2rem]',
        )}
      />
    </button>
  );
}
