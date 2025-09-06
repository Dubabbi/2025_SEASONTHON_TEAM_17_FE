import { diariesQueries } from '@apis/diaries/diaries-queries';
import ThinkIcon from '@assets/icons/thinking.svg?react';
import DiaryCard from '@components/card/diary-card';
import { type DetailVM, toDetailVM } from '@pages/friends/utils/to-detail-vm';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

function isListEmptyPayload(raw: unknown) {
  const d = isObj(raw) && 'data' in raw ? ((raw as { data?: unknown }).data ?? raw) : raw;
  if (Array.isArray(d)) return d.length === 0;

  const d1 = isObj(d) ? (d as Record<string, unknown>).data : undefined;
  if (Array.isArray(d1)) return d1.length === 0;

  const d2 = isObj(d1) ? (d1 as Record<string, unknown>).data : undefined;
  if (Array.isArray(d2)) return d2.length === 0;

  return false;
}

export default function FriendDiaryPage() {
  const { diaryId } = useParams<{ diaryId: string }>();
  const idNum = Number(diaryId);
  const enabled = Number.isFinite(idNum);

  const detailQ = useQuery({ ...diariesQueries.detail(idNum), enabled });

  const vm: DetailVM | null = useMemo(() => toDetailVM(detailQ.data), [detailQ.data]);

  const dateObj = useMemo(() => {
    if (vm?.createdAt) {
      const d = dayjs(vm.createdAt);
      return d.isValid() ? d.toDate() : new Date(vm.createdAt);
    }
    return new Date();
  }, [vm?.createdAt]);

  const isEmpty = !enabled || isListEmptyPayload(detailQ.data) || !vm;

  return (
    <div className="min-h-dvh flex-col gap-[2rem] px-[2.4rem] pt-[2rem] pb-[12rem]">
      <div className="flex-col gap-[1.2rem]">
        {isEmpty ? (
          <div className="flex-col-center gap-[2rem] py-[2.6rem]">
            <ThinkIcon className="h-[6.4rem] w-[6.4rem]" />
            <span className="heading3-700 pt-[3rem] text-gray-900">아직 등록된 일기가 없어요</span>
          </div>
        ) : (
          <DiaryCard
            title={vm.title || '제목 없음'}
            content={vm.content || ''}
            date={dateObj}
            emotions={vm.emotions}
          />
        )}
      </div>
    </div>
  );
}
