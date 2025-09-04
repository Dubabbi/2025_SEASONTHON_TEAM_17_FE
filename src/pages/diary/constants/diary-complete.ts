export type DiaryCompleteVariant = 'extracted' | 'saved';

type Copy = { title: string; desc: string; primary: string };

/** 다이어리 완료 시트 카피 */
export const DIARY_COMPLETE_COPY: Record<DiaryCompleteVariant, Copy> = {
  extracted: {
    title: '작성을 완료했습니다.',
    desc: '지금 작성한 내용에 대해 마몬이가 공감 멘트와 감정 5개를 추출했어요. 확인해보시겠어요?',
    primary: '마몬의 분석 보러 가기',
  },
  saved: {
    title: '마몬의 분석을 저장했어요.',
    desc: '직접 작성한 감정 일기와 마몬의 따뜻한 말 한마디, 그리고 분석한 감정을 확인하러 가볼까요?',
    primary: '확인하러 가기',
  },
} as const;

/** 보조 버튼 라벨 */
export const DIARY_COMPLETE_SECONDARY = {
  withMain: '일기 메인 페이지로 이동',
  later: '나중에 확인하기',
} as const;
