import Img1 from '@assets/images/onboarding1.png';
import Img2 from '@assets/images/onboarding2.png';
import Img3 from '@assets/images/onboarding3.png';

export const ONBOARDING_SLIDES = [
  { id: 'onb-1', src: Img1 },
  { id: 'onb-2', src: Img2 },
  { id: 'onb-3', src: Img3 },
] as const;

export type OnboardingSlide = (typeof ONBOARDING_SLIDES)[number];
