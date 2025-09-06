export const getErrorMessage = (err: unknown): string => {
  const e = err as any;

  if (typeof e?.response?.data?.message === 'string') return e.response.data.message;
  if (typeof e?.data?.message === 'string') return e.data.message;

  const tryParse = (s: string) => {
    try {
      const j = JSON.parse(s);
      if (typeof j?.message === 'string') return j.message;
    } catch {}
    const m = s.match(/"message"\s*:\s*"([^"]+)"/);
    return m ? m[1] : s;
  };

  if (typeof e?.message === 'string') return tryParse(e.message);
  if (typeof err === 'string') return tryParse(err);

  return '요청에 실패했어요.';
};
