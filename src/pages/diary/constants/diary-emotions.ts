import AloneIcon from '@assets/icons/alone.svg?react';
import AngryIcon from '@assets/icons/angry.svg?react';
import AnnoyIcon from '@assets/icons/annoy.svg?react';
import BoringIcon from '@assets/icons/boring.svg?react';
import CryIcon from '@assets/icons/cry.svg?react';
import DisappointIcon from '@assets/icons/disappoint.svg?react';
import EmbrassedIcon from '@assets/icons/embrassed.svg?react';
import ExcitingIcon from '@assets/icons/exciting.svg?react';
import FunnyIcon from '@assets/icons/funny.svg?react';
import GladIcon from '@assets/icons/glad.svg?react';
import HappyIcon from '@assets/icons/happy.svg?react';
import LethargyIcon from '@assets/icons/lethargy.svg?react';
import NervousIcon from '@assets/icons/nervous.svg?react';
import PeaceIcon from '@assets/icons/peace.svg?react';
import RegretIcon from '@assets/icons/regret.svg?react';
import SadIcon from '@assets/icons/sad.svg?react';
import SurpriseIcon from '@assets/icons/surprise.svg?react';
import TensionIcon from '@assets/icons/tension.svg?react';
import TiredIcon from '@assets/icons/tired.svg?react';
import TouchedIcon from '@assets/icons/touched.svg?react';

export const DIARY_EMOTIONS = [
  { id: '행복', Icon: HappyIcon },
  { id: '우울', Icon: SadIcon },
  { id: '신남', Icon: ExcitingIcon },
  { id: '분노', Icon: AngryIcon },
  { id: '피곤', Icon: TiredIcon },
  { id: '놀람', Icon: SurpriseIcon },
  { id: '슬픔', Icon: CryIcon },
  { id: '불안', Icon: NervousIcon },
  { id: '외로움', Icon: AloneIcon },
  { id: '무기력', Icon: LethargyIcon },
  { id: '기쁨', Icon: GladIcon },
  { id: '설렘', Icon: FunnyIcon },
  { id: '감동', Icon: TouchedIcon },
  { id: '짜증', Icon: AnnoyIcon },
  { id: '후회', Icon: RegretIcon },
  { id: '당황', Icon: EmbrassedIcon },
  { id: '긴장', Icon: TensionIcon },
  { id: '지루함', Icon: BoringIcon },
  { id: '실망', Icon: DisappointIcon },
  { id: '평온', Icon: PeaceIcon },
] as const;

export type EmotionId = (typeof DIARY_EMOTIONS)[number]['id'];
export type ReactionCounts = Record<EmotionId, number>;

export const DIARY_COUNT: ReactionCounts = {
  행복: 0,
  우울: 0,
  신남: 0,
  분노: 0,
  피곤: 0,
  놀람: 0,
  슬픔: 0,
  불안: 0,
  외로움: 0,
  무기력: 0,
  기쁨: 0,
  설렘: 0,
  감동: 0,
  짜증: 0,
  후회: 0,
  당황: 0,
  긴장: 0,
  지루함: 0,
  실망: 0,
  평온: 0,
};
