type EmotionStatItem = { label: string; prev: number; curr: number };

export const MOCK_USER = {
  username: '사용자',
  statsSelf: [
    { label: '기쁨', prev: 12, curr: 30 },
    { label: '슬픔', prev: 12, curr: 24 },
    { label: '피곤', prev: 12, curr: 30 },
    { label: '놀람', prev: 12, curr: 24 },
    { label: '설렘', prev: 12, curr: 30 },
  ] as EmotionStatItem[],
  statsFriend: [
    { label: '기쁨', prev: 10, curr: 22 },
    { label: '슬픔', prev: 14, curr: 18 },
    { label: '피곤', prev: 11, curr: 20 },
    { label: '놀람', prev: 9, curr: 16 },
    { label: '설렘', prev: 8, curr: 19 },
  ] as EmotionStatItem[],
};
