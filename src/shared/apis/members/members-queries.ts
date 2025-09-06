import { QK } from '@apis/constants/keys';
import { buildQuery } from '@apis/factory';
import { membersApi } from '@apis/members/members';

type MypageVM = { nickname: string; profileUrl?: string };

type RawMypageDto = { nickname?: string; profilePath?: string | null };

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

const hasData = (v: unknown): v is { data: unknown } => isRecord(v) && 'data' in v;

const isRawMypageDto = (v: unknown): v is RawMypageDto => {
  if (!isRecord(v)) return false;
  const n = (v as Record<string, unknown>).nickname;
  const p = (v as Record<string, unknown>).profilePath;
  const nOk = typeof n === 'string' || typeof n === 'undefined';
  const pOk = typeof p === 'string' || p === null || typeof p === 'undefined';
  return nOk && pOk;
};

export const membersQueries = {
  mypage: () =>
    buildQuery<MypageVM>(
      QK.members.mypage(),
      async () => {
        const res = await membersApi.mypage();

        let dto: RawMypageDto = {};
        if (hasData(res) && isRawMypageDto(res.data)) {
          dto = res.data;
        } else if (isRawMypageDto(res)) {
          dto = res;
        }

        return {
          nickname: dto.nickname ?? '',
          profileUrl: dto.profilePath ?? undefined,
        };
      },
      { staleTime: 60_000 },
    ),
};
