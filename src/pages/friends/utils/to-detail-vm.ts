export type DetailVM = {
  id: number | string;
  title: string;
  content: string;
  createdAt: string;
  emotions: string[];
  fromNickname?: string;
};

type RawEmotion =
  | string
  | {
      name?: string;
      count?: number;
    };

type RawDetail = {
  id?: number | string;
  diaryId?: number | string;
  title?: string;
  content?: string;
  body?: string;
  createdAt?: string;
  date?: string;
  emotions?: RawEmotion[];
  emotionList?: RawEmotion[];
  fromNickname?: string;
  data?: unknown;
};

export function toDetailVM(res: unknown): DetailVM | null {
  const root: RawDetail | null =
    typeof res === 'object' && res !== null ? ((res as { data?: RawDetail }).data ?? res) : null;

  if (!root || typeof root !== 'object') return null;
  if (Array.isArray(root.data)) return null;
  if (Array.isArray((root as { data?: { data?: unknown[] } }).data?.data)) return null;

  const id = root.id ?? root.diaryId;
  const title = root.title;
  const content = root.content ?? root.body;
  const createdAt = root.createdAt ?? root.date;

  const emSrc: RawEmotion[] = root.emotions ?? root.emotionList ?? [];
  const emotions: string[] = Array.isArray(emSrc)
    ? emSrc
        .map((e) =>
          typeof e === 'string'
            ? e
            : e?.name
              ? e.count !== undefined
                ? `${e.name} (${e.count})`
                : e.name
              : '',
        )
        .filter((e): e is string => e.length > 0)
    : [];

  const fromNickname = root.fromNickname;

  const has =
    (id !== undefined && `${id}`.trim() !== '') ||
    (typeof title === 'string' && title.trim() !== '') ||
    (typeof content === 'string' && content.trim() !== '') ||
    (typeof createdAt === 'string' && createdAt.trim() !== '') ||
    emotions.length > 0;

  if (!has) return null;

  return {
    id: id ?? '',
    title: title ?? '',
    content: content ?? '',
    createdAt: createdAt ?? '',
    emotions,
    fromNickname,
  };
}
