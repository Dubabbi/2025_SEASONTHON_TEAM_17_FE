import Button from '@components/button/button';
import Chips from '@components/chips/chips';
import Divider from '@components/divider';
import { cn } from '@libs/cn';

interface EmotionCardProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  onClickCheck?: () => void;
  onClickClose?: () => void;
}

const EmotionCard = ({ selected, onChange, onClickCheck, onClickClose }: EmotionCardProps) => {
  const buttonStyle = 'detail rounded-[999px] px-[1.6rem] py-[0.7rem]';

  return (
    <div className="w-full flex-col gap-[1.2rem] rounded-[20px] border border-primary-600 px-[1.6rem] py-[2rem]">
      <p className="heading3-500 text-primary-600">오늘의 감정 체크</p>
      <p className="body2-500 text-gray-900">오늘의 감정은 어떤가요?</p>
      <div className="pr-[7.1rem]">
        <Chips size="small" selected={selected} onChange={onChange} />
      </div>
      <Divider />
      <div className="flex-row-end gap-[1rem]">
        <Button onClick={onClickCheck} className={cn(buttonStyle, 'bg-primary-400 text-gray-50')}>
          확인
        </Button>
        <Button
          onClick={onClickClose}
          className={cn(buttonStyle, 'border border-primary-400 text-primary-400')}
        >
          닫기
        </Button>
      </div>
    </div>
  );
};

export default EmotionCard;
