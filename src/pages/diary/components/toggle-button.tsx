import Button from '@components/button/button';
import { cn } from '@libs/cn';

interface ToggleButtonProps {
  leftItem: string;
  rightItem: string;
  activeTab: string;
  setActiveTab: (type: string) => void;
}

export default function ToggleButton({
  leftItem,
  rightItem,
  activeTab,
  setActiveTab,
}: ToggleButtonProps) {
  const buttonStyle =
    'border-primary-400 body1-500 text-primary-400 rounded-[12px] border bg-gray-50 px-[2.5rem] py-[1.6rem]';
  const buttonActiveStyle = 'bg-primary-400 text-gray-50';

  return (
    <div className="flex-items-center gap-[1rem]">
      <Button
        className={cn(buttonStyle, activeTab === leftItem && buttonActiveStyle)}
        onClick={() => setActiveTab(leftItem)}
      >
        {leftItem}
      </Button>
      <Button
        className={cn(buttonStyle, activeTab === rightItem && buttonActiveStyle)}
        onClick={() => setActiveTab(rightItem)}
      >
        {rightItem}
      </Button>
    </div>
  );
}
