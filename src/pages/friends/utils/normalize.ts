export type DiaryPreview = {
  id: number | string;
  title?: string | null;
  preview?: string | null;
  createdAt: string;
};

type RowLike = {
  id?: number | string;
  diaryId?: number | string;
  title?: string;
  preview?: string;
  content?: string;
  createdAt?: string;
  date?: string;
};

type PageLike = { data?: { data?: unknown[] } } | { data?: unknown[] } | { content?: unknown[] };

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

export function normalizeDiary(row: unknown): DiaryPreview | null {
  if (!isObject(row)) return null;
  const r = row as RowLike;

  const id =
    typeof r.id === 'number' || typeof r.id === 'string'
      ? r.id
      : typeof r.diaryId === 'number' || typeof r.diaryId === 'string'
        ? r.diaryId
        : null;
  if (id == null) return null;

  const title = typeof r.title === 'string' ? r.title : null;
  const preview =
    typeof r.preview === 'string' ? r.preview : typeof r.content === 'string' ? r.content : null;

  const createdAt =
    typeof r.createdAt === 'string'
      ? r.createdAt
      : typeof r.date === 'string'
        ? r.date
        : new Date().toISOString();

  return { id, title, preview, createdAt };
}

export function extractDiariesFromPage(page: unknown): DiaryPreview[] {
  if (!isObject(page)) return [];

  const fromNested =
    isObject((page as any).data) &&
    Array.isArray((page as { data: { data?: unknown[] } }).data?.data)
      ? (page as { data: { data: unknown[] } }).data.data
      : null;

  const fromData = Array.isArray((page as { data?: unknown[] }).data)
    ? (page as { data: unknown[] }).data
    : null;

  const fromContent = Array.isArray((page as { content?: unknown[] }).content)
    ? (page as { content: unknown[] }).content
    : null;

  const rows: unknown[] = fromNested ?? fromData ?? fromContent ?? [];
  return rows.map(normalizeDiary).filter((v): v is DiaryPreview => v !== null);
}

export function diaryDetailPath(friendId: string, diaryId: number | string) {
  return `/friends/${encodeURIComponent(friendId)}/diary/${String(diaryId)}`;
}
