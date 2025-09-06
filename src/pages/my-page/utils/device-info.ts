export const getDeviceInfo = () => {
  const ua = navigator.userAgent ?? '';
  const plat = (navigator as any).userAgentData?.platform ?? navigator.platform ?? '';
  return `${plat} / ${ua}`.slice(0, 180);
};
