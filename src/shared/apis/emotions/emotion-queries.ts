import { BASE_URL, ENDPOINTS } from '@apis/constants/endpoints';
import { buildQuery } from '@apis/factory';

type EmotionDatum = { emotionType: string; likes: number };
type ReportResponse = {
  statusCode: number;
  message: string;
  data: {
    thisWeekEmotionData: EmotionDatum[];
    lastWeekEmotionData: EmotionDatum[];
  };
};

export type EmotionItem = { label: string; prev: number; curr: number };

function toItems(data: ReportResponse['data']): EmotionItem[] {
  const lastMap = new Map(data.lastWeekEmotionData.map((d) => [d.emotionType, d.likes]));
  const thisMap = new Map(data.thisWeekEmotionData.map((d) => [d.emotionType, d.likes]));
  const labels = Array.from(new Set([...lastMap.keys(), ...thisMap.keys()]));
  return labels.map((label) => ({
    label,
    prev: lastMap.get(label) ?? 0,
    curr: thisMap.get(label) ?? 0,
  }));
}

export const emotionQueries = {
  report: () =>
    buildQuery<EmotionItem[]>(
      ['emotion', 'report'],
      async () => {
        const token = localStorage.getItem('access_token');

        const res = await fetch(`${BASE_URL}${ENDPOINTS.emotions.report}`, {
          credentials: 'include',
          headers: {
            accept: '*/*',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) throw new Error('failed to fetch emotion report');
        const json: ReportResponse = await res.json();
        return toItems(json.data);
      },
      { staleTime: 60_000 },
    ),
};
