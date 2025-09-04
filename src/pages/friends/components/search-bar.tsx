import SearchIcon from '@assets/icons/search.svg?react';
import { cn } from '@libs/cn';
import { useRef } from 'react';

export type SearchBarProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
};

export default function SearchBar({
  value,
  defaultValue,
  placeholder = '검색어를 입력하세요',
  disabled,
  className = 'w-full',
  ariaLabel = '검색',
  onChange,
  onSubmit,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const v = value ?? inputRef.current?.value ?? '';
    onSubmit?.(v);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex-row-between rounded-[12px] border border-primary-600 bg-gray-50 px-[1.2rem] py-[1.4rem]',
        className,
      )}
    >
      <input
        ref={inputRef}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          'body1-500 text-gray-900 placeholder-gray-300',
          'w-full min-w-0 border-none bg-transparent outline-none',
        )}
      />
      <button type="submit" aria-label="검색 실행" disabled={disabled} className="shrink-0">
        <SearchIcon className="h-[2.4rem] w-[2.4rem] text-primary-600" />
      </button>
    </form>
  );
}
