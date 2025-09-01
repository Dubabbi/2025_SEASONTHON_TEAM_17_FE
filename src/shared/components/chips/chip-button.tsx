import { cn } from '@libs/cn';
import type { ElementType } from 'react';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Icon?: ElementType;
  isSelected?: boolean;
  onClick?: () => void;
  size: 'small' | 'large';
}

const ChipButton = ({ children, Icon, isSelected, onClick, size }: ChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-row-center cursor-pointer border border-primary-400',
        isSelected && 'bg-primary-400',
        size === 'small' && 'gap-[0.5rem] rounded-[999px] px-[1.6rem] py-[0.7rem]',
        size === 'large' && 'gap-[1rem] rounded-[12px] px-[1.9rem] py-[1.2rem]',
      )}
    >
      {Icon ? (
        <Icon
          className={cn(
            size === 'small' && 'h-[1.6rem] w-[1.6rem]',
            size === 'large' && 'h-[3.2rem] w-[3.2rem]',
          )}
        />
      ) : null}
      <p
        className={cn(
          size === 'small' && 'detail',
          size === 'large' && 'body1-500',
          isSelected ? 'text-gray-50' : 'text-primary-400',
        )}
      >
        {children}
      </p>
    </button>
  );
};

export default ChipButton;
