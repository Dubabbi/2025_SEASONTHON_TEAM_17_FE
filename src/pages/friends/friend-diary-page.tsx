import DiaryCard from '@components/card/diary-card';
import { cn } from '@libs/cn';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export default function FriendDiaryPage() {
  const { id, date } = useParams<{ id: string; date: string }>();
  const d = useMemo(() => (date ? dayjs(date).toDate() : new Date()), [date]);

  return (
    <div className="min-h-dvh flex-col gap-[1.6rem] px-[2.4rem] pt-[1.2rem] pb-[12rem]">
      <div className="flex-col gap-[1.2rem]">
        {/* TODO: 카드 컴포넌트 수정 후 삭제하기로 변경 */}
        <DiaryCard
          title="피곤하다..."
          content="아야아"
          date={d}
          onClickButton={() => console.log('delete my diary')}
        />
        <div className="relative">
          <DiaryCard
            title="피곤하다..."
            content="아야아"
            emotions={['행복 (5)', '행복 (5)', '행복 (5)', '행복 (5)', '행복 (5)']}
            date={d}
            className={cn('bg-gray-50 outline outline-primary-500')}
            onClickButton={() => console.log('open friend diary')}
          />
          <span className="detail absolute right-[1.6rem] bottom-[1.6rem] rounded-full border border-primary-500 bg-white px-[1.2rem] py-[0.6rem] text-primary-500">
            From. 마몬
          </span>
        </div>
      </div>
    </div>
  );
}
