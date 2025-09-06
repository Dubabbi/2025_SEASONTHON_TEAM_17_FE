export const QK = {
  auth: {
    verify: () => ['auth', 'verify'] as const,
    notifications: () => ['fcm', 'notifications'] as const,
  },
  diaries: {
    list: (email: string, limit?: number) => ['diaries', 'list', email, limit ?? 3] as const,
    detail: (id: number | string) => ['diaries', 'detail', id] as const,
    today: () => ['diaries', 'today'] as const,
    month: (y: number, m: number) => ['diaries', 'month', y, m] as const,
    date: (y: number, m: number, d: number) => ['diaries', 'date', y, m, d] as const,
  },
  friends: {
    list: (limit?: number) => ['friends', 'list', limit ?? 5] as const,
    sent: (limit?: number) => ['friends', 'sent', limit ?? 5] as const,
    received: (limit?: number) => ['friends', 'received', limit ?? 5] as const,
    searchAll: (keyword: string) => ['friends', 'search', 'all', keyword] as const,
    searchSent: (keyword: string) => ['friends', 'search', 'sent', keyword] as const,
    searchReceived: (keyword: string) => ['friends', 'search', 'received', keyword] as const,
    searchMy: (keyword: string) => ['friends', 'search', 'my', keyword] as const,
  },
  emotions: {
    like: (emotionId: number | string) => ['emotions', 'like', emotionId] as const,
  },
} as const;

export type QueryKeyLike = ReturnType<
  | typeof QK.auth.verify
  | typeof QK.auth.notifications
  | typeof QK.diaries.list
  | typeof QK.diaries.detail
  | typeof QK.diaries.today
  | typeof QK.diaries.month
  | typeof QK.diaries.date
  | typeof QK.friends.list
  | typeof QK.friends.sent
  | typeof QK.friends.received
  | typeof QK.friends.searchAll
  | typeof QK.friends.searchSent
  | typeof QK.friends.searchReceived
  | typeof QK.friends.searchMy
  | typeof QK.emotions.like
>;
