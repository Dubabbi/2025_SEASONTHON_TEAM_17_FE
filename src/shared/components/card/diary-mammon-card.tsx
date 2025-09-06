import Button from '@components/button/button';
import Divider from '@components/divider';
import ReactionBarChipsLite, {
  type EmotionId,
  type ReactionCounts,
} from '@components/reaction/reaction-bar-chips-lite';
import { cn } from '@libs/cn';
import dayjs from 'dayjs';

interface Props {
  title: string;
  content: string;
  date: Date;
  aiText?: string;
  counts: ReactionCounts;
  order?: EmotionId[];
  myToggles: Set<EmotionId>;
  onToggle: (id: EmotionId) => void;
  onClickCheck?: () => void;
  className?: string;
}

export default function DiaryMammonCard({
  title,
  content,
  date,
  aiText,
  order,
  counts,
  myToggles,
  onToggle,
  onClickCheck,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'w-full flex-col gap-[1.2rem] rounded-[20px] p-[1.6rem]',
        'border border-primary-600 bg-gray-50 shadow-[0_4px_16px_rgba(255,105,180,0.08)]',
        className,
      )}
    >
      <p className="heading3-500">{title}</p>
      <p className="body2-500 min-h-[4.8rem] break-words">{content}</p>

      {/* 리액션 칩 */}
      <ReactionBarChipsLite
        counts={counts}
        order={order}
        myToggles={myToggles}
        onToggle={onToggle}
      />

      <Divider />

      <div className="flex-row-between items-center">
        <p className="detail text-gray-400">{dayjs(date).format('YYYY.MM.DD')}</p>
        <Button
          onClick={onClickCheck || undefined}
          className="detail rounded-[999px] border border-primary-600 bg-gray-50 px-[1.6rem] py-[0.7rem] text-primary-600"
        >
          {onClickCheck ? '확인' : 'From. 마몬'}
        </Button>
      </div>

      {aiText && (
        <div className="mt-[0.8rem]">
          <span className="rounded-[999px] bg-gray-100 px-3 py-1 font-semibold text-[12px] text-primary-600">
            From. 마몬
          </span>
          <p className="body2-500 mt-2 whitespace-pre-wrap text-gray-900">{aiText}</p>
        </div>
      )}
    </div>
  );
}
