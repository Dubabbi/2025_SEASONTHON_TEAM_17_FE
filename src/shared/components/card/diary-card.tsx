import Button from '@components/button/button';
import Chips from '@components/chips/chips';
import Divider from '@components/divider';
import { cn } from '@libs/cn';
import dayjs from 'dayjs';

interface DiaryCardProps {
  title?: string;
  content?: string;
  emotions?: string[];
  date?: Date;
  onClickButton?: (type: '작성하기' | '수정하기') => void;
  className?: string;
}

const DiaryCard = ({
  title,
  content,
  emotions,
  date,
  className = 'bg-gray-50',
  onClickButton,
}: DiaryCardProps) => {
  const isEmpty = !title && !content && emotions?.length === 0;
  const type = isEmpty ? '작성하기' : '수정하기';

  return (
    <div
      className={cn(
        'w-full flex-col gap-[1.2rem] rounded-[20px] border border-gray-200 p-[1.6rem]',
        className,
      )}
    >
      {!isEmpty && (
        <>
          <p className="heading3-500">{title}</p>
          <p className="body2-500 h-[7.2rem] break-words">{content}</p>
          <div className="pr-[7.1rem]">
            <Chips size="small" emotions={emotions} />
          </div>
        </>
      )}
      {isEmpty && (
        <p className="body1-500 text-gray-900">해당 날짜에는 감정 일기 기록이 없어요😢</p>
      )}
      <Divider />
      <div className="flex-row-between">
        <p className="detail text-gray-400">{dayjs(date).format('YYYY.MM.DD')}</p>
        <Button
          onClick={() => onClickButton?.(type)}
          className="detail rounded-[999px] bg-gray-100 px-[1.6rem] py-[0.7rem] text-gray-600"
        >
          {type}
        </Button>
      </div>
    </div>
  );
};

export default DiaryCard;
