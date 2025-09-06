import { diariesQueries } from '@apis/diaries/diaries-queries';
import DefaultProfile from '@assets/icons/3d-hand.svg';
import Button from '@components/button/button';
import DiaryCard from '@components/card/diary-card';
import { useToast } from '@contexts/toast-context';
import { cn } from '@libs/cn';
import {
  type DiaryPreview,
  diaryDetailPath,
  extractDiariesFromPage,
} from '@pages/friends/utils/normalize';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

type NavState = {
  nickname?: string;
  email?: string;
  profileImageUrl?: string | null;
  avatarUrl?: string | null;
  isFriend?: boolean;
  isRequested?: boolean;
};

export default function FriendDetailPage() {
  const { id } = useParams<{ id: string }>();
  const email = id ?? '';
  const location = useLocation();
  const s = (location.state ?? {}) as NavState;

  const nav = useNavigate();
  const { showToast } = useToast();

  const isFriend = s.isFriend === true;
  const isRequested = s.isRequested === true;
  const friend = useMemo(
    () => ({
      id: email,
      name: s.nickname ?? '친구',
      email,
      profileImageUrl: s.profileImageUrl ?? s.avatarUrl ?? undefined,
    }),
    [email, s.nickname, s.profileImageUrl, s.avatarUrl],
  );

  const { pathname, search } = location;

  useEffect(() => {
    if (!s.nickname && friend.name && friend.name !== '친구') {
      nav(pathname + search, {
        replace: true,
        state: {
          nickname: friend.name,
          email: friend.email,
          profileImageUrl: friend.profileImageUrl ?? null,
          isFriend,
          isRequested,
        },
      });
    }
  }, [
    s.nickname,
    friend.name,
    friend.email,
    friend.profileImageUrl,
    isFriend,
    isRequested,
    pathname,
    search,
    nav,
  ]);

  const diariesQ = useInfiniteQuery({
    ...diariesQueries.listInfinite({ email, limit: 6 }),
    enabled: !!email,
  });

  const pages = diariesQ.data?.pages ?? [];
  const diaries: DiaryPreview[] = useMemo(() => pages.flatMap(extractDiariesFromPage), [pages]);

  const avatarUrl = friend.profileImageUrl ?? '';

  return (
    <div className="min-h-dvh flex-col gap-[1.6rem] bg-gradient-bgd1 pb-[16rem]">
      <section className={cn('rounded-b-[30px]', 'px-[2.4rem] pt-[1.6rem] pb-[2rem]')}>
        <div className="flex-col gap-[0.8rem] text-left">
          <div className="flex items-center gap-[3rem]">
            <div className="h-[8rem] w-[8rem] overflow-hidden rounded-[12px] outline outline-primary-300 outline-offset-[-1px]">
              <img
                src={avatarUrl || DefaultProfile}
                alt=""
                className="h-full w-full object-cover"
                decoding="async"
              />
            </div>

            <div className="flex-col gap-[0.7rem]">
              <div className="flex gap-[1rem]">
                <p className="heading3-700 truncate text-primary-500">{friend.name}</p>
                <p className="body1-500 truncate text-gray-500">{friend.email}</p>
              </div>
              <div className="flex-row gap-[1.2rem]">
                {isFriend ? (
                  <span className="body1-500 cursor-default rounded-[8px] bg-primary-500 px-[4.1rem] py-[0.6rem] text-gray-50">
                    친구
                  </span>
                ) : (
                  <Button
                    className="body1-500 rounded-[8px] bg-gray-50 px-[2.6rem] py-[0.6rem] text-primary-500 outline outline-primary-500 outline-offset-[-1px]"
                    onClick={() => showToast('친구 요청을 보냈어요.')}
                  >
                    친구 요청
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-col gap-[2rem] px-[2.4rem]">
        <h2 className="heading1-700 text-gray-900">{friend.name}님의 감정일기</h2>

        <div className="grid grid-cols-2 gap-[0.9rem]">
          {diaries.map((d) => (
            <button
              key={String(d.id)}
              type="button"
              onClick={() =>
                nav(diaryDetailPath(friend.id, d.id), {
                  state: {
                    nickname: friend.name,
                    email: friend.email,
                    profileImageUrl: friend.profileImageUrl ?? null,
                    isFriend,
                    isRequested,
                  },
                })
              }
              className="text-left"
            >
              <DiaryCard
                title={d.title ?? '제목 없음'}
                content={d.preview ?? ''}
                emotions={[]}
                date={new Date(d.createdAt)}
                className="cursor-pointer bg-gray-50"
              />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
