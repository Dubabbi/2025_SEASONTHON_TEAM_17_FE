import { diariesQueries } from '@apis/diaries/diaries-queries';
import DefaultProfile from '@assets/icons/3d-hand.svg';
import FriendCancelSheet from '@components/bottom-sheet/friend-cancel-sheet';
import Button from '@components/button/button';
import DiaryCard from '@components/card/diary-card';
import { cn } from '@libs/cn';
import { useInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function FriendDetailPage() {
  const { id } = useParams<{ id: string }>();
  const email = id ?? '';
  const [openCancel, setOpenCancel] = useState(false);
  const nav = useNavigate();

  const friend = useMemo(() => ({ id: email, name: '사용자', email, avatarUrl: '' }), [email]);
  const avatarUrl = (friend as any).profileImageUrl ?? (friend as any).avatarUrl ?? '';

  const diariesQ = useInfiniteQuery({
    ...diariesQueries.listInfinite({ email, limit: 6 }),
    enabled: !!email,
  });

  const diaries = useMemo(
    () => (diariesQ.data?.pages ?? []).flatMap((p: any) => p.data?.data ?? []),
    [diariesQ.data],
  );

  return (
    <div className="min-h-dvh flex-col gap-[1.6rem] bg-gradient-bgd1 pb-[16rem]">
      <section className={cn('rounded-b-[30px]', 'px-[2.4rem] pt-[1.6rem] pb-[2rem]')}>
        <div className="flex items-start justify-between gap-[1.6rem]">
          <div className="flex min-w-0 items-center gap-[1.2rem]">
            <div className="h-[8rem] w-[8rem] overflow-hidden rounded-[12px] outline outline-primary-300 outline-offset-[-1px]">
              <img
                src={avatarUrl || DefaultProfile}
                alt=""
                className="h-full w-full object-cover"
                decoding="async"
              />
            </div>
            <div className="min-w-0 flex-col gap-[0.4rem]">
              <p className="heading2-600 truncate text-primary-600">{friend.name}</p>
              <p className="body1-500 truncate text-gray-400">{friend.email}</p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-[0.8rem]">
            <Button className="body1-500 cursor-default rounded-[8px] bg-primary-500 px-[4.1rem] py-[0.6rem] text-gray-50">
              친구
            </Button>
            <Button
              className="body1-500 rounded-[8px] bg-gray-50 px-[2.6rem] py-[0.6rem] text-primary-500 outline outline-primary-500 outline-offset-[-1px]"
              onClick={() => setOpenCancel(true)}
            >
              친구 취소
            </Button>
          </div>
        </div>
      </section>

      <main className="flex-col gap-[2rem] px-[2.4rem]">
        <h2 className="heading1-700 text-gray-900">{friend.name}님의 감정일기</h2>

        <div className="grid grid-cols-2 gap-[0.9rem]">
          {diaries.map((d: any) => (
            <button
              key={d.id}
              type="button"
              onClick={() =>
                nav(`/friends/${friend.id}/diary/${dayjs(d.createdAt).format('YYYY-MM-DD')}`)
              }
              className="text-left"
            >
              <DiaryCard
                title={d.title ?? '제목 없음'}
                content={d.content ?? ''}
                emotions={[]}
                date={new Date(d.createdAt)}
                className="bg-gray-50"
              />
            </button>
          ))}
        </div>
      </main>

      <FriendCancelSheet
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        onConfirm={() => {
          console.log('friend cancel:', friend.id);
          setOpenCancel(false);
        }}
      />
    </div>
  );
}
